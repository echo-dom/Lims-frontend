<template>
  <SmartTable
    :data="tableData"
    :columns="columns"
    :total="total"
    :page-size="queryParams.pageSize"
    :current-page="queryParams.pageNum"
    @update:page-size="handlePageSizeChange"
    @update:current-page="handlePageChange"
    @cell-edit="handleCellEdit"
    @custom-event="handleCustomEvent"
    @global-search="handleGlobalSearch"
  >
    <!-- 自定义状态列渲染 -->
    <template #col-status="{ row }">
      <el-tag :type="row.status === 1 ? 'success' : 'danger'">
        {{ row.status === 1 ? '启用' : '停用' }}
      </el-tag>
    </template>

    <!-- 自定义状态编辑 -->
    <template #edit-status="{ row, save }">
      <el-select v-model="row.status" @change="save">
        <el-option label="启用" :value="1" />
        <el-option label="停用" :value="0" />
      </el-select>
    </template>
  </SmartTable>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import SmartTable from '@/components/SmartTable/SmartTable.vue'
import type { ColumnConfig } from '@/components/SmartTable/types'
// import { getUserList, updateUserCell } from '@/api/system/user'
import { listSample, getSample, delSample, addSample, updateSample } from "@/api/lims/sample"


// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  search: ''
})

// 表格数据
const tableData = ref([])
const total = ref(0)

// 列配置
const columns = ref<ColumnConfig[]>([
  { prop: 'sampleId', label: '样品ID', type: 'number', width: '80px', sortable: true },
  { prop: 'sampleCode', label: '样品编码', type: 'text', editable: true },
  { 
    prop: 'productionDate', 
    label: '生产日期', 
    type: 'date',
    formatter: (val) => val ? dayjs(val).format('YYYY年MM月DD日') : '-',
    editable: true
  },
  {
    prop: 'status',
    label: '状态',
    type: 'custom',
    event: 'status-change',
    editable: true
  },
  { 
    prop: 'sampleStatus', 
    label: '样品状态', 
    filters: [
      { text: '技术部', value: 'tech' },
      { text: '市场部', value: 'market' }
    ],
    editable: true
  },
  { prop: 'samplingLocation', label: '采样地点', editable: true },
  { prop: 'expiryDate', label: '有效期至', type: 'date' }
])

// 获取数据
const fetchData = async () => {
   listSample(queryParams).then(response => {
    tableData.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 查询LIMS样品列表 */
function getList() {
  listSample(queryParams.value).then(response => {
    tableData.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 单元格编辑处理
const handleCellEdit = async ({ rowId, prop, oldValue, newValue }) => {
  try {
    // await updateUserCell({ id: rowId, field: prop, value: newValue })
    ElMessage.success('保存成功')
  } catch (error) {
    // 恢复原始值
    const row = tableData.value.find(r => r.id === rowId)
    if (row) row[prop] = oldValue
    ElMessage.error('保存失败: ' + error.message)
  }
}

// 自定义事件处理
const handleCustomEvent = ({ event, row }) => {
  if (event === 'status-change') {
    ElMessage.info(`状态变更: ${row.name} - ${row.status === 1 ? '启用' : '停用'}`)
  }
}

// 分页处理
const handlePageSizeChange = (size) => {
  queryParams.pageSize = size
  fetchData()
}

const handlePageChange = (page) => {
  queryParams.pageNum = page
  fetchData()
}

// 全局搜索
const handleGlobalSearch = (search) => {
  queryParams.search = search
  queryParams.pageNum = 1
  fetchData()
}

// 初始加载数据
fetchData()
</script>