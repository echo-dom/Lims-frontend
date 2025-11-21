const ismainpro_renderer = (scope:any)=>{
    const {column,row} = scope;
    if(row[column.property] == 1){
        return '是'
    }
    return '否'
}
const column = [
    { keyword:'', label: "排序号", prop: "sorter", width: "90" },
    { keyword:'', label: "分析项ID", prop: "analytesid", width: "150" },
    { keyword:'', label: "所属检测项目ID", prop: "testsid", width: "150",hidden:true },
    { keyword:'', label: "分析项目名称", prop: "analyte", width: "150" },
    { keyword:'', label: "别名", prop: "sinonym", width: "140",editable: true,editType:'text' },
    { keyword:'', label: "修约", prop: "picture", width: "140" ,editable: true,editType:'text'},
    { keyword:'', label: "计量单位", prop: "units", width: "140" },
    { keyword:'', label: "重复数", prop: "repnum", width: "140" },
    { keyword:'', label: "分析项类型", prop: "analyteype", width: "140" },
    { keyword:'', label: "报告显示", prop: "displayflag", width: "140" },
    { keyword:'', label: "是否科学计数", prop: "scientflag", width: "140" },
    { keyword:'', label: "低限", prop: "low", width: "140", },
    { keyword:'', label: "高限", prop: "high", width: "140" },
    { keyword:'', label: "版本", prop: "version", width: "140" },
    { keyword:'', label: "公式名称", prop: "calcname", width: "160", },
    { keyword:'', label: "检测项目编码", prop: "testcode", width: "160", },
    { keyword:'', label: "检出限单位", prop: "lowUnit", width: "160",},
    { keyword:'', label: "定量限", prop: "quantificationLimit", width: "160",},
    { keyword:'', label: "定量限单位", prop: "qltUnit", width: "160",},
    { keyword:'', label: "纠正因子系数", prop: "correctionfactor", width: "160",},
    { keyword:'', label: "稀释倍数", prop: "dilutionrate", width: "160",},
    { keyword:'', label: "定容体积", prop: "volume", width: "160",},
    { keyword:'', label: "方法中规定的检出限说明", prop: "validlimitrem", width: "160",},
    { keyword:'', label: "检验方法", prop: "method", width: "160",},
    { keyword:'', label: "类型", prop: "analtype", width: "160",},
    { keyword:'', label: "分析项备注", prop: "analyteremark", width: "160",},
    { keyword:'', label: "分析项目英文名", prop: "analyteEn", width: "160",},
    { keyword:'', label: "分析项目别名英文名", prop: "sinonymEn", width: "160",},
    { keyword:'', label: "分析项目编码", prop: "analytescode", width: "160",},
    { keyword:'', label: "公式文本", prop: "formulatext", width: "160",},
    { keyword:'', label: "是否科学计数", prop: "scientific", width: "160",},
    { keyword:'', label: "未检出标志", prop: "ltdflag", width: "160",},
    { keyword:'', label: "未检出标志字符串", prop: "ltdflagc", width: "160",},
    { keyword:'', label: "是否现场采集", prop: "isscene", width: "160",},
    { keyword:'', label: "未检出备注", prop: "notdetectedremark", width: "160",},
    { keyword:'', label: "方法备注", prop: "testremark", width: "160",},
    { keyword:'', label: "是否公式显示", prop: "isformula", width: "160",},
    { keyword:'', label: "报告备注", prop: "reportremark", width: "160",},
    { keyword:'', label: "判定规则", prop: "decisionrules", width: "160",},
    { keyword:'', label: "不在原始记录中显示", prop: "orinodisplayflag", width: "160",},


];

export default column;



