<template>
    <el-container class="a-container">
        <!-- 表头区域：标题、记录数、自定义列、刷新 -->
        <div class="table-header">
            <div class="table-title">
                <el-row :gutter="10" class="mb8">
                    <el-col v-for="button in buttonlist" :span="1.5">
                        <el-button :disabled="handleButtonDisabled(button.disabled as string|boolean)" :size="button.size || 'small'" :loading="button.loading" :type="button.type" :plain="button.plain || true" :icon="button.icon" @click="button.onClick" v-hasPermi="[button.hasPermi]" class="compact-button">
                            {{ button.label }}
                        </el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="table-actions">
                <!-- 自定义列显示 -->
                <el-button type="primary" plain size="small" @click="showColumnConfigDialog = true" class="compact-button">
                    <el-icon>
                        <Operation />
                    </el-icon> 自定义列
                </el-button>
                <!-- 刷新按钮 -->
                <el-tooltip content="刷新数据" placement="top">
                    <el-button circle size="small" @click="onRefresh" class="compact-button">
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
                <el-table  ref="tableRef" :data="tableData" v-loading.lock="loading"
                    @selection-change="handleSelectionChange" @row-click="handleRowClick"
                    highlight-current-row stripe border class="custom-table" :header-cell-style="headerCellStyle">
                    <!-- 复选框列 -->
                    <el-table-column fixed type="selection" width="55" align="center" />
                    <!-- 序号列 -->
                    <el-table-column label="序号" fixed type="index" width="55" align="center" />

                    <!-- 动态列 -->
                     <template v-for="col in visibleColumns">
                        <el-table-column  v-if="!(col as any).hidden" :key="col.prop" :prop="col.prop" :label="col.label"
                            :width="col.width" :min-width="col.minWidth || 120" align="center" show-overflow-tooltip
                            :fixed="getColumnFixed(col)" 
                            :column-key="col.prop" sortable>
                            <!-- 自定义表头：保留搜索 -->
                            <template #header>
                                <div class="column-header-wrapper">
                                    <div class="column-title-row">
                                        <div class="column-title" :class="col.editable?'editable-row':''">{{ col.label }}</div>
                                        <el-button 
                                            link 
                                            size="small" 
                                            :type="activeFilters[col.prop]?.length ? 'primary' : 'default'"
                                            @click.stop="openFilterDialog(col)"
                                            class="filter-button-header"
                                            title="筛选">
                                            <el-badge badge-style="padding:4px;font-size: 10px;" :offset="[8, 0]" type="primary" v-if="activeFilters[col.prop]?.length" :value="activeFilters[col.prop].length" class="item">
                                                <el-icon><Operation /></el-icon>
                                            </el-badge>
                                            <el-icon v-else><Operation /></el-icon>
                                        </el-button>
                                    </div>
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
                                                <template v-else-if="col.editType === 'select' && col.options">
                                                    {{ col.options.find(opt => opt.value == scope.row[col.prop])?.label || scope.row[col.prop] }}
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
                                    <div v-else-if="!col.editable"
                                        class="readonly-cell-wrapper"
                                        style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
                                        <template
                                            v-if="scope.row[col.prop] !== undefined && scope.row[col.prop] !== null && scope.row[col.prop] !== ''">
                                            <span class="cell-text ellipsis">
                                                <template v-if="col.type === 'date'">
                                                    {{ scope.row[col.prop] ? formatDateByYMD(scope.row[col.prop],
                                                    'yyyy-MM-dd') : '' }}
                                                </template>
                                                <template v-else-if="col.editType === 'select' && col.options">
                                                    {{ col.options.find(opt => opt.value == scope.row[col.prop])?.label || scope.row[col.prop] }}
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
                    </template>
                </el-table>

                <!-- Excel 式筛选对话框 -->
                <el-dialog 
                    v-model="showFilterDialog" 
                    :title="`筛选: ${currentFilterColumn?.label || ''}`" 
                    width="400px" 
                    append-to-body>
                    <div class="filter-dialog-content">
                        <el-input
                            v-model="filterSearchText"
                            placeholder="搜索筛选值"
                            clearable
                            size="small"
                            style="margin-bottom: 10px;">
                            <template #prefix>
                                <el-icon><Search /></el-icon>
                            </template>
                        </el-input>
                        <el-scrollbar height="300px">
                            <el-checkbox-group 
                                v-model="selectedFilterValues" 
                                class="filter-checkbox-group">
                                <el-checkbox 
                                    v-for="item in filteredFilterOptions" 
                                    :key="item.value" 
                                    :label="item.value"
                                    class="filter-checkbox">
                                    {{ item.text }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-scrollbar>
                        <div class="filter-actions">
                            <el-button size="small" @click="clearFilter">清除筛选</el-button>
                            <el-button size="small" type="primary" @click="applyFilter">确定</el-button>
                        </div>
                    </div>
                </el-dialog>

                <!-- 列配置对话框 -->
                <el-dialog v-model="showColumnConfigDialog" title="列配置" width="600px" append-to-body>
                    <div class="column-config-dialog">
                        <div class="config-tips">
                            <el-alert type="info" :closable="false" show-icon>
                                <template #default>
                                    <div>拖拽列表项可调整列顺序，勾选可控制列显示，设置固定列位置</div>
                                </template>
                            </el-alert>
                        </div>
                        <div class="column-config-list">
                            <draggable 
                                v-model="localColumns" 
                                item-key="prop" 
                                handle=".drag-handle"
                                :animation="200"
                                @end="onColumnDragEnd">
                                <template #item="{ element: col }">
                                    <div class="column-config-item">
                                        <div class="drag-handle">
                                            <el-icon><Rank /></el-icon>
                                        </div>
                                        <el-checkbox 
                                            v-model="col.visible" 
                                            :label="col.prop"
                                            @change="onColumnVisibleChange">
                                            <span class="column-label">{{ col.label }}</span>
                                        </el-checkbox>
                                        <el-select 
                                            v-model="col.fixed" 
                                            size="small" 
                                            style="width: 100px; margin-left: auto;"
                                            placeholder="固定列"
                                            @change="onColumnFixedChange">
                                            <el-option label="不固定" :value="false" />
                                            <el-option label="左侧固定" value="left" />
                                            <el-option label="右侧固定" value="right" />
                                        </el-select>
                                    </div>
                                </template>
                            </draggable>
                        </div>
                        <div class="config-actions">
                            <el-button @click="resetColumnConfig">重置</el-button>
                            <el-button type="primary" @click="saveColumnConfig">保存</el-button>
                        </div>
                    </div>
                </el-dialog>

                <!-- 分页 -->
                <div class="pagination-container">
                    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                        :page-sizes="[10, 20, 50, 100, 200,500,1000]" :background="true"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="onPageSizeChange"
                        @current-change="onPageChange" class="custom-pagination" size="small" />
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
import { Operation, Refresh, Search, Rank } from '@element-plus/icons-vue';
import { formatDateByYMD, getColumnTypeName } from '@/utils/utils';
import { debounce } from 'lodash-es';
import draggable from 'vuedraggable';

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
    visible?: boolean;          // 是否显示列
    order?: number;            // 列顺序
    // 其他自定义字段...
}
interface ButtonItem {
  label: string             // 按钮显示文本
  icon?: string             // Element Plus 的图标名，如 "el-icon-plus"
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  size?: 'large' | 'default' | 'small'
  plain?: boolean           // 是否朴素按钮
  round?: boolean           // 是否圆角
  circle?: boolean          // 是否圆形按钮
  disabled?: string | boolean        // 是否禁用
  loading?: boolean         // 是否加载中
  tooltip?: string          // 鼠标悬停提示
  visible?: boolean         // 是否显示按钮，默认 true
  confirm?: string          // 可选：点击前弹出确认信息
  onClick?: () => void      // 点击事件回调
  hasPermi: string;  // 是否有权限
}


