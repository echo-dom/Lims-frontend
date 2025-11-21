<template>
    <el-container class="container">
        <div class="table-header">
            <div class="table-title">
                <span class="title-text">{{ title }}</span>
                <el-tag type="info" size="small" class="record-count">共 {{ total }} 条记录</el-tag>
            </div>
            <div class="table-actions">
                <el-dropdown trigger="click" placement="bottom-end">
                    <el-button type="primary" plain>
                        <el-icon>
                            <Operation />
                        </el-icon> 自定义列
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu class="column-selector">
                            <div class="dropdown-header">
                                <el-checkbox v-model="selectAllColumns" :indeterminate="isIndeterminate"
                                    @change="handleSelectAll">
                                    列显示配置
                                </el-checkbox>
                            </div>
                            <el-divider style="margin: 5px 0" />
                            <el-checkbox-group v-model="selectedColumns" class="column-checkbox-group">
                                <el-checkbox v-for="col in localColumns" :key="col.prop" :value="col.prop"
                                    class="column-checkbox">
                                    <span class="column-label">{{ col.label }}</span>
                                    <el-tag v-if="col.type" size="small" effect="plain" class="type-tag">
                                        {{ getColumnTypeName(col.type) }}
                                    </el-tag>
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-tooltip content="刷新数据" placement="top">
                    <el-button circle @click="onRefresh">
                        <el-icon>
                            <Refresh />
                        </el-icon>
                    </el-button>
                </el-tooltip>
            </div>
        </div>

        <el-config-provider :locale="locale">
            <div class="table-container">
                <el-table ref="tableRef" :data="tableData" v-loading.lock="loading"
                    @selection-change="handleSelectionChange" @row-click="handleRowClick" highlight-current-row stripe
                    border class="custom-table" :header-cell-style="headerCellStyle">
                    <el-table-column fixed type="selection" width="55" align="center" />
                    <el-table-column v-for="col in visibleColumns"  :key="col.prop" :prop="col.prop" :label="col.label"
                        :width="col.width" :min-width="col.minWidth || 120" align="center" show-overflow-tooltip
                        :fixed="col.fixed" :filters="buildFilter(col.prop)" :filter-method="filterHandler" sortable>
                        <template #header>
                            <div class="column-title">{{ col.label }}</div>
                            <div class="filter-container">
                                <el-input v-if="!col.type" v-model="col.keyword" @keyup.enter.native="onSearchDebounced"
                                    size="small" placeholder="搜索" clearable class="filter-input">
                                    <template #prefix>
                                        <el-icon>
                                            <Search />
                                        </el-icon>
                                    </template>
                                </el-input>
                                <div v-if="col.type === 'date'" class="date-filter">
                                    <el-date-picker v-model="col.keyword" type="date" placeholder="开始日期" size="small"
                                        value-format="YYYY-MM-DD" @change="onSearchDebounced" class="date-picker" />
                                    <span class="date-separator">至</span>
                                    <el-date-picker v-model="col.keyword2" type="date" placeholder="结束日期" size="small"
                                        value-format="YYYY-MM-DD" @change="onSearchDebounced" class="date-picker" />
                                </div>
                            </div>
                        </template>
                        <template v-if="typeof col.renderer === 'function'" #default="scope">
                            <div v-html="col.renderer(scope)"></div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination
                        v-model:current-page="currentPage"
                        v-model:page-size="pageSize"
                        :page-sizes="[10, 20, 50, 100, 200]"
                        :background="true"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        @size-change="onPageSizeChange"
                        @current-change="onPageChange"
                        class="custom-pagination"
                    />
                    </div>
            </div>
        </el-config-provider>
    </el-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ElMessage, ElTable, ElTag, ElDivider, ElTooltip } from 'element-plus';
import { Operation, Refresh, Search } from '@element-plus/icons-vue';
import { formatDateByYMD, getColumnTypeName } from '@/utils/utils';
import { debounce } from 'lodash-es';

const props = defineProps({
    columnList: { type: Array, default: () => [] },
    getDataApi: { type: Function, required: true },
    title: { type: String, default: '数据列表' }
});
const emits = defineEmits(['dataLoaded']);

const router = useRouter();
const tableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<any[]>([]);
const loading = ref(false);
const tableData = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

// Local copy of columns to avoid mutating props
const localColumns = ref(
    props.columnList.map(col => ({ ...col, keyword: '', keyword2: '' }))
);
watch(
    () => props.columnList,
    (newList) => {
        localColumns.value = newList.map(col => ({ ...col, keyword: '', keyword2: '' }));
        // reset selectedColumns when columnList changes
        selectedColumns.value = localColumns.value.map(col => col.prop);
    },
    { deep: true }
);

// Column visibility
const selectedColumns = ref(localColumns.value.map(col => col.prop));
const selectAllColumns = ref(true);
const isIndeterminate = computed(() => {
    return selectedColumns.value.length > 0 && selectedColumns.value.length < localColumns.value.length;
});
const handleSelectAll = (val: boolean) => {
    selectedColumns.value = val ? localColumns.value.map(col => col.prop) : [];
};
const visibleColumns = computed(() => {
    return localColumns.value.filter(col => selectedColumns.value.includes(col.prop));
});

// Filters cache
const filters = ref<Record<string, Array<{ text: any; value: any }>>>({});
watch(tableData, () => {
    filters.value = {}; // reset filters when data changes
});
const buildFilter = (key: string) => {
    if (filters.value[key]) return filters.value[key];
    if (!tableData.value.length) return [];
    const uniqueValues = new Set<any>();
    const arr: Array<{ text: any; value: any }> = [];
    tableData.value.forEach(item => {
        const v = item[key];
        if (v != null && !uniqueValues.has(v)) {
            uniqueValues.add(v);
            arr.push({ text: v, value: v });
        }
    });
    filters.value[key] = arr;
    return arr;
};

