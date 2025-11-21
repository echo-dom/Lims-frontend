<template> 
    <el-container class="a-container">
        <!-- 表头区域：标题、记录数、自定义列、刷新 -->
        <div class="table-header">
            <div class="table-title">
                <el-row :gutter="10" class="mb8">
                    <el-col v-for="button in buttonlist" :span="1.5">
                        <el-button :disabled="handleButtonDisabled(button.disabled as string|boolean)" :size="button.size" :loading="button.loading" :type="button.type" :plain="button.plain || true" :icon="button.icon" @click="button.onClick" v-hasPermi="[button.hasPermi]">
                            {{ button.label }}
                        </el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="table-actions">
                <!-- 自定义列显示 -->
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
                                <el-checkbox v-for="col in localColumns" :key="col.prop" :label="col.prop"
                                    class="column-checkbox" :value="col.prop">
                                    <span class="column-label">{{ col.label }}</span>
                                    <el-tag v-if="col.type" size="small" effect="plain" class="type-tag">
                                        {{ getColumnTypeName(col.type) }}
                                    </el-tag>
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <!-- 刷新按钮 -->
                <el-tooltip content="刷新数据" placement="top">
                    <el-button circle @click="onRefresh">
                        <el-icon>
                            <Refresh />
                        </el-icon>
                    </el-button>
                </el-tooltip>
            </div>
        </div>

        <!-- 虚拟表格容器 -->
        <div class="virtual-table-container" ref="tableContainer">
            <el-table-v2
                v-if="mounted"
                ref="tableRef"
                :columns="v2Columns"
                :data="tableData"
                :width="tableWidth"
                :height="tableHeight"
                :row-height="rowHeight"
                :fixed="fixedColumnsCount"
                :estimated-row-height="estimatedRowHeight"
                :row-key="getRowKey"
                :sort-by="sortState"
                @column-sort="handleSort"
                @row-event="handleRowClick"
                @scroll="handleScroll"
                v-loading.lock="loading"
                :class="['custom-table', { 'has-selection': showSelection }]"
            >
                <!-- 复选框列 -->
                <template v-if="showSelection" #header="props">
                    <div class="v2-header-cell" :style="props.style">
                        <el-checkbox
                            :model-value="allSelected"
                            @change="toggleAllSelection"
                        />
                    </div>
                </template>
                <template v-if="showSelection" #cell="props">
                    <div class="v2-body-cell" :style="props.style">
                        <el-checkbox
                            :model-value="isRowSelected(props.rowData)"
                            @change="(val) => toggleRowSelection(props.rowData, val)"
                        />
                    </div>
                </template>

                <!-- 序号列 -->
                <template #header-index>
                    <div class="v2-header-cell">序号</div>
                </template>
                <template #cell-index="props">
                    <div class="v2-body-cell" :style="props.style">
                        {{ (currentPage - 1) * pageSize + props.rowIndex + 1 }}
                    </div>
                </template>

                <!-- 动态列 -->
                <template v-for="col in visibleColumns" :key="col.prop" #[`header-${col.prop}`]>
                    <div class="v2-header-cell">
                        <div class="column-title" :class="col.editable?'editable-row':''">{{ col.label }}</div>
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
                    </div>
                </template>

                <template v-for="col in visibleColumns" :key="col.prop" #[`cell-${col.prop}`]="scope">
                    <div 
                        class="v2-body-cell" 
                        :class="{ editing: isEditing(scope.rowData, col.prop) }"
                        :style="scope.style"
                    >
                        <!-- 非编辑状态 -->
                        <div 
                            v-if="!isEditing(scope.rowData, col.prop)"
                            class="cell-content"
                            :class="{ 'editable-cell': col.editable }"
                            @click="col.editable ? startEdit(scope.rowData, col) : null"
                        >
                            <template v-if="scope.rowData[col.prop] !== undefined && scope.rowData[col.prop] !== null && scope.rowData[col.prop] !== ''">
                                <span class="cell-text">
                                    <template v-if="col.type === 'date'">
                                        {{ formatDateByYMD(scope.rowData[col.prop], 'yyyy-MM-dd') }}
                                    </template>
                                    <template v-else>
                                        {{ scope.rowData[col.prop] }}
                                    </template>
                                </span>
                            </template>
                            <template v-else>
                                <span class="cell-empty-placeholder" style="visibility: hidden;">&nbsp;</span>
                            </template>
                        </div>

                        <!-- 编辑状态 -->
                        <div v-else class="editing-cell-wrapper">
                            <!-- 文本编辑 -->
                            <el-input v-if="!col.editType || col.editType === 'text'"
                                v-model="editCache[getRowKey(scope.rowData)][col.prop]" size="small"
                                class="edit-input" :ref="setInputRef(getRowKey(scope.rowData), col.prop)"
                                @blur="() => saveEdit(scope.rowData, col)"
                                @keyup.enter.native="() => saveEdit(scope.rowData, col)"
                                :data-row-key="getRowKey(scope.rowData)" :data-prop="col.prop"
                                style="width: 100%;" />
                            <!-- 数字编辑 -->
                            <el-input-number v-else-if="col.editType === 'number'"
                                v-model="editCache[getRowKey(scope.rowData)][col.prop]" size="small"
                                @blur="() => saveEdit(scope.rowData, col)" @change="() => saveEdit(scope.rowData, col)"
                                style="width: 100%;" />
                            <!-- 日期编辑 -->
                            <el-date-picker v-else-if="col.editType === 'date'"
                                v-model="editCache[getRowKey(scope.rowData)][col.prop]" type="date" size="small"
                                value-format="YYYY-MM-DD" @change="() => saveEdit(scope.rowData, col)"
                                @blur="() => saveEdit(scope.rowData, col)" style="width: 100%;" />
                            <!-- 下拉编辑 -->
                            <el-select v-else-if="col.editType === 'select' && col.options"
                                v-model="editCache[getRowKey(scope.rowData)][col.prop]" size="small"
                                @change="() => saveEdit(scope.rowData, col)" style="width: 100%;">
                                <el-option v-for="opt in col.options" :key="opt.value" :label="opt.label"
                                    :value="opt.value" />
                            </el-select>
                            <!-- fallback 文本 -->
                            <el-input v-else v-model="editCache[getRowKey(scope.rowData)][col.prop]" size="small"
                                @blur="() => saveEdit(scope.rowData, col)"
                                @keyup.enter.native="() => saveEdit(scope.rowData, col)" style="width: 100%;" />
                        </div>
                    </div>
                </template>
            </el-table-v2>
        </div>

        <!-- 分页 -->
        <div class="pagination-container">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100, 200, 500, 1000]" :background="true"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="onPageSizeChange"
                @current-change="onPageChange" class="custom-pagination" />
        </div>
    </el-container>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, computed, nextTick, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ElMessage, ElTableV2,  } from 'element-plus';
