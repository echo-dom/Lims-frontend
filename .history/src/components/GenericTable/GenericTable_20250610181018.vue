<template>
    <el-container class="container">
        <!-- 表头区域：标题、记录数、自定义列、刷新 -->
        <div class="table-header">
            <div class="table-title">
                <span class="title-text">{{ title }}</span>
                <el-tag type="info" size="small" class="record-count">共 {{ total }} 条记录</el-tag>
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

        <!-- 表格主体 -->
        <el-config-provider :locale="locale">
            <div class="table-container">
                <el-table ref="tableRef" :data="tableData" v-loading.lock="loading"
                    @selection-change="handleSelectionChange" @row-click="handleRowClick" highlight-current-row stripe
                    border class="custom-table" :header-cell-style="headerCellStyle">
                    <!-- 复选框列 -->
                    <el-table-column fixed type="selection" width="55" align="center" />
                    <!-- 序号列 -->
                    <el-table-column label="序号" fixed type="index" width="55" align="center" />

                    <!-- 动态列 -->
                    <el-table-column v-for="col in visibleColumns" :key="col.prop" :prop="col.prop" :label="col.label"
                        :width="col.width" :min-width="col.minWidth || 120" align="center" show-overflow-tooltip
                        :fixed="col.fixed" :filters="buildFilter(col.prop)" :filter-method="filterHandler" sortable>
                        <!-- 自定义表头：保留搜索/筛选 -->
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

                        <!-- 单元格渲染：展示或编辑 -->
                        <template #default="scope">
                            <div class="cell-wrapper" :class="{ editing: isEditing(scope.row, col.prop) }"
                                style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; position: relative;">
                                <!-- 非编辑状态：如果可编辑，整个区域可点击；若值为空，用占位符保持高度 -->
                                <div v-if="col.editable && !isEditing(scope.row, col.prop)"
                                    class="editable-cell-wrapper" @click="() => startEdit(scope.row, col)"
                                    style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                                    <template
                                        v-if="scope.row[col.prop] !== undefined && scope.row[col.prop] !== null && scope.row[col.prop] !== ''">
                                        <!-- 有值时正常展示，可格式化 -->
                                        <span class="cell-text">
                                            <template v-if="col.type === 'date'">
                                                {{ scope.row[col.prop] ? formatDateByYMD(scope.row[col.prop],
                                                'yyyy-MM-dd') : '' }}
                                            </template>
                                            <template v-else>
                                                {{ scope.row[col.prop] }}
                                            </template>
                                        </span>
                                    </template>
                                    <template v-else>
                                        <!-- 值为空时渲染一个不可见占位，让区域可点 -->
                                        <span class="cell-empty-placeholder" style="visibility: hidden;">&nbsp;</span>
                                    </template>
                                </div>

                                <!-- 非编辑列（只读）或者当前在别处编辑时，普通展示（也可用同样方式撑满区域但不绑定点击）-->
                                <div v-else-if="!col.editable || (col.editable && !isEditing(scope.row, col.prop) === false)"
                                    class="readonly-cell-wrapper"
                                    style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
                                    <template
                                        v-if="scope.row[col.prop] !== undefined && scope.row[col.prop] !== null && scope.row[col.prop] !== ''">
                                        <span class="cell-text">
                                            <template v-if="col.type === 'date'">
                                                {{ scope.row[col.prop] ? formatDateByYMD(scope.row[col.prop],
                                                'yyyy-MM-dd') : '' }}
                                            </template>
                                            <template v-else>
                                                {{ scope.row[col.prop] }}
                                            </template>
                                        </span>
                                    </template>
                                    <template v-else>
                                        <!-- 只读列值为空时，也可渲染占位，或者直接空白，但包裹容器已经撑满 -->
                                        <span class="cell-empty-placeholder" style="visibility: hidden;">&nbsp;</span>
                                    </template>
                                </div>

                                <!-- 编辑状态：此时渲染输入组件 -->
                                <div v-if="isEditing(scope.row, col.prop)" class="editing-cell-wrapper"
                                    style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
                                    <!-- 文本编辑 -->
                                    <el-input v-if="!col.editType || col.editType === 'text'"
                                        v-model="editCache[getRowKey(scope.row)][col.prop]" size="small"
                                        class="edit-input" :ref="setInputRef(getRowKey(scope.row), col.prop)"
                                        @blur="() => saveEdit(scope.row, col)"
                                        @keyup.enter.native="() => saveEdit(scope.row, col)"
                                        :data-row-key="getRowKey(scope.row)" :data-prop="col.prop"
                                        style="width: 100%;" />
                                    <!-- 数字编辑 -->
                                    <el-input-number v-else-if="col.editType === 'number'"
                                        v-model="editCache[getRowKey(scope.row)][col.prop]" size="small"
                                        @blur="() => saveEdit(scope.row, col)" @change="() => saveEdit(scope.row, col)"
                                        style="width: 100%;" />
                                    <!-- 日期编辑 -->
                                    <el-date-picker v-else-if="col.editType === 'date'"
                                        v-model="editCache[getRowKey(scope.row)][col.prop]" type="date" size="small"
                                        value-format="YYYY-MM-DD" @change="() => saveEdit(scope.row, col)"
                                        @blur="() => saveEdit(scope.row, col)" style="width: 100%;" />
                                    <!-- 下拉编辑 -->
                                    <el-select v-else-if="col.editType === 'select' && col.options"
                                        v-model="editCache[getRowKey(scope.row)][col.prop]" size="small"
                                        @change="() => saveEdit(scope.row, col)" style="width: 100%;">
                                        <el-option v-for="opt in col.options" :key="opt.value" :label="opt.label"
                                            :value="opt.value" />
                                    </el-select>
                                    <!-- fallback 文本 -->
                                    <el-input v-else v-model="editCache[getRowKey(scope.row)][col.prop]" size="small"
                                        @blur="() => saveEdit(scope.row, col)"
                                        @keyup.enter.native="() => saveEdit(scope.row, col)" style="width: 100%;" />
                                </div>
                            </div>
                        </template>

                    </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div class="pagination-container">
                    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                        :page-sizes="[10, 20, 50, 100, 200]" :background="true"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="onPageSizeChange"
                        @current-change="onPageChange" class="custom-pagination" />
                </div>
            </div>
        </el-config-provider>
    </el-container>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ElMessage, ElTable } from 'element-plus';
