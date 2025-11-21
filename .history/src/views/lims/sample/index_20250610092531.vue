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
import { listCustomer, getCustomer, delCustomer, addCustomer, updateCustomer } from "@/api/lims/customer"
import column from './column';

const tabs = [
    {
        name: '未分配',
        label: '未分配客户',
        buttons: [
            { label: '分配业务员' },
            { label: '导出客户信息' },
            { label: '批量删除' },
        ]
    },
    {
        name: '已分配',
        label: '已分配客户',
        buttons: [
            { label: '修改分配信息' },
            { label: '导出客户信息' },
        ]
    },
    {
        name: '已删除',
        label: '已删除客户',
        buttons: [
            { label: '还原客户' },
            { label: '彻底删除' },
        ]
    }
]

const columnList = column;

const onDataLoaded = (data) => {
    console.log('客户数据加载完成:', data);
}
</script>