import { Operation, Refresh, Search } from '@element-plus/icons-vue';
import { formatDateByYMD, getColumnTypeName } from '@/utils/utils';
import { debounce } from 'lodash-es';
import type { Column, SortBy } from 'element-plus';

interface ColumnItem {
    prop: string;
    label: string;
    width?: number;
    minWidth?: number;
    fixed?: `boolean | 'left' | 'right'`;
    type?: string;
    keyword?: any;
    keyword2?: any;
    editable?: boolean;
    editType?: string;
    options?: Array<{ label: string; value: any }>;
    sortable?: boolean;
    filterable?: boolean;
}

interface ButtonItem {
  label: string;
  icon?: string;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'large' | 'default' | 'small';
  plain?: boolean;
  round?: boolean;
  circle?: boolean;
  disabled?: string | boolean;
  loading?: boolean;
  tooltip?: string;
  visible?: boolean;
  confirm?: string;
  onClick?: () => void;
  hasPermi: string;
}

const props = defineProps<{
    columnList: ColumnItem[];
    getDataApi: (params: Record<string, any>) => Promise<{ rows: any[]; total: number }>;
    updateDataApi?: (payload: Record<string, any>) => Promise<any>;
    title?: string;
    buttonlist: ButtonItem[];
}>();
const emits = defineEmits<{
    (e: 'dataLoaded', data: any[]): void;
    (e: 'handleSelectionChange', data: any[]): void;
}>();

