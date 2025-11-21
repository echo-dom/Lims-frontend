<template>
  <GenericTable 
    :tabs="tabs"
    :columnList="columnList"
    :getDataApi="fetchUserList"
    @dataLoaded="onUserListLoaded"
  />
</template>

<script lang="ts" setup>
import GenericTable from './GenericTable.vue';
import { fetchUserList } from '@/api/user';
import columns from './userColumns';

const tabs = [
  {
    name: 'active',
    label: '活跃用户',
    buttons: [
      { label: '启用用户', action: 'enable' },
      { label: '禁用用户', action: 'disable' },
      { label: '导出Excel', action: 'export' },
    ]
  },
  {
    name: 'inactive',
    label: '非活跃用户',
    buttons: [
      { label: '重新激活', action: 'reactivate' },
      { label: '导出Excel', action: 'export' },
    ]
  }
];

const columnList = columns;

const onUserListLoaded = (data: any[]) => {
  console.log('用户数据已加载:', data);
};
</script>

<style scoped>
/* 可选样式 */
</style>
