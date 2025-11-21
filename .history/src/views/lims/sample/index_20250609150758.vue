<template>
    <GenericTable 
        :tabs="tabs"
        :columnList="columnList"
        :getDataApi="selectAuditExamineByCond"
        :submitAuditApi="submitAudit"
        :returnAuditApi="returnAuditByCond"
        :updateReportremarkApi="updateReportremarkByCond"
        :saveResultsExtendBeansApi="saveResultsExtendBeansInfosByCond"
        @dataLoaded="onDataLoaded"
    />
</template>

<script lang="ts" setup>
import GenericTable from '@/components/GenericTable/GenericTable.vue'
import { selectAuditExamineByCond, submitAudit, returnAuditByCond, updateReportremarkByCond, saveResultsExtendBeansInfosByCond } from '@/service/api';
import column from './column';

const tabs = [
    {
        name: '待审核',
        label: '待审核',
        buttons: [
            { label: '提交', handler: submit_audit_handler },
            { label: '退回', handler: return_audit_handler },
            { label: '批量修改报告备注', handler: update_audit_handler },
            { label: '导出表单', handler: exportExcel },
            { label: '修改高限', handler: () => updateHigh_handler('high') },
            { label: '修改低限', handler: () => updateHigh_handler('low') },
            { label: '修改高限单位', handler: exportExcel },
            { label: '修改低限单位', handler: exportExcel },
            { label: '修改文本限', handler: exportExcel },
            { label: '判定实测值', handler: exportExcel },
            { label: '溶液显示', handler: exportExcel }
        ]
    },
    {
        name: '已审核',
        label: '已审核',
        buttons: [
            { label: '退回', handler: exportExcel },
            { label: '导出表单', handler: exportExcel }
        ]
    }
]

const columnList = column;

const onDataLoaded = (data) => {
    console.log('Data loaded:', data);
}
</script>