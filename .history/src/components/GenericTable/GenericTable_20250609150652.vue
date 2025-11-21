<template>
    <el-container class="container">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="tab.label">
                <el-button v-for="button in tab.buttons" :key="button.label" @click="button.handler" class="btn">{{ button.label }}</el-button>
            </el-tab-pane>
        </el-tabs>
        <el-config-provider :locale="locale">
            <el-table 
                @selection-change="handleSelectionChange" 
                ref="multipleTableRef"
                v-loading.lock="loading" id="mtable"
                @row-click="hangdleRowClick"
                highlight-current-row
                :header-cell-style="{ 'font-size': '14px', 'font-weight': '700', 'color': '#000', 'background-color': '#dee5ed' }"
                stripe :data="tableData" border style="width: 100%;height: 100%;">
                <el-table-column type="selection" width="55" />
                <el-table-column v-for="cloumn in columnList" :key="cloumn.prop" align="center" show-overflow-tooltip
                    :filters="buildFilter(cloumn.prop)" :filter-method="filterHandler" sortable :prop="cloumn.prop"
                    :label="cloumn.label" :width="cloumn.width">
                    <template #header>
                        <span>{{ cloumn.label }}</span>
                        <el-input v-if="!cloumn.type" @keyup.enter="searchTable" style="float: left;"
                            v-model="cloumn.keyword" size="small" />
                        <div style="float: left;width: 100%;" v-if="cloumn.type == 'date'">
                            <div style="display: flex;">
                                <el-date-picker v-model="cloumn.keyword" type="date" placeholder="开始时间" :size="'small'"
                                    style="margin-bottom: 2px;" @change="changeTime(cloumn)" />
                                <el-date-picker v-model="cloumn.keyword2" type="date" placeholder="结束时间" :size="'small'"
                                    @change="changeTime(cloumn)" />
                            </div>
                        </div>
                    </template>
                    <template v-if="typeof cloumn.renderer == 'function'" #default="scope">
                        <div v-html="cloumn.renderer(scope)"></div>
                    </template>
                </el-table-column>
            </el-table>


            <el-pagination style="margin-top: 5px;" v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[50, 100, 200, 500, 1000, total]" layout="total, sizes, prev, pager, next, jumper"
                :total="total" background @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-config-provider>
    </el-container>
</template>

<script lang="ts" setup>

