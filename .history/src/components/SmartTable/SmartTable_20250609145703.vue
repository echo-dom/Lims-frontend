<template>
  <div class="advanced-table-container">
    <!-- 工具栏 -->
    <div class="toolbar mb-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增
        </el-button>
        <el-button type="success" @click="handleBatchExport">
          <el-icon><Download /></el-icon>导出
        </el-button>
        <el-button type="danger" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon>删除
        </el-button>
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <el-input v-model="searchKey" placeholder="请输入搜索内容" clearable @keyup.enter="handleSearch" 
                  class="w-64">
          <template #suffix>
            <el-button icon="Search" @click="handleSearch" type="primary" circle />
          </template>
        </el-input>
        <el-button type="primary" @click="handleRefresh">
          <el-icon><Refresh /></el-icon>刷新
        </el-button>
      </div>
    </div>
    
    <!-- 表格主体 -->
    <div class="table-wrapper">
      <el-table 
        :data="tableData" 
        stripe 
        border 
        highlight-current-row
        @row-click="handleRowClick"
        @cell-dblclick="handleCellEditStart"
        v-loading="loading"
        :row-key="row => row.id">
        
        <!-- 选择列 -->
        <el-table-column type="selection" width="55" v-if="showSelection" />
        
        <!-- 序号列 -->
        <el-table-column label="序号" type="index" width="60" />
        
        <!-- 动态生成列 -->
        <el-table-column 
          v-for="column in tableColumns" 
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width || ''"
          :align="column.align || 'center'"
          :formatter="column.formatter">
          
          <!-- 自定义列内容 -->
          <template #default="scope">
            <div v-if="editingCell.rowIndex === scope.$index && editingCell.prop === column.prop">
              <component 
                :is="getEditComponent(column.type)" 
                :value="scope.row[column.prop]"
                @input="val => handleCellInput(scope.$index, column.prop, val)"
                @blur="handleCellEditEnd"
                @confirm="handleCellEditEnd">
              </component>
            </div>
            <div v-else>
              <span v-if="column.type === 'date'">
                {{ formatDate(scope.row[column.prop]) }}
              </span>
              <span v-else-if="column.type === 'number'">
                {{ formatNumber(scope.row[column.prop]) }}
              </span>
              <span v-else-if="column.type === 'select'">
                {{ getDictLabel(column.dictType, scope.row[column.prop]) }}
              </span>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </div>
          </template>
          
          <!-- 列筛选 -->
          <template #header-append>
            <el-popover 
              ref="popoverRef"
              placement="bottom-start" 
              width="200" 
              trigger="click">
              <template #content>
                <div class="p-3">
                  <div v-if="column.type === 'select'" class="mb-3">
                    <el-checkbox-group v-model="filterParams[column.prop]">
                      <el-checkbox v-for="item in getDictOptions(column.dictType)" 
                                  :key="item.value" 
                                  :label="item.value">
                        {{ item.label }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div v-else class="mb-3">
                    <el-input v-model="filterParams[column.prop]" placeholder="输入筛选值" clearable />
                  </div>
                  <div class="flex justify-end gap-2">
                    <el-button size="small" @click="() => popoverRef[column.prop]?.hide()">取消</el-button>
                    <el-button size="small" type="primary" @click="() => handleFilter(column.prop)">确定</el-button>
                  </div>
                </div>
              </template>
              <el-icon class="cursor-pointer ml-1" @click.stop>
                <Filter />
              </el-icon>
            </el-popover>
          </template>
        </el-table-column>
        
        <!-- 操作列 -->
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              @click="handleEdit(scope.row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(scope.row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页控件 -->
      <div class="mt-4 flex justify-between items-center">
        <div class="text-sm text-gray-500">
          共 <span class="text-primary font-bold">{{ total }}</span> 条数据
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, defineComponent, toRefs } from 'vue'
import { ElTable, ElTableColumn, ElPagination, ElButton, ElInput, ElPopover, ElCheckbox, ElCheckboxGroup, ElDatePicker, ElSelect, ElOption, ElIcon, ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download, Delete, Search, Refresh, Edit, Filter } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'

// 组件接收的props
const props = defineComponent({
  props: {
    // 接口URL
    apiUrl: {
      type: String,
      required: true
    },
    // 表格列配置
    columns: {
      type: Array,
      default: () => []
    },
    // 是否显示选择框
    showSelection: {
      type: Boolean,
      default: true
    },
    // 是否立即加载数据
    immediate: {
      type: Boolean,
      default: true
    }
  }
}).props

// 状态定义
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const searchKey = ref('')
const filterParams = reactive({})
const editingCell = ref({ rowIndex: -1, prop: '' })
const selectedRows = ref([])
const popoverRef = ref({}) // 添加ref用于访问popover组件

