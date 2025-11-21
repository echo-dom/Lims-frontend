<template>
  <GenericTable 
    :tabs="tabs"
    :columnList="columnList"
    :getDataApi="listCustomer"
    @dataLoaded="onDataLoaded"
  />
</template>

<script lang="ts" setup>
import GenericTable from './GenericTable.vue'
import { listCustomer } from "@/api/lims/customer"
import column from './column';

const tabs = [
  {
    name: '未分配',
    label: '未分配客户',
    buttons: [
      { label: '分配客户' },
      { label: '导出数据' }
    ]
  },
  {
    name: '已分配',
    label: '已分配客户',
    buttons: [
      { label: '重新分配' },
      { label: '导出数据' }
    ]
  },
  {
    name: '已删除',
    label: '已删除客户',
    buttons: [
      { label: '恢复客户' },
      { label: '永久删除' }
    ]
  }
];

const columnList = column;

const onDataLoaded = (data: any) => {
  console.log('Data loaded:', data);
}
</script>