const props = defineProps<{
    columnList: ColumnItem[];
    getDataApi: (params: Record<string, any>) => Promise<{ rows: any[]; total: number }>;
    updateDataApi?: (payload: Record<string, any>) => Promise<any>;
    title?: string;
    buttonlist:ButtonItem[];
    storageKey?: string;       // localStorage 存储键名，用于持久化列配置
}>();
const emits = defineEmits<{
    (e: 'dataLoaded', data: any[]): void;
    (e: 'handleSelectionChange', data: any[]): void;
    (e: 'handleRowClick', data: any[]): void;
}>();

const router = useRouter();
const tableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<any[]>([]);
const loading = ref(false);
const rawTableData = ref<any[]>([]); // 原始数据
const tableData = computed(() => {
    // 应用筛选逻辑
    let filtered = [...rawTableData.value];
    
    // 遍历所有激活的筛选
    Object.keys(activeFilters.value).forEach(prop => {
        const activeValues = activeFilters.value[prop];
        if (activeValues && activeValues.length > 0) {
            filtered = filtered.filter(row => activeValues.includes(row[prop]));
        }
    });
    
    return filtered;
});
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const single = ref(true)
const multiple = ref(true)





// 初始化列配置
function initColumns(): ColumnItem[] {
    const savedConfig = loadColumnConfig();
    if (savedConfig) {
        // 使用保存的配置
        const savedMap = new Map(savedConfig.map((c: any) => [c.prop, c]));
        return props.columnList.map((col, index) => {
            const saved = savedMap.get(col.prop);
            return {
                ...col,
                keyword: '',
                keyword2: '',
                visible: saved?.visible !== undefined ? saved.visible : true,
                fixed: saved?.fixed || col.fixed || false,
                order: saved?.order !== undefined ? saved.order : index
            } as ColumnItem;
        }).sort((a, b) => (a.order || 0) - (b.order || 0));
    } else {
        // 使用默认配置
        return props.columnList.map((col, index) => ({
            ...col,
            keyword: '',
            keyword2: '',
            visible: true,
            fixed: col.fixed || false,
            order: index
        } as ColumnItem));
    }
}

