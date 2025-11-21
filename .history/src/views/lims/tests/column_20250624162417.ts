const ismainpro_renderer = (scope:any)=>{
    const {column,row} = scope;
    if(row[column.property] == 1){
        return '是'
    }
    return '否'
}
const column = [
    { keyword:'', label: "项目序号", prop: "sorter", width: "150" },
    { keyword:'', label: "项目编码", prop: "testcode", width: "150",editable: true,editType:'text' },
    { keyword:'', label: "项目名称", prop: "testname", width: "150",editable: true,editType:'text' },
    { keyword:'', label: "检验项目说明", prop: "testexplain", width: "140",editable: true,editType:'text' },
    { keyword:'', label: "英文缩写", prop: "customerId", width: "140" ,editable: true,editType:'text'},
    { keyword:'', label: "四级分类", prop: "fulltype", width: "140" },
    { keyword:'', label: "领域代码", prop: "domainid", width: "140" },
    { keyword:'', label: "项目类型ID", prop: "testcategoryid", width: "140" },
    { keyword:'', label: "项目类型名称", prop: "testcatename", width: "140" },
    { keyword:'', label: "微生物标识 (0/1)", prop: "wswflag", width: "140" },
    { keyword:'', label: "报告中显示名称", prop: "nameinreport", width: "140", },
    { keyword:'', label: "原始记录编码", prop: "originalcode", width: "140" },
    { keyword:'', label: "制样方法", prop: "samplingMethod", width: "140" },
    { keyword:'', label: "历史检验人", prop: "historyperson", width: "160", },
    { keyword:'', label: "科室", prop: "dept", width: "160", },
    { keyword:'', label: "状态", prop: "status", width: "160",},
    { keyword:'', label: "项目ID", prop: "testsid", width: "150",hidden:true },


];

export default column;



