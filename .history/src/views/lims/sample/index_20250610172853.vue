<template>
    <GenericTable 
        :columnList="columnList"
        :getDataApi="getSample"
        @dataLoaded="onDataLoaded"
    />
</template>

<script lang="ts" setup>
import GenericTable from '@/components/GenericTable/GenericTable.vue'
import { listSample, getSample, delSample, addSample, updateSample } from "@/api/lims/sample"

import column from './column';

const columnList = column;

const onDataLoaded = (data) => {
    console.log('Data loaded:', data);
}
</script>