const router = useRouter();
const tableRef = ref<InstanceType<typeof ElTableV2>>();
const tableContainer = ref<HTMLElement>();
const loading = ref(false);
const tableData = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const single = ref(true);
const multiple = ref(true);
const mounted = ref(false);
const tableWidth = ref(1200);
const tableHeight = ref(600);
const rowHeight = ref(50);
const estimatedRowHeight = ref(50);

// 虚拟表格配置
const fixedColumnsCount = ref(2); // 固定列数（选择和序号）
const showSelection = ref(true); // 是否显示选择列
const sortState = ref<SortBy>({ key: '', order: null });

// 本地列配置拷贝
const localColumns = ref<ColumnItem[]>(
    props.columnList.map(col => ({ 
        ...col, 
        width: col.width || col.minWidth || 180,
        keyword: '', 
        keyword2: '' 
    }))
);
// 搜索/筛选缓存
const filters = ref<Record<string, Array<{ text: any; value: any }>>>({});
watch(
    () => props.columnList,
    (newList) => {
        localColumns.value = newList.map(col => ({ 
            ...col, 
            width: col.width || col.minWidth || 180,
            keyword: '', 
            keyword2: '' 
        }));
        selectedColumns.value = localColumns.value.map(col => col.prop);
        updateV2Columns();
    },
    { deep: true }
);

// 列显示控制
const selectedColumns = ref<string[]>(localColumns.value.map(col => col.prop));
const selectAllColumns = ref(true);
const isIndeterminate = computed(() => {
    return selectedColumns.value.length > 0 && selectedColumns.value.length < localColumns.value.length;
});
const handleSelectAll = (val: boolean) => {
    selectedColumns.value = val ? localColumns.value.map(col => col.prop) : [];
    updateV2Columns();
};
const visibleColumns = computed(() => {
    return localColumns.value.filter(col => selectedColumns.value.includes(col.prop));
});

// 虚拟表格列配置
const v2Columns = ref<Column<any>[]>([]);
function updateV2Columns() {
    const cols: Column<any>[] = [];
    
    // 选择列
    // if (showSelection.value) {
    //     cols.push({
    //         key: 'selection',
    //         dataKey: 'selection',
    //         title: '选择',
    //         width: 55,
    //         fixed: 'left',
    //         cellRenderer: () => {}, // 使用插槽
    //         headerCellRenderer: () => {}, // 使用插槽
    //     });
    // }
    
    // 序号列
    // cols.push({
    //     key: 'index',
    //     dataKey: 'index',
    //     title: '序号',
    //     width: 55,
    //     fixed: 'left',
    //     cellRenderer: () => {}, // 使用插槽
    //     headerCellRenderer: () => {}, // 使用插槽
    // });
    
    // 动态列
    console.log(visibleColumns.value)
    visibleColumns.value.forEach(col => {
      console.log(col.label,col.prop)
        cols.push({
            key: col.prop,
            dataKey: col.prop,
            title: col.label,
            width: col.width || 180,
            // fixed: col.fixed,
            // sortable: col.sortable,
        });
    });
    console.log(cols)
    v2Columns.value = cols;
}

// 行选择相关
const selectedRowKeys = ref<(string | number)[]>([]);
const allSelected = computed(() => {
    return selectedRowKeys.value.length === tableData.value.length && tableData.value.length > 0;
});

function isRowSelected(row: any) {
    return selectedRowKeys.value.includes(getRowKey(row));
}

function toggleRowSelection(row: any, selected: boolean) {
    const key = getRowKey(row);
    if (selected) {
        if (!selectedRowKeys.value.includes(key)) {
            selectedRowKeys.value.push(key);
        }
    } else {
        selectedRowKeys.value = selectedRowKeys.value.filter(k => k !== key);
    }
    updateSelectionState();
    emits('handleSelectionChange', getSelectedRows());
}