// 表格列配置，修复初始化
const tableColumns = ref([])

onMounted(() => {
  // 确保columns是数组后再赋值
  if (Array.isArray(props.columns)) {
    tableColumns.value = [...props.columns]
  } else {
    console.warn('columns prop is not an array, using empty array instead')
    tableColumns.value = []
  }
  
  if (props.immediate) {
    loadData()
  }
})

// 数据加载方法
const loadData = debounce(async () => {
  loading.value = true
  
  try {
    // 这里应该调用实际的API接口
    // 示例使用模拟数据
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKey.value,
      ...filterParams
    }
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟返回数据
    tableData.value = [
      { id: 1, name: '张三', age: 28, gender: '1', birthday: '2000-01-01', status: '1' },
      { id: 2, name: '李四', age: 32, gender: '1', birthday: '1995-03-15', status: '0' },
      { id: 3, name: '王五', age: 24, gender: '2', birthday: '2002-07-20', status: '1' }
    ]
    
    total.value = 100 // 模拟总记录数
    
  } catch (error) {
    console.error('加载数据失败', error)
    ElMessage.error('加载数据失败，请重试')
  } finally {
    loading.value = false
  }
}, 300)

// 事件处理方法
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  loadData()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  loadData()
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleRefresh = () => {
  searchKey.value = ''
  filterParams.value = {}
  currentPage.value = 1
  loadData()
}

const handleRowClick = (row) => {
  // 行点击事件
  console.log('点击行数据', row)
}

const handleEdit = (row) => {
  // 编辑按钮点击事件
  console.log('编辑数据', row)
  // 这里可以跳转到编辑页面或显示编辑对话框
}

const handleDelete = (row) => {
  // 删除按钮点击事件
  ElMessageBox.confirm(
    `确定要删除 ${row.name} 的数据吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('删除数据', row)
    // 调用删除API
    loadData()
  }).catch(() => {
    // 取消操作
  })
}

const handleAdd = () => {
  // 新增按钮点击事件
  console.log('新增数据')
  // 这里可以跳转到新增页面或显示新增对话框
}

const handleBatchExport = () => {
  // 批量导出按钮点击事件
  console.log('批量导出数据')
}

const handleBatchDelete = () => {
  // 批量删除按钮点击事件
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的数据')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 条数据吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    console.log('批量删除数据', selectedRows.value)
    // 调用批量删除API
    loadData()
  }).catch(() => {
    // 取消操作
  })
}

const handleCellEditStart = (row, column, cell, event) => {
  // 开始单元格编辑
  if (column.editable === false) return
  
  editingCell.value = {
    rowIndex: tableData.value.findIndex(item => item.id === row.id),
    prop: column.property
  }
  
  // 延迟聚焦，确保输入框已渲染
  setTimeout(() => {
    const inputEl = event.target.querySelector('input,textarea,el-date-picker')
    if (inputEl) {
      inputEl.focus()
    }
  }, 100)
}

const handleCellEditEnd = () => {
  // 结束单元格编辑
  editingCell.value = { rowIndex: -1, prop: '' }
}

const handleCellInput = (rowIndex, prop, value) => {
  // 单元格输入事件
  tableData.value[rowIndex][prop] = value
}

const handleFilter = (prop) => {
  // 筛选事件
  currentPage.value = 1
  loadData()
  // 隐藏筛选框
  popoverRef.value[prop]?.hide()
}

// 工具方法
const formatDate = (dateStr) => {
  // 日期格式化
  if (!dateStr) return ''
  return dateStr
}

const formatNumber = (num) => {
  // 数字格式化
  return num ? num.toString() : ''
}

const getDictOptions = (dictType) => {
  // 获取字典选项
  // 实际项目中应该从字典管理模块获取
  const dicts = {
    gender: [
      { value: '1', label: '男' },
      { value: '2', label: '女' }
    ],
    status: [
      { value: '1', label: '正常' },
      { value: '0', label: '禁用' }
    ]
  }
  
  return dicts[dictType] || []
}

const getDictLabel = (dictType, value) => {
  // 获取字典标签
  const options = getDictOptions(dictType)
  const item = options.find(item => item.value === value)
  return item ? item.label : value
}

const getEditComponent = (type) => {
  // 根据字段类型获取编辑组件
  switch (type) {
    case 'date':
      return 'el-date-picker'
    case 'select':
      return 'el-select'
    case 'number':
      return 'el-input-number'
    default:
      return 'el-input'
  }
}

// 监听选中行变化
watch(selectedRows, (val) => {
  console.log('选中行变化', val)
})
</script>

<style scoped>
.advanced-table-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-wrapper {
  overflow: hidden;
}

.el-table .cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-date-picker, .el-input-number, .el-select {
  width: 100%;
}
</style>