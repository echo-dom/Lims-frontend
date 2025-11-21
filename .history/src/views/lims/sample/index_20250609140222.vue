<template>
  <SmartTable
    :data="tableData"
    :columns="columns"
    :total="totalCount"
    :page-size="queryParams.pageSize"
    @update:pageSize="handlePageSizeChange"
    @update:currentPage="handlePageChange"
    @cell-edit="handleCellEdit"
    @custom-event="handleCustomEvent"
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

<script setup>
import { ref } from 'vue'
import SmartTable from '@/components/Table/SmartTable.vue'

const columns = ref([
  { prop: 'id', label: 'ID', type: 'number' },
  { prop: 'name', label: '姓名', type: 'text' },
  { 
    prop: 'birthday', 
    label: '生日', 
    type: 'date',
    formatter: val => val ? dayjs(val).format('YYYY年MM月DD日') : '-'
  },
  {
    prop: 'status',
    label: '状态',
    type: 'custom',
    event: 'status-change'
  },
  { prop: 'department', label: '部门', filters: [
    { text: '技术部', value: 'tech' },
    { text: '市场部', value: 'market' }
  ]}
])

const handleCellEdit = ({ rowId, prop, value }) => {
  console.log(`单元格更新: ${prop} = ${value}`)
  // 调用API提交更新
  apiUpdateCell(rowId, prop, value)
}

const handleCustomEvent = ({ event, row }) => {
  if (event === 'status-change') {
    ElMessage.info(`状态变更: ${row.name} - ${row.status}`)
  }
}
</script>