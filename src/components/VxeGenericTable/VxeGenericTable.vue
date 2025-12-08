<template>
    <div class="vxe-generic-table-container">
        <!-- 工具栏 -->
        <div class="table-toolbar">
            <div class="toolbar-buttons">
                <el-button v-for="button in buttonlist" :key="button.label" :type="button.type"
                    :size="button.size || 'small'" :icon="button.icon" :disabled="handleButtonDisabled(button.disabled)"
                    :loading="button.loading" :plain="button.plain !== false" @click="button.onClick">
                    {{ button.label }}
                </el-button>
            </div>
            <div class="toolbar-actions">
                <el-button size="small" @click="showColumnConfig = true">
                    <el-icon>
                        <Operation />
                    </el-icon>
                    自定义列
                </el-button>
                <el-button size="small" circle @click="refreshData">
                    <el-icon>
                        <Refresh />
                    </el-icon>
                </el-button>
            </div>
        </div>

        <!-- vxe-table 表格 -->
        <div class="table-wrapper">
            <vxe-table ref="tableRef" :data="tableData" :loading="loading" border stripe height="100%"
                :row-config="{ isCurrent: true, isHover: true }" :column-config="{ resizable: true }"
                @checkbox-change="handleSelectionChange" @checkbox-all="handleSelectionChange"
                @cell-click="handleCellClick">
                <!-- 复选框列 -->
                {{ getSelectLabel(row[col.prop], col.options) }}
                </span>
                <span v-else>{{ row[col.prop] }}</span>
</template>
</vxe-column>
</vxe-table>
</div>

<!-- 分页 -->
<div class="table-pagination">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 500, 1000]" :total="total" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageSizeChange" @current-change="handlePageChange" />
</div>

<!-- 列配置对话框 -->
<el-dialog v-model="showColumnConfig" title="列配置" width="600px">
    <div class="column-config-content">
        <el-checkbox-group v-model="selectedColumns">
            <div v-for="col in localColumns" :key="col.prop" class="column-item">
                <el-checkbox :label="col.prop">{{ col.label }}</el-checkbox>
            </div>
        </el-checkbox-group>
    </div>
    <template #footer>
                <el-button @click="resetColumnConfig">重置</el-button>
                <el-button type="primary" @click="saveColumnConfig">保存</el-button>
            </template>
</el-dialog>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Operation, Refresh } from '@element-plus/icons-vue';
import './vxeRenderer';  // 导入渲染器注册

interface ColumnItem {
    prop: string;
    label: string;
    width?: string | number;
    minWidth?: string | number;
    fixed?: boolean | 'left' | 'right';
    type?: string;
    editable?: boolean;
    editType?: 'text' | 'number' | 'date' | 'select';
    options?: Array<{ label: string; value: any }>;
    visible?: boolean;
}

interface ButtonItem {
    label: string;
    icon?: string;
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'large' | 'default' | 'small';
    plain?: boolean;
    disabled?: string | boolean;
    loading?: boolean;
    onClick?: () => void;
    hasPermi: string;
}

const props = defineProps<{
    columnList: ColumnItem[];
    getDataApi: (params: Record<string, any>) => Promise<{ rows: any[]; total: number }>;
    updateDataApi?: (payload: Record<string, any>) => Promise<any>;
    buttonlist: ButtonItem[];
    storageKey?: string;
}>();

const emit = defineEmits<{
    (e: 'dataLoaded', data: any[]): void;
    (e: 'handleSelectionChange', selection: any[]): void;
}>();

// 表格引用
const tableRef = ref();

// 数据状态
const loading = ref(false);
const tableData = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(1000);

// 列配置
const localColumns = ref<ColumnItem[]>([]);
const selectedColumns = ref<string[]>([]);
const showColumnConfig = ref(false);

// 行选择
const single = ref(true);
const multiple = ref(true);

