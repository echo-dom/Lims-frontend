<template>
  <div class="smart-table-container">
    <!-- 工具栏 -->
    <div class="table-toolbar">
      <el-button @click="showColumnConfig" size="small">
        <el-icon><Operation /></el-icon> 列配置
      </el-button>
      <el-input 
        v-model="globalSearch" 
        placeholder="全局搜索..." 
        clearable 
        style="width: 200px" 
        @input="handleGlobalSearch"
      />
    </div>

    <!-- 智能表格 -->
    <el-table
      :data="filteredData"
      border
      highlight-current-row
      @cell-click="handleCellClick"
      style="width: 100%"
      :row-key="rowKey"
    >
      <el-table-column 
        v-for="col in visibleColumns" 
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :sortable="col.sortable"
        :filters="col.filters"
        :filter-method="createFilterHandler(col)"
        :width="col.width"
        :min-width="col.minWidth"
        :fixed="col.fixed"
        :align="col.align || 'left'"
      >
        <template #default="{ row }">
          <!-- 查看模式 -->
          <div 
            v-if="!isEditingCell(row, col.prop)" 
            @dblclick="col.editable !== false ? enterEditMode(row, col.prop) : null"
            :class="{ 'editable-cell': col.editable !== false }"
          >
            <!-- 自定义内容渲染 -->
            <slot v-if="col.slot" :name="`col-${col.prop}`" :row="row" />
            <!-- 默认渲染 -->
            <template v-else>
              {{ col.formatter ? col.formatter(row[col.prop], row) : formatCellValue(row[col.prop], col.type) }}
            </template>
          </div>
          
          <!-- 编辑模式 -->
          <div v-else class="cell-edit-container">
            <!-- 文本输入 -->
            <el-input
              v-if="col.type === 'text'"
              v-model="editingValue"
              @blur="saveEdit(row, col.prop)"
              @keyup.enter="saveEdit(row, col.prop)"
              autofocus
            />
            
            <!-- 数字输入 -->
            <el-input
              v-else-if="col.type === 'number'"
              v-model.number="editingValue"
              @blur="saveEdit(row, col.prop)"
              @keyup.enter="saveEdit(row, col.prop)"
              autofocus
              type="number"
            />
            
            <!-- 日期选择 -->
            <el-date-picker
              v-else-if="col.type === 'date'"
              v-model="editingValue"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @blur="saveEdit(row, col.prop)"
              autofocus
            />
            
            <!-- 下拉选择 -->
            <el-select
              v-else-if="col.type === 'select'"
              v-model="editingValue"
              @blur="saveEdit(row, col.prop)"
              @change="saveEdit(row, col.prop)"
              autofocus
            >
              <el-option
                v-for="opt in col.options"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
            
            <!-- 布尔值选择 -->
            <el-select
              v-else-if="col.type === 'boolean'"
              v-model="editingValue"
              @blur="saveEdit(row, col.prop)"
              @change="saveEdit(row, col.prop)"
              autofocus
            >
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
            
            <!-- 自定义编辑组件 -->
            <slot
              v-else-if="col.editSlot"
              :name="`edit-${col.prop}`"
              :row="row"
              :prop="col.prop"
              :value="editingValue"
              @save="(value) => saveEdit(row, col.prop, value)"
              @cancel="cancelEdit"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div class="table-pagination">
      <span class="total-count">共 {{ props.total }} 条</span>
      <el-pagination
        background
        layout="prev, pager, next, sizes"
        :page-sizes="[10, 20, 50, 100]"
        :total="props.total"
        :current-page="props.currentPage"
        :page-size="props.pageSize"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 列配置抽屉 -->
    <TableColumnConfig 
      v-model:visible="showConfigDrawer"
      :columns="allColumns"
      v-model:visible-columns="visibleColumns"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Operation } from '@element-plus/icons-vue'
import TableColumnConfig from './TableColumnConfig.vue'
import { ColumnConfig } from './types'
import { formatCellValue, createFilterHandler, debounce } from './utils'

// Props定义
const props = defineProps({
  data: { type: Array, required: true },
  columns: { type: Array as () => ColumnConfig[], required: true },
  total: { type: Number, default: 0 },
  pageSize: { type: Number, default: 10 },
  currentPage: { type: Number, default: 1 },
  rowKey: { type: String, default: 'id' } // 行唯一标识字段
})

// 事件定义
const emit = defineEmits([
  'update:pageSize', 
  'update:currentPage',
  'cell-edit',
  'custom-event',
  'filter-change',
  'global-search'
])

// 状态管理
const globalSearch = ref('')
const showConfigDrawer = ref(false)

// 列配置处理
const allColumns = ref<ColumnConfig[]>([...props.columns])
const visibleColumns = ref<ColumnConfig[]>(
  props.columns.filter(col => col.visible !== false)
)

// 编辑状态管理
const editingState = reactive({
  rowId: null as string | number | null,
  prop: null as string | null,
  originalValue: null as any,
  tempValue: null as any
})

const editingValue = computed({
  get: () => editingState.tempValue,
  set: (value) => editingState.tempValue = value
})

// 数据处理
const filteredData = computed(() => {
  if (!globalSearch.value) return props.data
  
  return props.data.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(globalSearch.value.toLowerCase())
    )
  )
})

// 单元格编辑逻辑
const isEditingCell = (row: any, prop: string) => {
  return editingState.rowId === row[props.rowKey] && editingState.prop === prop
}

const enterEditMode = (row: any, prop: string) => {
  editingState.rowId = row[props.rowKey]
  editingState.prop = prop
  editingState.originalValue = row[prop]
  editingState.tempValue = row[prop] // 初始化临时值

  // 自动聚焦（使用nextTick等待DOM渲染）
  nextTick(() => {
    const input = document.querySelector('.cell-edit-container input, .cell-edit-container .el-select') as HTMLElement
    input?.focus?.()
  })
}

const saveEdit = (row: any, prop: string, customValue?: any) => {
  if (editingState.rowId === row[props.rowKey] && editingState.prop === prop) {
    const newValue = customValue !== undefined ? customValue : editingValue.value
    row[prop] = newValue // 更新行数据
    
    emit('cell-edit', {
      rowId: row[props.rowKey],
      prop,
      oldValue: editingState.originalValue,
      newValue
    })
    
    // 重置编辑状态
    editingState.rowId = null
    editingState.prop = null
    editingState.originalValue = null
    editingState.tempValue = null
  }
}

const cancelEdit = () => {
  // 取消编辑，恢复原始值
  if (editingState.rowId && editingState.prop) {
    const row = props.data.find(r => r[props.rowKey] === editingState.rowId)
    if (row) {
      row[editingState.prop] = editingState.originalValue
    }
  }
  
  // 重置编辑状态
  editingState.rowId = null
  editingState.prop = null
  editingState.originalValue = null
  editingState.tempValue = null
}

// 事件处理
const handleCellClick = (row: any, column: any) => {
  // 如果正在编辑，则不触发自定义事件
  if (editingState.rowId) return

  const columnProp = column.property
  const colConfig = visibleColumns.value.find(c => c.prop === columnProp)
  if (colConfig?.event) {
    emit('custom-event', { event: colConfig.event, row, column: colConfig })
  }
}

const handleSizeChange = (size: number) => {
  emit('update:pageSize', size)
  // 重置到第一页
  emit('update:currentPage', 1)
}

const handlePageChange = (page: number) => {
  emit('update:currentPage', page)
}

const showColumnConfig = () => {
  showConfigDrawer.value = true
}

// 全局搜索处理（防抖）