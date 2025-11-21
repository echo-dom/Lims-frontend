<template>
    <GenericTable 
        :columnList="columnList"
        :getDataApi="listCustomer"
        @dataLoaded="onDataLoaded"
    />
</template>

<script lang="ts" setup>
import GenericTable from './GenericTable.vue'
// import { selectAuditExamineByCond, } from '@/service/api';
import { listCustomer, getCustomer, delCustomer, addCustomer, updateCustomer } from "@/api/lims/customer"

import column from './column';

const columnList = column;

const onDataLoaded = (data) => {
    console.log('Data loaded:', data);
}
</script>