// 初始化列配置
const initColumns = () => {
    localColumns.value = props.columnList.map(col => ({
        ...col,
        visible: col.visible !== false
    }));
    selectedColumns.value = localColumns.value
        .filter(col => col.visible)
        .map(col => col.prop);

    // 从 localStorage 加载配置
    if (props.storageKey) {
        const saved = localStorage.getItem(props.storageKey);
        if (saved) {
            try {
                const config = JSON.parse(saved);
                selectedColumns.value = config.selectedColumns || selectedColumns.value;
            } catch (e) {
                console.error('Failed to load column config:', e);
            }
        }
    }
};

// 可见列
const visibleColumns = computed(() => {
    return localColumns.value.filter(col =>
        selectedColumns.value.includes(col.prop)
    );
});

// 获取列固定位置
const getColumnFixed = (col: ColumnItem): 'left' | 'right' | undefined => {
    if (col.fixed === 'left' || col.fixed === 'right') {
        return col.fixed;
    }
    return col.fixed ? 'left' : undefined;
};

// 获取编辑渲染配置
const getEditRender = (col: ColumnItem): any => {
    if (!col.editable) return undefined;

    const editType = col.editType || 'text';

    if (editType === 'select' && col.options) {
        return {
            name: 'select',
            options: col.options,
        };
    }

    if (editType === 'number') {
        return {
            name: 'input',
            attrs: { type: 'number' }
        };
    }

    return {
        name: 'input'
    };
};

// 格式化日期
const formatDate = (date: string) => {
    if (!date) return '';
    return date.split('T')[0];
};

// 获取下拉选项标签
const getSelectLabel = (value: any, options: Array<{ label: string; value: any }>) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
};

// 加载数据
const loadData = async () => {
    loading.value = true;
    try {
        const params = {
            pageNum: currentPage.value,
            pageSize: pageSize.value,
            start: pageSize.value * (currentPage.value - 1)
        };

        const res = await props.getDataApi(params);
        if (res) {
            tableData.value = res.rows || [];
            total.value = res.total || 0;
            emit('dataLoaded', tableData.value);
        }
    } catch (error) {
        console.error('数据加载失败:', error);
        ElMessage.error('数据加载失败');
    } finally {
        loading.value = false;
    }
};

// 刷新数据
const refreshData = () => {
    currentPage.value = 1;
    loadData();
};

// 分页处理
const handlePageSizeChange = (newSize: number) => {
    pageSize.value = newSize;
    loadData();
};

const handlePageChange = (newPage: number) => {
    currentPage.value = newPage;
    loadData();
};

// 行选择处理
const handleSelectionChange = () => {
    const selection = tableRef.value?.getCheckboxRecords() || [];
    single.value = selection.length !== 1;
    multiple.value = selection.length === 0;
    emit('handleSelectionChange', selection);
};

// 列配置保存
const saveColumnConfig = () => {
    if (props.storageKey) {
        const config = {
            selectedColumns: selectedColumns.value
        };
        localStorage.setItem(props.storageKey, JSON.stringify(config));
    }
    showColumnConfig.value = false;
    ElMessage.success('列配置已保存');
};

// 重置列配置
const resetColumnConfig = () => {
    selectedColumns.value = localColumns.value
        .filter(col => col.visible !== false)
        .map(col => col.prop);
    if (props.storageKey) {
        localStorage.removeItem(props.storageKey);
    }
};

// 监听列配置变化
watch(() => props.columnList, () => {
    initColumns();
}, { deep: true });

// 初始化
onMounted(() => {
    initColumns();
    loadData();
});

// 暴露方法
defineExpose({
    onRefresh: refreshData
});
</script>

<style scoped>
.vxe-generic-table-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-shrink: 0;
}

.toolbar-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.toolbar-actions {
    display: flex;
    gap: 10px;
}

.table-wrapper {
    flex: 1;
    overflow: hidden;
    min-height: 0;
}

.table-pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
}

.column-config-content {
    max-height: 400px;
    overflow-y: auto;
}

.column-item {
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
}

.column-item:last-child {
    border-bottom: none;
}
</style>
