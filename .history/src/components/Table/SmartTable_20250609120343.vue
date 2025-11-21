<template>
  <div class="smart-table-container">
    <!-- 工具栏 -->
    <div class="table-toolbar">
      <el-button @click="showColumnConfig" size="small">
        <i class="ri-table-columns"></i> 列配置
      </el-button>
      <el-input v-model="globalSearch" placeholder="全局搜索..." clearable style="width: 200px" />
    </div>

    <!-- 智能表格 -->
    <el-table
      :data="filteredData"
      border
      highlight-current-row
      @cell-click="handleCellClick"
      style="width: 100%"
    >
      <el-table-column 
        v-for="col in visibleColumns" 
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :sortable="col.sortable"
        :filters="col.filters"
        :filter-method="createFilterHandler(col)"
      >
        <template #default="{ row, $index }">
          <!-- 查看模式 -->
          <div v-if="!isEditingCell(row, col.prop)" @dblclick="enterEditMode(row, col.prop)">
            <!-- 自定义内容渲染 -->
            <slot v-if="col.slot" :name="`col-${col.prop}`" :row="row" />
            <!-- 默认渲染 -->
            <template v-else>
              {{ formatCellValue(row[col.prop], col.type) }}
            </template>
          </div>
          
          <!-- 编辑模式 -->
          <div v-else class="cell-edit-container">
            <!-- 文本输入 -->
            <el-input
              v-if="col.type === 'text' || col.type === 'number'"
              v-model="row[col.prop]"
              @blur="exitEditMode"
              @keyup.enter="exitEditMode"
              autofocus
            />
            
            <!-- 日期选择 -->
            <el-date-picker
              v-else-if="col.type === 'date'"
              v-model="row[col.prop]"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @blur="exitEditMode"
              autofocus
            />
            
            <!-- 下拉选择 -->
            <el-select
              v-else-if="col.type === 'select'"
              v-model="row[col.prop]"
              @blur="exitEditMode"
              @change="exitEditMode"
              autofocus
            >
              <el-option
                v-for="opt in col.options"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
            
            <!-- 自定义编辑组件 -->
            <slot
              v-else-if="col.editSlot"
              :name="`edit-${col.prop}`"
              :row="row"
              :prop="col.prop"
              @save="exitEditMode"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div class="table-pagination">
      <span class="total-count">共 {{ total }} 条</span>
      <el-pagination
        background
        layout="prev, pager, next, sizes"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
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
import { ref, computed, reactive } from 'vue'
import TableColumnConfig from './TableColumnConfig.vue'
import { ColumnConfig } from './types'

// Props定义
const props = defineProps({
  data: { type: Array, required: true },
  columns: { type: Array as () => ColumnConfig[], required: true },
  total: { type: Number, default: 0 },
  pageSize: { type: Number, default: 10 }
})

// 事件定义
const emit = defineEmits(['update:pageSize', 'update:currentPage', 'cell-edit', 'custom-event'])

// 状态管理
const currentPage = ref(1)
const globalSearch = ref('')
const showConfigDrawer = ref(false)
const editingCell = reactive({ rowId: null, prop: null })

// 列配置处理
const allColumns = ref<ColumnConfig[]>([...props.columns])
const visibleColumns = ref<ColumnConfig[]>(
  props.columns.filter(col => col.visible !== false)
)

// 数据处理
const filteredData = computed(() => {
  return props.data.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(globalSearch.value.toLowerCase())
    )
  )
})

// 单元格编辑逻辑
const isEditingCell = (row: any, prop: string) => {
  return editingCell.rowId === row.id && editingCell.prop === prop
}

const enterEditMode = (row: any, prop: string) => {
  editingCell.rowId = row.id
  editingCell.prop = prop
}

const exitEditMode = () => {
  if (editingCell.rowId) {
    emit('cell-edit', {
      rowId: editingCell.rowId, 
      prop: editingCell.prop,
      value: props.data.find(r => r.id === editingCell.rowId)[editingCell.prop]
    })
  }
  editingCell.rowId = null
  editingCell.prop = null
}

// 事件处理
const handleCellClick = (row: any, column: any, cell: any, event: Event) => {
  const customEvent = visibleColumns.value.find(c => c.prop === column.property)?.event
  if (customEvent) {
    emit('custom-event', { event: customEvent, row, column })
  }
}

const handleSizeChange = (size: number) => emit('update:pageSize', size)
const handlePageChange = (page: number) => emit('update:currentPage', page)
const showColumnConfig = () => showConfigDrawer.value = true

// 工具函数
const formatCellValue = (value: any, type: string) => {
  if (type === 'date' && value) return dayjs(value).format('YYYY-MM-DD')
  return value
}

const createFilterHandler = (col: ColumnConfig) => {
  return (value: any, row: any) => {
    if (!col.filterMethod) return true
    return col.filterMethod(value, row[col.prop])
  }
}
</script>

<style scoped>
.cell-edit-container {
  position: relative;
  margin: -10px;
  width: calc(100% + 20px);
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}
</style>