import { Operation, Refresh, Search } from '@element-plus/icons-vue';
import { formatDateByYMD, getColumnTypeName } from '@/utils/utils';
import { debounce } from 'lodash-es';

interface ColumnItem {
    prop: string;
    label: string;
    width?: string | number;
    minWidth?: string | number;
    fixed?: boolean | 'left' | 'right';
    type?: string;             // 用于搜索栏识别 date 等
    keyword?: any;             // 搜索关键字缓存
    keyword2?: any;            // 日期结束关键字缓存
    editable?: boolean;        // 是否可编辑
    editType?: string;         // 'text' | 'number' | 'date' | 'select' | ...
    options?: Array<{ label: string; value: any }>; // select 编辑时的选项
    // 其他自定义字段...
}

const props = defineProps<{
    columnList: ColumnItem[];
    getDataApi: (params: Record<string, any>) => Promise<{ rows: any[]; total: number }>;
    updateDataApi?: (payload: Record<string, any>) => Promise<any>;
    title?: string;
}>();
const emits = defineEmits<{
    (e: 'dataLoaded', data: any[]): void;
}>();

const router = useRouter();
const tableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<any[]>([]);
const loading = ref(false);
const tableData = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

// 本地列配置拷贝，避免直接修改 props
const localColumns = ref<ColumnItem[]>(
    props.columnList.map(col => ({ ...col, keyword: '', keyword2: '' }))
);
watch(
    () => props.columnList,
    (newList) => {
        localColumns.value = newList.map(col => ({ ...col, keyword: '', keyword2: '' }));
        selectedColumns.value = localColumns.value.map(col => col.prop);
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
};
const visibleColumns = computed(() => {
    return localColumns.value.filter(col => selectedColumns.value.includes(col.prop));
});

// 搜索/筛选缓存
const filters = ref<Record<string, Array<{ text: any; value: any }>>>({});
watch(tableData, () => {
    filters.value = {};
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

// 维护“编辑状态”及缓存
// 当前正在编辑的单元格：{ rowKey, prop } 或 null
const editingCell = ref<{ rowKey: string | number; prop: string } | null>(null);
// 缓存当前行列的编辑值：{ [rowKey]: { [prop]: 值 } }
const editCache = reactive<Record<string | number, Record<string, any>>>({});

// 生成/获取行唯一 key
function getRowKey(row: any): string | number {
    return row.id ?? row._rowId;
}

// 在模板中为输入框设置 ref，需要动态管理 ref，下面用一个映射函数来生成 ref 名称
// 也可以直接用 querySelector 聚焦，但此处示例用 ref 名称存储在 map 中
const inputRefMap = reactive<Record<string, HTMLInputElement | null>>({});
function setInputRef(rowKey: string | number, prop: string) {
    // 返回一个函数或字符串作为 ref key；这里使用 `${rowKey}-${prop}` 作为 ref 名称
    return `${rowKey}-${prop}`;
}
// 聚焦逻辑：在 nextTick 中通过 document.querySelector 或 $refs 获取并 focus。为了简单，用 querySelector。
function focusInput(rowKey: string | number, prop: string) {
    nextTick(() => {
        // 通过属性选择器查找 input 或 textarea
        const selector = `input[data-row-key="${rowKey}"][data-prop="${prop}"], textarea[data-row-key="${rowKey}"][data-prop="${prop}"]`;
        const el = document.querySelector<HTMLInputElement>(selector);
        if (el) {
            el.focus();
            // 可选：全选内容
            el.select?.();
        }
    });
}

// 开始编辑某单元格
function startEdit(row: any, col: ColumnItem) {
    const rowKey = getRowKey(row);
    // 如果已有正在编辑的单元格，先取消（或提示保存）
    if (editingCell.value) {
        cancelEdit();
    }
    // 初始化缓存
    if (!editCache[rowKey]) {
        editCache[rowKey] = {};
    }
    // 缓存当前值
    editCache[rowKey][col.prop] = row[col.prop];
    // 进入编辑状态
    editingCell.value = { rowKey, prop: col.prop };
    // 聚焦
    focusInput(rowKey, col.prop);
}

// 判断某单元格是否在编辑状态
function isEditing(row: any, prop: string): boolean {
    if (!editingCell.value) return false;
    return editingCell.value.rowKey === getRowKey(row) && editingCell.value.prop === prop;
}

// 保存编辑：将 editCache 中值写回 row，调用后端更新（如有）
async function saveEdit(row: any, col: ColumnItem) {
    const rowKey = getRowKey(row);
    if (!editingCell.value || editingCell.value.prop !== col.prop) return;
    const newValue = editCache[rowKey]?.[col.prop];
    // 可在此添加校验逻辑，若不合法则 return 并提示
    // 写回 row 数据
    row[col.prop] = newValue;
    // 若提供 updateDataApi，则调用后端更新
    if (props.updateDataApi) {
        try {
            // 假设后端 API 接受 { id: rowKey, [col.prop]: newValue }
            await props.updateDataApi({ id: rowKey, [col.prop]: newValue });
            ElMessage.success('保存成功');
        } catch (err) {
            console.error('保存失败', err);
            ElMessage.error('保存失败');
            // 若需要回退，可事先缓存原始值，这里略
        }
    }
    // 清理编辑状态和缓存
    editingCell.value = null;
    if (editCache[rowKey]) {
        delete editCache[rowKey][col.prop];
        if (Object.keys(editCache[rowKey]).length === 0) {
            delete editCache[rowKey];
        }
    }
}

// 取消编辑：不写回，清理缓存
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
    // 在获取新数据前，清理编辑状态和缓存
    if (editingCell.value) {
        // 若需要提示可在此弹窗确认，示例直接取消
        cancelEdit();
    }
    Object.keys(editCache).forEach(k => delete editCache[k]);

    loading.value = true;
    const params = {
        page: currentPage.value,
        start: pageSize.value * (currentPage.value - 1),
        limit: pageSize.value,
        ...searchParams
    };
    try {
        const res = await props.getDataApi(params);
        if (res) {
            // 为无 id 的行添加唯一 _rowId
            const rows = (res.rows || []).map((item: any, idx: number) => {
                if (item.id == null) {
                    return { ...item, _rowId: `${Date.now()}-${Math.random()}-${idx}` };
                }
                return item;
            });
            tableData.value = rows;
            total.value = res.total || 0;
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
function onSearch() {
    currentPage.value = 1;
    const params = buildSearchParams();
    getData(params);
}
const onSearchDebounced = debounce(onSearch, 300);

// 分页
function onPageSizeChange(newSize: number) {
    pageSize.value = newSize;
    onSearch();
}
function onPageChange(newPage: number) {
    currentPage.value = newPage;
    onSearch();
}

// 刷新
function onRefresh() {
    // 清空搜索条件
    localColumns.value.forEach(col => {
        col.keyword = '';
        col.keyword2 = '';
    });
    filters.value = {};
    currentPage.value = 1;
    getData();
}

// 行选择
function handleSelectionChange(val: any[]) {
    multipleSelection.value = val;
}
function handleRowClick(row: any) {
    tableRef.value?.clearSelection();
    tableRef.value?.toggleRowSelection(row, true);
}

// 监听路由变化时刷新
watch(
    () => router.currentRoute.value.path,
    () => { onRefresh(); },
    { immediate: true }
);

// 初始加载
onMounted(() => {
    getData();
});

// 表头样式
const headerCellStyle = computed(() => ({
    fontSize: '14px',
    fontWeight: '600',
    color: '#303133',
    backgroundColor: '#f5f7fa',
    padding: '8px 0'
}));

// 国际化
const locale = computed(() => zhCn);
</script>

<style scoped>
/* 容器样式 */
.container {
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

/* 表格容器 */
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

/* 列标题与筛选 */
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

/* 分页 */
.custom-pagination {
    margin-top: 16px;
    padding: 8px 0;
    background: #fff;
    border-radius: 4px;
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 0px;
    padding: 8px 0;
    background: #fff;
    border-radius: 4px;
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

/* 单元格可编辑样式 */
.cell-wrapper.editing {
    background-color: #f0f9eb;
    /* 编辑高亮背景，可自定义 */
}

.editable-cell:hover {
    background-color: rgba(0, 0, 0, 0.03);
}

/* 输入框等撑满 */
.edit-input :deep(.el-input__inner) {
    padding: 2px 8px;
}

/* 深度样式调整定位过滤图标等（保持原用） */
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
</style>