// 本地列配置拷贝，避免直接修改 props
const localColumns = ref<ColumnItem[]>(initColumns());

watch(
    () => props.columnList,
    (newList) => {
        const savedConfig = loadColumnConfig();
        if (savedConfig) {
            const savedMap = new Map(savedConfig.map((c: any) => [c.prop, c]));
            localColumns.value = newList.map((col, index) => {
                const saved = savedMap.get(col.prop);
                return {
                    ...col,
                    keyword: '',
                    keyword2: '',
                    visible: saved?.visible !== undefined ? saved.visible : true,
                    fixed: saved?.fixed || col.fixed || false,
                    order: saved?.order !== undefined ? saved.order : index
                };
            }).sort((a, b) => (a.order || 0) - (b.order || 0));
        } else {
            localColumns.value = newList.map((col, index) => ({
                ...col,
                keyword: '',
                keyword2: '',
                visible: true,
                fixed: col.fixed || false,
                order: index
            }));
        }
    },
    { deep: true }
);

// 列显示控制
const selectedColumns = computed(() => {
    return localColumns.value.filter(col => col.visible !== false).map(col => col.prop);
});
const selectAllColumns = computed({
    get: () => localColumns.value.every(col => col.visible !== false),
    set: (val: boolean) => {
        localColumns.value.forEach(col => {
            col.visible = val;
        });
    }
});
const isIndeterminate = computed(() => {
    const visibleCount = localColumns.value.filter(col => col.visible !== false).length;
    return visibleCount > 0 && visibleCount < localColumns.value.length;
});

const visibleColumns = computed(() => {
    return localColumns.value.filter(col => col.visible !== false);
});

// 列配置对话框
const showColumnConfigDialog = ref(false);

