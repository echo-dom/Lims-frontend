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
                        <div class="header-wrapper">
                            <div class="header-top">
                                <span class="header-text" title="{{ cloumn.label }}">{{ cloumn.label }}</span>
                                <span class="caret-wrapper">
                                    <i class="ascending" :class="{ 'is-active': sortProp === cloumn.prop && sortOrder === 'ascending' }" @click="sortChange(cloumn.prop, 'ascending')"></i>
                                    <i class="descending" :class="{ 'is-active': sortProp === cloumn.prop && sortOrder === 'descending' }" @click="sortChange(cloumn.prop, 'descending')"></i>
                                </span>
                                <i class="el-table__column-filter-trigger" @click="toggleFilter(cloumn.prop)"></i>
                            </div>
                            <div class="header-bottom">
                                <el-input v-if="!cloumn.type" @keyup.enter="searchTable" v-model="cloumn.keyword" size="small" />
                                <div v-if="cloumn.type === 'date'">
                                    <div style="display: flex;">
                                        <el-date-picker v-model="cloumn.keyword" type="date" placeholder="开始时间" :size="'small'"
                                            style="margin-bottom: 2px;" @change="changeTime(cloumn)" />
                                        <el-date-picker v-model="cloumn.keyword2" type="date" placeholder="结束时间" :size="'small'"
                                            @change="changeTime(cloumn)" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-if="typeof cloumn.renderer === 'function'" #default="scope">
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

<script lang="ts" setup name="Customer">

import { ref, onMounted, watch, computed, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ElMessage, ElTable, ElMessageBox } from 'element-plus';
import type { TabsPaneContext } from 'element-plus'

const formatDateByYMD = (timestamp: any, fmt: string) => {
    var me = new Date(timestamp);
    var o: any = {
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
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
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

const activeName = ref('待审核')
const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
    console.log(activeName.value)
    getData()
}
// 当前行点击
const hangdleRowClick = (row: any, column: any) => {
    multipleTableRef.value?.clearSelection();
    multipleTableRef.value?.toggleRowSelection(row, true);
}

//  操作相关
const handleSelectionChange = (val: []) => {
    console.log(val);
    multipleSelection.value = val;
}

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
            console.log(res)
            tableData.value = res.rows;
            total.value = res.total ? res.total : 0;
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
                    res.findIndex((item: any) => item.value === data[key]) < 0 && res.push({ text: data[key], value: data[key] })
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
        if (kw.type === 'date') {
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

// 排序相关
const sortProp = ref('');
const sortOrder = ref('');
const sortChange = (prop: string, order: string) => {
    sortProp.value = prop;
    sortOrder.value = order;
    // 这里可以添加排序请求逻辑
}

// 过滤相关
const toggleFilter = (prop: string) => {
    // 这里可以添加过滤触发逻辑
}

</script>

<style scoped>
.btn {
    margin-bottom: 5px;
}

.el-table {
    font-size: 12px;
}

.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-content: space-around;
    justify-content: center;
    border-radius: 10px;
}

.el-table__header {
    font-size: 19px;
    font-weight: 700;
}

.header-wrapper {
    display: flex;
    flex-direction: column;
}

.header-top {
    display: flex;
    align-items: center;
    white-space: nowrap;
    margin-bottom: 5px;
}

.header-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    margin-right: 5px;
}

.caret-wrapper {
    display: inline-flex;
    flex-direction: column;
    margin-right: 5px;
}

.el-table__column-filter-trigger {
    display: inline-block;
}

.header-bottom {
    width: 100%;
}
</style>