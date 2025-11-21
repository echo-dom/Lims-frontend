<template>
    <GenericTable 
        :columnList="columnList"
        :getDataApi="listCustomer"
        @dataLoaded="onDataLoaded"
    />
</template>

<script lang="ts" setup>
import GenericTable from './GenericTable.vue'
import { listCustomer } from "@/api/lims/customer"
import column from './column';

const columnList = column;

const onDataLoaded = (data) => {
    console.log('Data loaded:', data);
}
</script>