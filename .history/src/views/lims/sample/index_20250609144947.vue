<template>
  <div class="container">
    <AdvancedTable 
      :apiUrl="apiUrl" 
      :columns="tableColumns"
      :showSelection="true"
    />
  </div>
</template>

<script setup>
import AdvancedTable from '@/components/SmartTable/SmartTable.vue'

const apiUrl = '/api/data/list'

const tableColumns = [
  { prop: 'name', label: '姓名', width: '120', editable: true },
  { prop: 'age', label: '年龄', width: '80', type: 'number', editable: true },
  { prop: 'gender', label: '性别', width: '80', type: 'select', dictType: 'gender', editable: true },
  { prop: 'birthday', label: '出生日期', width: '160', type: 'date', editable: true },
  { prop: 'status', label: '状态', width: '80', type: 'select', dictType: 'status' }
]
</script>