const filterHandler = (value: any, row: any, column: any) => {
    const property = column.property;
    return row[property] === value;
};

// Search and data fetch
const getData = async (searchParams: Record<string, any> = {}) => {
    loading.value = true;
    const params = {
        page: currentPage.value,
        start: pageSize.value * (currentPage.value - 1),
        limit: pageSize.value,
        ...searchParams
        // jsonString: JSON.stringify({ cond: { ...searchParams } })
    };
    try {
        const res = await props.getDataApi(params);
        if (res) {
            tableData.value = res.rows || [];
            total.value = res.total || 0;
            emits('dataLoaded', tableData.value);
        }
    } catch (error) {
        console.error('数据加载失败:', error);
        ElMessage.error('数据加载失败，请稍后重试');
    } finally {
        loading.value = false;
    }
};

// Build search params
const buildSearchParams = () => {
    const params: Record<string, any> = {};
    localColumns.value.forEach(col => {
        if (col.type === 'date') {
            if (col.keyword) params[`${col.prop}_start`] = formatDateByYMD(col.keyword, 'yyyy-MM-dd');
            if (col.keyword2) params[`${col.prop}_end`] = formatDateByYMD(col.keyword2, 'yyyy-MM-dd');
        } else if (col.keyword !== undefined && col.keyword !== '') {
            params[col.prop] = `%${col.keyword}%`;
        }
    });
    return params;
};
const onSearch = () => {
    currentPage.value = 1;
    const params = buildSearchParams();
    getData(params);
};
const onSearchDebounced = debounce(onSearch, 300);

// Pagination
const onPageSizeChange = (newSize: number) => {
    pageSize.value = newSize;
    onSearch();
};
const onPageChange = (newPage: number) => {
    currentPage.value = newPage;
    onSearch();
};

// Refresh
const onRefresh = () => {
    // clear search
    localColumns.value.forEach(col => {
        col.keyword = '';
        col.keyword2 = '';
    });
    filters.value = {};
    currentPage.value = 1;
    getData();
};

// Row selection
const handleSelectionChange = (val: any[]) => {
    multipleSelection.value = val;
};
const handleRowClick = (row: any) => {
    tableRef.value?.clearSelection();
    tableRef.value?.toggleRowSelection(row, true);
};

// Watch router change to reload
watch(
    () => router.currentRoute.value.path,
    () => { onRefresh(); },
    { immediate: true }
);

onMounted(() => {
    getData();
});

// Header style
const headerCellStyle = computed(() => ({
    fontSize: '14px',
    fontWeight: '600',
    color: '#303133',
    backgroundColor: '#f5f7fa',
    padding: '8px 0'
}));

// Locale
const locale = computed(() => zhCn);
</script>

<style scoped>
/* 样式保持不变 */
.container {
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.table-title {
    display: flex;
    align-items: center;
    gap: 12px;
}

.title-text {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
}

.record-count {
    font-size: 12px;
    height: 24px;
    line-height: 22px;
}

.table-actions {
    display: flex;
    gap: 10px;
}

.table-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.custom-table {
    flex: 1;
    font-size: 13px;
    border-radius: 6px;
    overflow: hidden;
    --el-table-border-color: #ebeef5;
    --el-table-header-bg-color: #f5f7fa;
}

.custom-table :deep(.el-table__header) {
    font-size: 14px;
    font-weight: 600;
}

.custom-table :deep(.el-table__body) {
    font-size: 13px;
}

.column-title {
    font-weight: 600;
    color: #303133;
    padding: 2px;
    text-align: left;
    padding-right: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.filter-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.filter-input {
    width: 100%;
}

.filter-input :deep(.el-input__inner) {
    height: 28px;
    line-height: 28px;
}

.date-filter {
    display: flex;
    align-items: center;
    gap: 4px;
}

.date-picker {
    flex: 1;
}

.date-picker :deep(.el-input__inner) {
    height: 28px;
    line-height: 28px;
}

.date-separator {
    font-size: 12px;
    color: #909399;
    white-space: nowrap;
}

.custom-pagination {
    margin-top: 16px;
    padding: 8px 0;
    background: #fff;
    border-radius: 4px;
}

:deep(.el-pagination__total) {
    margin-right: 12px;
}

:deep(.el-pagination__jump) {
    margin-left: 12px;
}

.column-selector {
    max-height: 400px;
    overflow-y: auto;
    padding: 8px 0;
}

.dropdown-header {
    padding: 5px 15px;
    font-weight: 600;
    color: #303133;
}

.column-checkbox-group {
    display: flex;
    flex-direction: column;
    padding: 0 15px;
}

.column-checkbox {
    display: flex;
    align-items: center;
    height: 36px;
    padding: 0 5px;
    transition: background-color 0.2s;
}

.column-checkbox:hover {
    background-color: #f5f7fa;
}

.column-label {
    margin-right: 8px;
}

.type-tag {
    font-size: 10px;
    padding: 0 5px;
    height: 18px;
    line-height: 17px;
}

:deep(.caret-wrapper) {
    position: absolute;
    top: 15px;
    right: 14px;
}

:deep(.el-table__column-filter-trigger.el-none-outline.el-tooltip__trigger.el-tooltip__trigger) {
    position: absolute;
    top: 9px;
    right: 4px;
}
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 0px;
  padding: 8px 0;
  background: #fff;
  border-radius: 4px;
}
</style>
