const ismainpro_renderer = (scope: any) => {
    const { column, row } = scope;
    if (row[column.property] == 1) {
        return '是'
    }
    return '否'
}
const column = [
    // { keyword:'', label: "受理单id", prop: "clearanceid", width: "140" },
    { keyword: '', label: "样品ID", prop: "sampleId", width: "150" },
    { keyword: '', label: "样品编码", prop: "sampleCode", width: "150", editable: true, editType: 'text' },
    { keyword: '', label: "样品名称", prop: "sampleName", width: "150", editable: true, editType: 'text' },
    { keyword: '', label: "样品类型ID", prop: "sampleTypeId", width: "140", editable: true, editType: 'text' },
    { keyword: '', label: "客户名称", prop: "customerName", width: "140", editable: true, editType: 'text' },
    { keyword: '', label: "批次号", prop: "batchNumber", width: "140" },
    { keyword: '', label: "生产日期", prop: "productionDate", width: "140", type: "date", editable: true, editType: 'date' },
    { keyword: '', label: "有效期至", prop: "expiryDate", width: "140", type: "date" },
    { keyword: '', label: "采样日期", prop: "samplingDate", width: "140", type: "date" },
    { keyword: '', label: "采样地点", prop: "samplingLocation", width: "140" },
    {
        keyword: '', label: "样品状态", prop: "sampleStatus", width: "140", editable: false,
        editType: 'select',
        options: [
            { label: '是', value: true },
            { label: '否', value: false },
        ]
    },
    // { keyword: '', label: "存储位置", prop: "storageLocation", width: "140" },
    { keyword: '', label: "抽样计划", prop: "fromFolderNo", width: "140" },
    { keyword: '', label: "任务状态", prop: "taskStatus", width: "140" },
    { keyword: '', label: "开案人描述", prop: "auditorDesc", width: "140" },
    { keyword: '', label: "开案时间", prop: "auditTime", width: "160", type: "date" },
    { keyword: '', label: "退回原因", prop: "returnReason", width: "140" },
    { keyword: '', label: "退回人", prop: "returnPerson", width: "140" },
    { keyword: '', label: "退回时间", prop: "returnTime", width: "160", type: "date" },
    { keyword: '', label: "原始记录名称", prop: "originalRecordName", width: "140" },
    { keyword: '', label: "收款状态", prop: "paymentStatus", width: "140" },
    { keyword: '', label: "主项目数", prop: "mainProNum", width: "140" },
    { keyword: '', label: "备注", prop: "remark", width: "140" },

    // { keyword: '', label: "是否主项", prop: "ismainpro", width: "160", renderer: ismainpro_renderer },


];

export default column;



