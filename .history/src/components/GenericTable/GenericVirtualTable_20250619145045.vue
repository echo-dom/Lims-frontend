<template> 
    <el-container class="a-container">
        <!-- 表头区域保持不变 -->
        <div class="table-header">
            <!-- ... 原有表头代码 ... -->
        </div>

        <!-- 虚拟表格容器 - 添加关键样式 -->
        <div class="virtual-table-container" ref="tableContainer" style="flex: 1; min-height: 300px;">
            <el-table-v2
                ref="tableRef"
                :columns="v2Columns"
                :data="tableData"
                :width="tableWidth"
                :height="tableHeight"
                :row-height="rowHeight"
                :estimated-row-height="estimatedRowHeight"
                :row-key="getRowKey"
                :sort-by="sortState"
                @column-sort="handleSort"
                @row-event="handleRowClick"
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
import { ElMessage, ElTableV2 } from 'element-plus';
import { Operation, Refresh, Search } from '@element-plus/icons-vue';
import { formatDateByYMD, getColumnTypeName } from '@/utils/utils';
import { debounce } from 'lodash-es';
import type { Column, SortBy } from 'element-plus';

// ... 接口定义保持不变 ...

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
const tableWidth = ref(1000); // 默认宽度
const tableHeight = ref(400); // 默认高度
const rowHeight = ref(50);
const estimatedRowHeight = ref(50);

// 虚拟表格配置
const showSelection = ref(true);
const sortState = ref<SortBy>({ key: '', order: null });

// ... 其他变量和计算属性保持不变 ...

// 虚拟表格列配置 - 修复插槽名称问题
const v2Columns = ref<Column<any>[]>([]);
function updateV2Columns() {
    const cols: Column<any>[] = [];
    
    // 选择列
    if (showSelection.value) {
        cols.push({
            key: 'selection',
            dataKey: 'selection',
            title: '选择',
            width: 55,
            fixed: 'left',
            cellRenderer: (props: any) => props.cellRenderer(), // 使用传递的渲染函数
            headerCellRenderer: (props: any) => props.headerCellRenderer() // 使用传递的渲染函数
        });
    }
    
    // 序号列
    cols.push({
        key: 'index',
        dataKey: 'index',
        title: '序号',
        width: 55,
        fixed: 'left',
        cellRenderer: (props: any) => props.cellRenderer(),
        headerCellRenderer: (props: any) => props.headerCellRenderer()
    });
    
    // 动态列
    visibleColumns.value.forEach(col => {
        cols.push({
            key: col.prop,
            dataKey: col.prop,
            title: col.label,
            width: col.width || 180,
            fixed: col.fixed as any, // 类型转换
            sortable: col.sortable,
            headerCellRenderer: (props: any) => props.headerCellRenderer(),
            cellRenderer: (props: any) => props.cellRenderer()
        });
    });
    
    v2Columns.value = cols;
}

// ... 其他方法保持不变 ...

// 调整表格尺寸 - 修复尺寸计算问题
function updateTableSize() {
    if (tableContainer.value) {
        const rect = tableContainer.value.getBoundingClientRect();
        tableWidth.value = rect.width;
        tableHeight.value = rect.height;
        console.log('Table size updated:', tableWidth.value, tableHeight.value);
    }
}

// 初始加载 - 确保正确初始化
onMounted(() => {
    updateV2Columns();
    window.addEventListener('resize', updateTableSize);
    
    // 确保DOM更新后计算尺寸
    nextTick(() => {
        updateTableSize();
        getData();
    });
});

// ... 其他生命周期和方法保持不变 ...

// 添加一个watch确保列更新时重新计算尺寸
watch(visibleColumns, () => {
    nextTick(updateTableSize);
});

// 行点击事件 - 修复事件参数问题
function handleRowClick(row: any, event: any) {
    if (event.target?.tagName === 'INPUT' || event.target?.tagName === 'TEXTAREA') {
        return; // 避免点击输入元素时触发行选择
    }
    toggleRowSelection(row, !isRowSelected(row));
}

</script>

<style scoped>
/* 确保容器正确布局 */
.a-container {
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

/* 虚拟表格容器关键样式 */
.virtual-table-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    background-color: #fff;
    min-height: 300px; /* 确保有最小高度 */
}

/* 表格单元格样式 - 确保正确显示 */
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

/* 其他样式保持不变... */
</style>