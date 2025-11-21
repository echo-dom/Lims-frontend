const ismainpro_renderer = (scope:any)=>{
    const {column,row} = scope;
    if(row[column.property] == 1){
        return '是'
    }
    return '否'
}
const column = [
    // { keyword:'', label: "状态", prop: "ORDTASKID", width: "140" },
    // { keyword:'', label: "受理单id", prop: "clearanceid", width: "140" },
    { keyword:'', label: "受理单编号", prop: "matcode", width: "150" },
    { keyword:'', label: "样品到达日期", prop: "receivedate", width: "150",type:"date" },
    { keyword:'', label: "工作日", prop: "workday", width: "150" },
    { keyword:'', label: "出数审核状态", prop: "auditingstatus", width: "140" },
    { keyword:'', label: "同组互审状态", prop: "tzstatus", width: "140" },
    { keyword:'', label: "计划(抽样计划)", prop: "fromfolderno", width: "140" },
    { keyword:'', label: "合同名称", prop: "contractname", width: "140" },
    { keyword:'', label: "开案人", prop: "lcauditordesc", width: "140" },
    { keyword:'', label: "四级分类", prop: "fulltype", width: "140" },
    { keyword:'', label: "食品大类", prop: "fulltype0", width: "140" },
    { keyword:'', label: "食品亚类", prop: "fulltype1", width: "140" },
    { keyword:'', label: "食品次亚类", prop: "fulltype2", width: "200" },
    { keyword:'', label: "食品细类", prop: "fulltype3", width: "140" },
    { keyword:'', label: "样品编号", prop: "ordno", width: "180" },
    { keyword:'', label: "样品名称", prop: "samplename", width: "140" },
    { keyword:'', label: "项目", prop: "testname", width: "140" },
    { keyword:'', label: "批号", prop: "runno", width: "140" },
    { keyword:'', label: "样品等级", prop: "SAMPLE_GRADE", width: "180" },
    { keyword:'', label: "判定依据", prop: "newcriterionid", width: "200"  },
    { keyword:'', label: "原始记录", prop: "ysjlcode", width: "180" },
    { keyword:'', label: "项目结论", prop: "judgment", width: "200"  },
    { keyword:'', label: "检验类型", prop: "testtype", width: "200"  },
    { keyword:'', label: "检测方法", prop: "method_clausename", width: "140" },
    { keyword:'', label: "低限", prop: "low", width: "150" },
    { keyword:'', label: "低限单位", prop: "lowaunit", width: "200" },
    { keyword:'', label: "高限", prop: "high", width: "140" },
    { keyword:'', label: "高限单位", prop: "highaunit", width: "180" },
    { keyword:'', label: "文本限", prop: "textlimit", width: "180" },
    { keyword:'', label: "报告结果", prop: "finalresult", width: "140" },
    { keyword:'', label: "结果单位", prop: "units", width: "140" },
    { keyword:'', label: "方法中现定的检出限说明", prop: "validlimitrem", width: "140" },
    { keyword:'', label: "方法检出限", prop: "notdetectedremark", width: "140" },
    { keyword:'', label: "检出限定量限单位", prop: "testlimit_unit", width: "140" },
    { keyword:'', label: "原未检出备注", prop: "notdetectedremark2", width: "140" },
    { keyword:'', label: "项目备注", prop: "testremark", width: "140" },
    { keyword:'', label: "报告中项目备注", prop: "reportremark", width: "140" },
    { keyword:'', label: "不检原因", prop: "remark", width: "140" },
    { keyword:'', label: "生产日期", prop: "datetypetime", width: "140" },
    { keyword:'', label: "要求完成时间", prop: "executestandard", width: "140" },
    { keyword:'', label: "执行标准", prop: "validlimitrem", width: "220" },
    { keyword:'', label: "质量等级", prop: "samplegrades", width: "140" },
    { keyword:'', label: "操作时间", prop: "operatime", width: "180" },
    { keyword:'', label: "操作员", prop: "operater", width: "160" },
    { keyword:'', label: "提交人", prop: "fullname", width: "160", },
    { keyword:'', label: "提交时间", prop: "testdate", width: "160", },
    { keyword:'', label: "报告中显示", prop: "displayflag", width: "160", },
    { keyword:'', label: "是否主项", prop: "ismainpro", width: "160", renderer:ismainpro_renderer},
    { keyword:'', label: "理论主项数", prop: "mainpronum", width: "160", },
    { keyword:'', label: "实际主项数", prop: "mainnum", width: "160",},

];

export default column;