import { ref, onMounted, watch, computed, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
// import FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ElMessage, ElTable, ElMessageBox } from 'element-plus';
import type { TabsPaneContext } from 'element-plus'

const formatDateByYMD= (timestamp:any,fmt:string)=>{
    var me = new Date(timestamp);
    var o:any = {
        "M+": me.getMonth() + 1, //月份 
        "d+": me.getDate(), //日 
        "h+": me.getHours(), //小时 
        "m+": me.getMinutes(), //分 
        "s+": me.getSeconds(), //秒 
        "q+": Math.floor((me.getMonth() + 3) / 3), //季度 
        "S": me.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (me.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o['k']) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
const props = defineProps({
    tabs: {
        type: Array,
        default: () => []
    },
    columnList: {
        type: Array,
        default: () => []
    },
    getDataApi: {
        type: Function,
        required: true
    },
    submitAuditApi: {
        type: Function,
        default: () => {}
    },
    returnAuditApi: {
        type: Function,
        default: () => {}
    },
    updateReportremarkApi: {
        type: Function,
        default: () => {}
    },
    saveResultsExtendBeansApi: {
        type: Function,
        default: () => {}
    }
})

const emits = defineEmits(['dataLoaded'])

const router = useRouter()
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<[]>([])
// 导出excel
// const exportExcel = () => {
//     /* 从表生成工作簿对象 */
//     var wb = XLSX.utils.table_to_book(document.querySelector("#mtable"));
//     /* 获取二进制字符串作为输出 */
//     var wbout = XLSX.write(wb, {
//         bookType: "xlsx",
//         bookSST: true,
//         type: "array"
//     });
//     try {
//         FileSaver.saveAs(
//             //Blob 对象表示一个不可变、原始数据的类文件对象。
//             //Blob 表示的不一定是JavaScript原生格式的数据。
//             //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
//             //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
//             new Blob([wbout], { type: "application/octet-stream" }),
//             //设置导出文件名称
//             "sheetjs.xlsx"
//         );
//     } catch (e) {
//         if (typeof console !== "undefined") console.log(e, wbout);
//     }
//     return wbout;
// }

const activeName = ref('待审核')
const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
    console.log(activeName.value)
    getData()
}
// 当前行点击
const hangdleRowClick = (row:any,column:any)=>{
    
    multipleTableRef.value?.clearSelection();
    multipleTableRef.value?.toggleRowSelection(row,true);
}

//  操作相关
const handleSelectionChange = (val: []) => {
    console.log(val);
    // if(val)
    multipleSelection.value = val;
}
// 提交
const submit_audit_handler = async () => {
    const records = multipleTableRef.value?.getSelectionRows();
    console.log(records);
    if (!records || records.length === 0) {
        ElMessage.error('请选择数据！')
        return;
    }
    var ordtaskids = "";

    for (var i = 0; i < records.length; i++) {
        if (records[i].tzstatus == "审核中") {
            ElMessage.error('同组互审状态为审核中不能提交！')
            return;
        }
        ordtaskids += records[i].ordtaskid + ",";
    }
    if (ordtaskids.length > 0) {
        ordtaskids = ordtaskids.substring(0, ordtaskids.length - 1);
    }
    if (ordtaskids == null || "undefined" == ordtaskids) {
        ElMessage.error('该报告没有ordtaskid！')
        return;
    }
    const params = {
        'cond.ordtaskids': ordtaskids
    };
    try {
        loading.value = true
        const res = await props.submitAuditApi(params);
        getData();
    } catch (error) {
        loading.value = false
    }
}
// 退回
const return_audit_handler = async () => {
    const records = multipleTableRef.value?.getSelectionRows();
    console.log(records);
    if (!records || records.length === 0) {
        ElMessage.error('请选择数据！')
        return;
    }
    var ordtaskids = "";
    var clearanceids = "";

    for (var i = 0; i < records.length; i++) {
        ordtaskids += records[i].ordtaskid + ",";
        clearanceids += records[i].clearanceids + ",";
    }
    if (ordtaskids.length > 0) {
        ordtaskids = ordtaskids.substring(0, ordtaskids.length - 1);
    }
    if (clearanceids.length > 0) {
        clearanceids = clearanceids.substring(0, clearanceids.length - 1);
    }
    try {
    ElMessageBox.prompt('修改退回原因', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
    })
        .then(async ({ value }) => {
            const params = {
                'cond.ordtaskids': ordtaskids,
                'cond.clearanceids': clearanceids,
                'cond.option': value,
            };
            loading.value = true
            const res = await props.returnAuditApi(params);
            ElMessage({
                type: 'success',
                message: `退回成功`,
            })
            getData();
        })
        .catch(() => {
            loading.value = false
            ElMessage({
                type: 'info',
                message: '请输入退回意见',
            })
        })
    } catch (error) {
        loading.value = false
    }
}
// 批量修改报告备注
const update_audit_handler = async () => {
    const records = multipleTableRef.value?.getSelectionRows();
    console.log(records);
    if (!records || records.length === 0) {
        ElMessage.error('请选择数据！')
        return;
    }
    var resultsids ="";
    for(let i =0;i<records.length;i++){
        resultsids +=records[i].resultsid+",";
    }
    if (resultsids.length > 0) {
        resultsids = resultsids.substring(0,resultsids.length-1);
    }
    try {
    ElMessageBox.prompt('修改报告备注', {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
    })
        .then(async ({ value }) => {
            const params = {
                'cond.resultsids':resultsids,
                'cond.reportremark':value
            };
            loading.value = true
            const res = await props.updateReportremarkApi(params);
            ElMessage({
                type: 'success',
                message: `退回成功`,
            })
            getData();
        })
        .catch(() => {
            loading.value = false
            ElMessage({
                type: 'info',
                message: '请输入退回意见',
            })
        })
    } catch (error) {
        loading.value = false
    }
}
// 修改高限
const updateHigh_handler = async (type: string) => {
    const records = multipleTableRef.value?.getSelectionRows();
    console.log(records);
    if (!records || records.length === 0) {
        ElMessage.error('请选择数据！')
        return;
    }
    try {
        let title = '修改高限';
        if(type == 'low'){
            title = '修改低限';
        }
    ElMessageBox.prompt(title, {
        confirmButtonText: '确认',
        cancelButtonText: '关闭',
    })
        .then(async ({ value }) => {
            var data =[];
            for(var i = 0; i<records.length ;i++){
                records[i][type] = value;  
            };
            const extendBeans = JSON.stringify(records);
            var params = {
                jsonString : "{resultsInfos:"+extendBeans+"}",
                "cond.auflag": 'examine',
                'cond.uplimitvalue': type,
            };
            loading.value = true
            const res = await props.saveResultsExtendBeansApi(params);
            ElMessage({
                type: 'success',
                message: `修改成功`,
            })
            getData();
        })
        .catch(() => {
            loading.value = false
            ElMessage({
                type: 'info',
                message: '请输入退回意见',
            })
        })
    } catch (error) {
        loading.value = false
    }
}
//  操作相关

// 表格展示
const tableData = ref<any>();
const loading = ref(false);
const getData = async (searchParams: any = '') => {
    loading.value = true
    const params = {
        page: currentPage.value,
        start: pageSize.value * (currentPage.value - 1),
        limit: pageSize.value,
        'cond.auditingstatus': activeName.value,
        jsonString: JSON.stringify({ "cond": { ...searchParams } })
    }

    try {
        const res = await props.getDataApi(params);
        if (res) {
            tableData.value = res.extendBeans;
            total.value = res.extendBeans_num ? res.extendBeans_num : 0;
        }
        loading.value = false;
        emits('dataLoaded', tableData.value)
    } catch (error) {
        ElMessage.error('Oops, this is a error message.')
    }
};
const filterHandler = (value: any, row: any, column: any) => {
    const property = column['property']
    return row[property] === value
};
const buildFilter = (key: any) => {
    try {
        if (tableData.value) {
            let res = <any>[];
            tableData.value.map((data: any) => {
                if (data[key]) {
                    res.findIndex((item: any) => item.value == data[key]) < 0 && res.push({ text: data[key], value: data[key] })
                }
            })
            return res
        }

    } catch (error) {
        console.log(error);

    }

};
const searchTable = () => {
    const searchParams = props.columnList.filter((e: any) => {
        return ((e.keyword !== '' && e.keyword !== null && e.keyword !== undefined) || (e.keyword2 !== '' && e.keyword2 !== null && e.keyword2 !== undefined))
    });
    const params = <any>{};
    searchParams.map((kw: any) => {
        if (kw.type == 'date') {
            if (kw.keyword) {
                params[kw.prop + '_start'] = `${formatDateByYMD(kw.keyword, 'yyyy-MM-dd')}`;
            }
            if (kw.keyword2) {
                params[kw.prop + '_end'] = `${formatDateByYMD(kw.keyword2, 'yyyy-MM-dd')}`;
            }
        } else {
            params[kw.prop] = `%${kw.keyword}%`;
        }
    })
    getData(params)
}
const changeTime = (column: any) => {
    searchTable()
}

// 分页
const currentPage = ref(1);
const pageSize = ref(50);
const total = ref(0);
const handleSizeChange = (e: any) => {
};
const handleCurrentChange = (e: any) => {
}

// mounted
onMounted(async () => {
    // parent.mainIndex && parent.mainIndex.hidePageMask();
    getData()
})

// 因参数变动而无法自动刷新,需要使用监听函数进行监听路由
watch(() => router.currentRoute.value.path, (toPath) => {
    
}, { immediate: true, deep: true });

watch(() => currentPage.value, () => {
    getData();
}, { deep: true })
watch(() => pageSize.value, () => {
    getData();
}, { deep: true })
// 国际化
const locale = computed(() => (zhCn))

</script>

<style scoped>
.btn {
    /* width: 100px; */
    margin-bottom: 5px;
}

.el-table {
    font-size: 12px;
}

.container {
    /* width: 100vw; */
    height: 100%;
    /* padding-bottom: 40px; */
    display: flex;
    flex-direction: column;
    align-content: space-around;
    justify-content: center;
    border-radius: 10px;
}

.width100 {
    width: 100%
}

.el-table__header {
    font-size: 19px;
    font-weight: 700;
}
</style>