function toggleAllSelection(selected: boolean) {
    if (selected) {
        selectedRowKeys.value = tableData.value.map(row => getRowKey(row));
    } else {
        selectedRowKeys.value = [];
    }
    updateSelectionState();
    emits('handleSelectionChange', getSelectedRows());
}

function getSelectedRows() {
    return tableData.value.filter(row => selectedRowKeys.value.includes(getRowKey(row)));
}

function updateSelectionState() {
    const count = selectedRowKeys.value.length;
    single.value = count !== 1;
    multiple.value = count === 0;
}

// 排序处理
function handleSort({ column, key, order }: { column: Column; key: string; order: 'asc' | 'desc' | null }) {
    sortState.value = { key, order };
    // 触发排序搜索
    onSearchDebounced();
}

// 维护“编辑状态”及缓存
const editingCell = ref<{ rowKey: string | number; prop: string } | null>(null);
const editCache = reactive<Record<string | number, Record<string, any>>>({});

function getRowKey(row: any): string | number {
    return row.id ?? row._rowId;
}

const inputRefMap = reactive<Record<string, HTMLInputElement | null>>({});
function setInputRef(rowKey: string | number, prop: string) {
    return `${rowKey}-${prop}`;
}

function focusInput(rowKey: string | number, prop: string) {
    nextTick(() => {
        const selector = `input[data-row-key="${rowKey}"][data-prop="${prop}"], textarea[data-row-key="${rowKey}"][data-prop="${prop}"]`;
        const el = document.querySelector<HTMLInputElement>(selector);
        if (el) {
            el.focus();
            el.select?.();
        }
    });
}

function startEdit(row: any, col: ColumnItem) {
    const rowKey = getRowKey(row);
    if (editingCell.value) {
        cancelEdit();
    }
    if (!editCache[rowKey]) {
        editCache[rowKey] = {};
    }
    editCache[rowKey][col.prop] = row[col.prop];
    editingCell.value = { rowKey, prop: col.prop };
    focusInput(rowKey, col.prop);
}

function isEditing(row: any, prop: string): boolean {
    if (!editingCell.value) return false;
    return editingCell.value.rowKey === getRowKey(row) && editingCell.value.prop === prop;
}

async function saveEdit(row: any, col: ColumnItem) {
    const rowKey = getRowKey(row);
    if (!editingCell.value || editingCell.value.prop !== col.prop) return;
    const newValue = editCache[rowKey]?.[col.prop];
    
    if (newValue === row[col.prop]) {
        editingCell.value = null;
        return;
    };
    
    row[col.prop] = newValue;
    
    if (props.updateDataApi) {
        try {
            await props.updateDataApi(row);
            ElMessage.success('保存成功');
        } catch (err) {
            console.error('保存失败', err);
            ElMessage.error('保存失败');
        }
    }
    
    editingCell.value = null;
    if (editCache[rowKey]) {
        delete editCache[rowKey][col.prop];
        if (Object.keys(editCache[rowKey]).length === 0) {
            delete editCache[rowKey];
        }
    }
}

function cancelEdit() {
    if (editingCell.value) {
        const { rowKey, prop } = editingCell.value;
        if (editCache[rowKey]) {
            delete editCache[rowKey][prop];
            if (Object.keys(editCache[rowKey]).length === 0) {
                delete editCache[rowKey];
            }
        }
    }
    editingCell.value = null;
}