// 列配置持久化
function loadColumnConfig(): Array<{ prop: string; visible: boolean; fixed: boolean | 'left' | 'right'; order: number }> | null {
    if (!props.storageKey) return null;
    try {
        const saved = localStorage.getItem(`columnConfig_${props.storageKey}`);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

function saveColumnConfig() {
    if (!props.storageKey) return;
    try {
        const config = localColumns.value.map((col, index) => ({
            prop: col.prop,
            visible: col.visible !== false,
            fixed: col.fixed || false,
            order: col.order !== undefined ? col.order : index
        }));
        localStorage.setItem(`columnConfig_${props.storageKey}`, JSON.stringify(config));
        ElMessage.success('列配置已保存');
        showColumnConfigDialog.value = false;
    } catch (error) {
        ElMessage.error('保存列配置失败');
    }
}

function resetColumnConfig() {
    if (!props.storageKey) return;
    try {
        localStorage.removeItem(`columnConfig_${props.storageKey}`);
        localColumns.value = props.columnList.map((col, index) => ({
            ...col,
            keyword: '',
            keyword2: '',
            visible: true,
            fixed: col.fixed || false,
            order: index
        }));
        ElMessage.success('列配置已重置');
    } catch (error) {
        ElMessage.error('重置列配置失败');
    }
}

function onColumnDragEnd() {
    // 更新列顺序
    localColumns.value.forEach((col, index) => {
        col.order = index;
    });
}

function onColumnVisibleChange() {
    // 列显示状态改变时自动保存（可选）
}

function onColumnFixedChange() {
    // 固定列状态改变
}

function getColumnFixed(col: ColumnItem): boolean | 'left' | 'right' | undefined {
    if (col.fixed === 'left' || col.fixed === 'right') {
        return col.fixed;
    }
    return col.fixed ? true : undefined;
}

// 搜索/筛选缓存
const filters = ref<Record<string, Array<{ text: any; value: any }>>>({});
const activeFilters = ref<Record<string, any[]>>({}); // 当前激活的筛选值

watch(rawTableData, () => {
    filters.value = {};
    // 不清空 activeFilters，保持筛选状态
});

const buildFilter = (key: string) => {
    if (filters.value[key]) return filters.value[key];
    // 使用原始数据构建筛选选项，而不是筛选后的数据
    if (!rawTableData.value.length) return [];
    const uniqueValues = new Set<any>();
    const arr: Array<{ text: any; value: any }> = [];
    rawTableData.value.forEach(item => {
        const v = item[key];
        if (v != null && !uniqueValues.has(v)) {
            uniqueValues.add(v);
            arr.push({ text: String(v), value: v });
        }
    });
    // 按文本排序
    arr.sort((a, b) => String(a.text).localeCompare(String(b.text)));
    filters.value[key] = arr;
    return arr;
};

// 筛选方法：支持多选筛选
// 注意：Element Plus 的 filter-method 是针对单个值的，我们需要在表格数据层面进行筛选
const filterHandler = (value: any, row: any, column: any, prop?: string) => {
    // 这个方法实际上不会被 Element Plus 调用，因为我们不使用原生的筛选
    // 真正的筛选逻辑在 computed tableData 中处理
    return true;
};

// Excel 式筛选对话框
const showFilterDialog = ref(false);
const currentFilterColumn = ref<ColumnItem | null>(null);
const selectedFilterValues = ref<any[]>([]);
const filterSearchText = ref('');

const filteredFilterOptions = computed(() => {
    if (!currentFilterColumn.value) return [];
    const options = buildFilter(currentFilterColumn.value.prop);
    if (!filterSearchText.value) return options;
    const searchLower = filterSearchText.value.toLowerCase();
    return options.filter(opt => 
        String(opt.text).toLowerCase().includes(searchLower)
    );
});


function openFilterDialog(col: ColumnItem) {
    currentFilterColumn.value = col;
    selectedFilterValues.value = activeFilters.value[col.prop] || [];
    filterSearchText.value = '';
    showFilterDialog.value = true;
}

function applyFilter() {
    if (!currentFilterColumn.value) return;
    const prop = currentFilterColumn.value.prop;
    if (selectedFilterValues.value.length === 0) {
        delete activeFilters.value[prop];
    } else {
        activeFilters.value[prop] = [...selectedFilterValues.value];
    }
    // 筛选逻辑通过 computed tableData 自动应用，不需要手动触发
    showFilterDialog.value = false;
}

function clearFilter() {
    if (!currentFilterColumn.value) return;
    const prop = currentFilterColumn.value.prop;
    delete activeFilters.value[prop];
    selectedFilterValues.value = [];
    // 筛选逻辑通过 computed tableData 自动应用
    showFilterDialog.value = false;
}

// 获取当前筛选值（用于 :filtered-value）
function getFilteredValue(prop: string): any[] | undefined {
    return activeFilters.value[prop];
}

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
    console.log('|| editingCell.value.prop',editingCell.value)
    if (!editingCell.value || editingCell.value.prop !== col.prop ) return;
    const newValue = editCache[rowKey]?.[col.prop];
    // 可在此添加校验逻辑，若不合法则 return 并提示
    if (newValue === row[col.prop]) {
        editingCell.value = null;
        return
    };
    
    // 写回 row 数据
    row[col.prop] = newValue;
    console.log('col',row)
    // 若提供 updateDataApi，则调用后端更新
    if (props.updateDataApi) {
        try {
            // 假设后端 API 接受 { id: rowKey, [col.prop]: newValue }
            await props.updateDataApi(row);
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
        pageNum: currentPage.value,
        start: pageSize.value * (currentPage.value - 1),
        pageSize: pageSize.value,
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
            rawTableData.value = rows;
            total.value = res.total || 0;
            emits('dataLoaded', rawTableData.value);
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
function onSearch(init:boolean=false) {
    currentPage.value = !init ? 1 : currentPage.value;
    const params = buildSearchParams();
    getData(params);
}
const onSearchDebounced = debounce(onSearch, 300);

// 分页
function onPageSizeChange(newSize: number) {
    console.log(newSize)
    pageSize.value = newSize;
    onSearch(true);
}
function onPageChange(newPage: number) {
    console.log(newPage)
    currentPage.value = newPage;
    onSearch(true);
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
// 根据行选择控制按钮是否禁用
const handleButtonDisabled = (val:string | boolean)=>{
    if(val == 'single'){
        return single.value
    }else if(val == 'multiple'){
        return multiple.value
    }
    return val
}   

// 行选择
function handleSelectionChange(val: any[]) {
    single.value = val.length != 1
    multiple.value = !val.length
    emits('handleSelectionChange',val)
    multipleSelection.value = val;
}
function handleRowClick(row: any) {
    tableRef.value?.clearSelection();
    tableRef.value?.toggleRowSelection(row, true);
    emits('handleRowClick',row)
    
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

// 向父节点暴露方法
defineExpose({onRefresh

})
</script>

<style scoped>

/* 容器样式 */
.a-container {
    height: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.06);
}
.cell-text {
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

/* 表头 */
.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.table-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.title-text {
    font-size: 14px;
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

/* Compact button styling */
.compact-button {
    padding: 5px 12px !important;
    font-size: 12px !important;
}

.compact-button.is-circle {
    padding: 5px !important;
}

/* 表格容器 */
.table-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    height: 100%;
}

.custom-table {
    flex: 1;
    font-size: 12px;
    border-radius: 4px;
    overflow: hidden;
    --el-table-border-color: #e4e7ed;
    --el-table-header-bg-color: #f5f7fa;
}

.custom-table :deep(.el-table__header) {
    font-size: 13px;
    font-weight: 600;
}

.custom-table :deep(.el-table__body) {
    font-size: 12px;
}

.custom-table :deep(.el-table__cell) {
    padding: 6px 0;
}

.custom-table :deep(.el-table th.el-table__cell) {
    padding: 8px 0;
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
/* 是否可编辑列 */
.editable-row{
    color:#409EFF
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
    margin-top: 5px;
    padding: 2px 0;
    background: #fff;
    border-radius: 4px;
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 0px;
    padding: 2px 0;
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
    right: 30px;
}

:deep(.el-table__column-filter-trigger.el-none-outline.el-tooltip__trigger.el-tooltip__trigger) {
    position: absolute;
    top: 9px;
    right: 4px;
}

/* 超出文本...显示 */
.ellipsis{
     overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/* 表头包装器 */
.column-header-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: 50px;
}

.column-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
}

.column-title {
    flex: 1;
}

.filter-button-header {
    padding: 2px 4px;
    min-height: auto;
    height: 20px;
    line-height: 1;
    margin-left: 8px;
}

.filter-badge {
    margin-left: 2px;
    font-size: 11px;
}

/* 列配置对话框 */
.column-config-dialog {
    padding: 10px 0;
}

.config-tips {
    margin-bottom: 15px;
}

.column-config-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 8px;
}

.column-config-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 4px;
    background: #fafafa;
    border-radius: 4px;
    transition: background 0.2s;
}

.column-config-item:hover {
    background: #f0f2f5;
}

.drag-handle {
    cursor: move;
    color: #909399;
    margin-right: 8px;
    display: flex;
    align-items: center;
}

.drag-handle:hover {
    color: #409eff;
}

.column-config-item .column-label {
    margin-left: 8px;
    flex: 1;
}

.config-actions {
    margin-top: 15px;
    text-align: right;
}

/* 筛选对话框 */
.filter-dialog-content {
    padding: 10px 0;
}

.filter-checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.filter-checkbox {
    display: flex;
    align-items: center;
    padding: 4px 0;
}

.filter-actions {
    margin-top: 15px;
    text-align: right;
    padding-top: 10px;
    border-top: 1px solid #ebeef5;
}

</style>
