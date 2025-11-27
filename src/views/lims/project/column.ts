const column = [
    { label: "原系统ID", prop: "originalId", width: "120", editable: true, editType: 'text' },
    { label: "方案代码", prop: "programCode", width: "150", editable: true, editType: 'text' },
    { label: "方案类型", prop: "profileType", width: "120", editable: true, editType: 'text' },
    { label: "方案名称", prop: "profile", width: "150", editable: true, editType: 'text' },
    { label: "主项目数", prop: "mainProNum", width: "100", editable: true, editType: 'text' },
    { label: "启用日期", prop: "startUseDate", width: "160", type: "date", editable: true, editType: 'date' },
    { label: "到期日期", prop: "expirationDate", width: "160", type: "date", editable: true, editType: 'date' },
    { label: "状态", prop: "status", width: "100", editable: true, editType: 'text' },
    { label: "显示状态", prop: "dispStatus", width: "100", editable: true, editType: 'text' },
    { label: "行审核状态", prop: "rowAudit", width: "120", editable: true, editType: 'text' },
    { label: "价格", prop: "mPrice", width: "100", editable: true, editType: 'text' },
    { label: "方案说明", prop: "explainDesc", width: "150", editable: true, editType: 'textarea' },
    { label: "备注", prop: "remark", width: "150", editable: true, editType: 'textarea' }
];

export default column;