// 数据获取
async function getData(searchParams: Record<string, any> = {}) {
    if (editingCell.value) {
        cancelEdit();
    }
    Object.keys(editCache).forEach(k => delete editCache[k]);

    loading.value = true;
    const params = {
        pageNum: currentPage.value,
        start: pageSize.value * (currentPage.value - 1),
        pageSize: pageSize.value,
        sortField: sortState.value.key,
        sortOrder: sortState.value.order,
        ...searchParams
    };
    try {
        const res = await props.getDataApi(params);
        if (res) {
            const rows = (res.rows || []).map((item: any, idx: number) => {
                if (item.id == null) {
                    return { ...item, _rowId: `${Date.now()}-${Math.random()}-${idx}` };
                }
                return item;
            });
            console.log(rows)
            tableData.value = rows;
            total.value = res.total || 0;
            selectedRowKeys.value = []; // 重置选择
            updateSelectionState();
            emits('dataLoaded', tableData.value);
        }
    } catch (error) {
        console.error('数据加载失败:', error);
        ElMessage.error('数据加载失败，请稍后重试');
    } finally {
        loading.value = false;
    }
}

// 搜索相关
function buildSearchParams() {
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
}
function onSearch(init: boolean = false) {
    currentPage.value = !init ? 1 : currentPage.value;
    const params = buildSearchParams();
    getData(params);
}
const onSearchDebounced = debounce(onSearch, 300);

// 分页
function onPageSizeChange(newSize: number) {
    pageSize.value = newSize;
    onSearch(true);
}
function onPageChange(newPage: number) {
    currentPage.value = newPage;
    onSearch(true);
}

// 刷新
function onRefresh() {
    localColumns.value.forEach(col => {
        col.keyword = '';
        col.keyword2 = '';
    });
    filters.value = {};
    sortState.value = { key: '', order: null };
    currentPage.value = 1;
    getData();
}

// 按钮禁用状态
const handleButtonDisabled = (val: string | boolean) => {
    if (val === 'single') return single.value;
    if (val === 'multiple') return multiple.value;
    return val;
};

// 行选择
function handleRowClick(row: any) {
    toggleRowSelection(row, !isRowSelected(row));
}

// 调整表格尺寸
function updateTableSize() {
    if (tableContainer.value) {
        const rect = tableContainer.value.getBoundingClientRect();
        tableWidth.value = rect.width;
        tableHeight.value = rect.height - 10; // 留出边距
    }
}

// 监听路由变化时刷新
watch(
    () => router.currentRoute.value.path,
    () => { onRefresh(); },
    { immediate: true }
);

// 初始加载
onMounted(() => {
    updateV2Columns();
    window.addEventListener('resize', updateTableSize);
    nextTick(() => {
        updateTableSize();
        mounted.value = true;
        getData();
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateTableSize);
});

// 滚动处理（可用于懒加载等）
function handleScroll(scroll: { scrollLeft: number; scrollTop: number }) {
    // 可根据滚动位置实现懒加载等高级功能
}

// 国际化
const locale = computed(() => zhCn);
</script>

<style scoped>
/* 容器样式 */
.a-container {
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

/* 表头 */
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

.table-actions {
    display: flex;
    gap: 10px;
}

/* 虚拟表格容器 */
.virtual-table-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    background-color: #fff;
}

/* 表格单元格样式 */
.v2-header-cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding: 8px;
    font-weight: 600;
    background-color: #f5f7fa;
    border-right: 1px solid #ebeef5;
    box-sizing: border-box;
}

.v2-body-cell {
    display: flex;
    align-items: center;
    padding: 0 8px;
    height: 100%;
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    overflow: hidden;
}

.v2-body-cell.editing {
    background-color: #f0f9eb;
    z-index: 10;
}

.cell-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cell-content.editable-cell {
    cursor: pointer;
}

.cell-content.editable-cell:hover {
    background-color: rgba(64, 158, 255, 0.05);
}

.cell-text {
    display: inline-block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
}

/* 列标题与筛选 */
.column-title {
    font-weight: 600;
    color: #303133;
    padding: 2px 0;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.editable-row {
    color: #409EFF;
}

.filter-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 5px;
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

/* 分页 */
.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding: 8px 0;
    background: #fff;
    border-radius: 4px;
}

.custom-pagination {
    margin-top: 0;
}

/* 自定义列弹框 */
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

/* 编辑输入框 */
.edit-input :deep(.el-input__inner) {
    padding: 2px 8px;
    height: 32px;
}
</style>