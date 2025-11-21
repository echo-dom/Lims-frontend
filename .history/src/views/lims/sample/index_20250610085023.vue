<template>
  <div class="app-container">
    <custom-table
      :title="用户管理"
      :column-list="columns"
      :get-data-api="getUserList"
    />
  </div>
</template>

<script setup>
import CustomTable from './GenericTable';
import { getUserList } from '@/api/system/user';

// 列定义
const columns = [
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'age', label: '年龄', type: 'number', width: 100 },
  { prop: 'role', label: '角色', type: 'role', minWidth: 150 },
  { prop: 'department', label: '部门', minWidth: 150 },
  { prop: 'status', label: '状态', type: 'status', width: 120 },
  { prop: 'createTime', label: '创建时间', type: 'date', minWidth: 180, fixed: 'left' }
];
</script>