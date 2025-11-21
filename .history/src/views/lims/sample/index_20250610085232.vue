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
// import { selectAuditExamineByCond, } from '@/service/api';
import { listCustomer, getCustomer, delCustomer, addCustomer, updateCustomer } from "@/api/lims/customer"

import column from './column';

const tabs = [
    {
        name: '待审核',
        label: '待审核',
        buttons: [
            { label: '提交',  },
            { label: '退回',  },
            { label: '批量修改报告备注',  },
            { label: '导出表单',  },
            { label: '修改高限',  },
            { label: '修改低限',  },
            { label: '修改高限单位',  },
            { label: '修改低限单位',  },
            { label: '修改文本限', },
            { label: '判定实测值', },
            { label: '溶液显示', }
        ]
    },
    {
        name: '已审核',
        label: '已审核',
        buttons: [
            { label: '退回',  },
            { label: '导出表单',  }
        ]
    }
]

const columnList = column;

const onDataLoaded = (data) => {
    console.log('Data loaded:', data);
}
</script>