<template>
  <el-container class="container">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-button-group>
          <el-button v-for="button in tabs[0]?.buttons || []" :key="button.label" 
            @click="button.handler" icon="el-icon-plus">
            {{ button.label }}
          </el-button>
        </el-button-group>
      </div>
      <div class="toolbar-right">
        <el-button-group>
          <el-button type="primary" @click="refreshTable" icon="el-icon-refresh">刷新</el-button>
          <el-dropdown>
            <el-button type="primary">
              自定义列 <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-card shadow="never" class="custom-columns-card">
                <div class="card-header">
                  <h3>自定义列</h3>
                  <el-button type="text" size="small" @click="selectAllColumns">全选</el-button>
                  <el-button type="text" size="small" @click="deselectAllColumns">取消全选</el-button>
                </div>
                <el-divider />
                <el-checkbox-group v-model="selectedColumns" class="column-checkbox-group">
                  <el-checkbox 
                    v-for="column in columnList" 
                    :key="column.prop" 
                    :label="column.prop"
                    :disabled="column.required"
                    class="column-checkbox"
                  >
                    {{ column.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-card>
            </template>
          </el-dropdown>
        </el-button-group>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-config-provider :locale="locale">
      <el-table 
        @selection-change="handleSelectionChange" 
        ref="multipleTableRef"
        v-loading="loading" 
        id="mtable"
        @row-click="hangdleRowClick"
        highlight-current-row
        stripe 
        :data="tableData" 
        border 
        fit
        style="width: 100%;"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column 
          v-for="cloumn in visibleColumns" 
          :key="cloumn.prop" 
          align="center" 
          show-overflow-tooltip
          :filters="buildFilter(cloumn.prop)" 
          :filter-method="filterHandler" 
          sortable 
          :prop="cloumn.prop"
          :label="cloumn.label" 
          :width="cloumn.width"
        >
          <template #header>
            <div class="header-wrapper">
              <div class="header-title">
                <span>{{ cloumn.label }}</span>
                <span class="sort-icon">
                  <i class="el-icon-caret-top" 
                    :class="{ 'is-active': sortProp === cloumn.prop && sortOrder === 'ascending' }" 
                    @click="sortChange(cloumn.prop, 'ascending')"
                  ></i>
                  <i class="el-icon-caret-bottom" 
                    :class="{ 'is-active': sortProp === cloumn.prop && sortOrder === 'descending' }" 
                    @click="sortChange(cloumn.prop, 'descending')"
                  ></i>
                </span>
                <i class="el-icon-filter" @click="toggleFilter(cloumn.prop)"></i>
              </div>
              <div class="header-filter">
                <el-input 
                  v-if="!cloumn.type" 
                  @keyup.enter="searchTable" 
                  v-model="cloumn.keyword" 
                  size="small"
                  placeholder="搜索..."
                />
                <div v-if="cloumn.type === 'date'" class="date-range">
                  <el-date-picker 
                    v-model="cloumn.keyword" 
                    type="date" 
                    placeholder="开始时间" 
                    size="small"
                    @change="changeTime(cloumn)" 
                  />
                  <el-date-picker 
                    v-model="cloumn.keyword2" 
                    type="date" 
                    placeholder="结束时间" 
                    size="small"
                    @change="changeTime(cloumn)" 
                  />
                </div>
              </div>
            </div>
          </template>
          <template v-if="typeof cloumn.renderer === 'function'" #default="scope">
            <div v-html="cloumn.renderer(scope)"></div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination 
        style="margin-top: 20px; display: flex; justify-content: flex-end;" 
        v-model:current-page="currentPage" 
        v-model:page-size="pageSize"
        :page-sizes="[50, 100, 200, 500, 1000, total]" 
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" 
        background 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
      />
    </el-config-provider>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ElMessage, ElTable } from 'element-plus';

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
};

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
    }
});

const emits = defineEmits(['dataLoaded']);

const router = useRouter();
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<[]>([]);

const tableData = ref<any>();
const loading = ref(false);
const getData = async (searchParams: any = '') => {
    loading.value = true;
    const params = {
        page: currentPage.value,
        start: pageSize.value * (currentPage.value - 1),
        limit: pageSize.value,
        jsonString: JSON.stringify({ "cond": { ...searchParams } })
    };

    try {
        const res = await props.getDataApi(params);
        if (res) {
            tableData.value = res.rows;
            total.value = res.total ? res.total : 0;
        }
        loading.value = false;
        emits('dataLoaded', tableData.value);
    } catch (error) {
        ElMessage.error('加载数据失败，请重试');
    }
};

const filterHandler = (value: any, row: any, column: any) => {
    const property = column['property'];
    return row[property] === value;
};

const buildFilter = (key: any) => {
    try {
        if (tableData.value) {
            let res = <any>[];
            tableData.value.map((data: any) => {
                if (data[key]) {
                    res.findIndex((item: any) => item.value === data[key]) < 0 && res.push({ text: data[key], value: data[key] });
                }
            });
            return res;
        }
    } catch (error) {
        console.log(error);
    }
};

const searchTable = () => {
    const searchParams = props.columnList.filter((e: any) => {
        return ((e.keyword !== '' && e.keyword !== null && e.keyword !== undefined) || (e.keyword2 !== '' && e.keyword2 !== null && e.keyword2 !== undefined));
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
    });
    getData(params);
};

const changeTime = (column: any) => {
    searchTable();
};

// 分页
const currentPage = ref(1);
const pageSize = ref(50);
const total = ref(0);
const handleSizeChange = (e: any) => {
    currentPage.value = 1; // 重置为第一页
    getData();
};
const handleCurrentChange = (e: any) => {
    getData();
};

// 当前行点击
const hangdleRowClick = (row: any, column: any) => {
    multipleTableRef.value?.clearSelection();
    multipleTableRef.value?.toggleRowSelection(row, true);
};

//  操作相关
const handleSelectionChange = (val: []) => {
    multipleSelection.value = val;
};

// mounted
onMounted(async () => {
    getData();
});

// 监听路由变化
watch(() => router.currentRoute.value.path, (toPath) => {
}, { immediate: true, deep: true });

watch(() => currentPage.value, () => {
    getData();
}, { deep: true });

watch(() => pageSize.value, () => {
    getData();
}, { deep: true });

// 国际化
const locale = computed(() => (zhCn));

// 自定义列相关
const selectedColumns = ref(props.columnList.map(column => column.prop));

const visibleColumns = computed(() => {
    return props.columnList.filter(column => selectedColumns.value.includes(column.prop));
});

const refreshTable = () => {
    getData();
};

const selectAllColumns = () => {
    selectedColumns.value = props.columnList
        .filter(column => !column.required)
        .map(column => column.prop);
};

const deselectAllColumns = () => {
    // 至少保留一个必要列
    const requiredColumns = props.columnList.filter(column => column.required).map(column => column.prop);
    if (requiredColumns.length > 0) {
        selectedColumns.value = requiredColumns;
    } else {
        selectedColumns.value = [];
    }
};

// 排序相关
const sortProp = ref('');
const sortOrder = ref('');
const sortChange = (prop: string, order: string) => {
    sortProp.value = prop;
    sortOrder.value = order;
    // 这里可以添加排序请求逻辑
};

// 过滤相关
const toggleFilter = (prop: string) => {
    // 这里可以添加过滤触发逻辑
};
</script>

<style scoped>
.container {
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.toolbar-left, .toolbar-right {
    display: flex;
    align-items: center;
}

.toolbar-right {
    gap: 10px;
}

.el-button-group {
    display: flex;
}

.el-button {
    transition: all 0.3s ease;
}

.el-button:hover {
    transform: translateY(-2px);
}

/* 自定义列下拉菜单样式 */
.custom-columns-card {
    width: 280px;
    max-height: 400px;
    overflow-y: auto;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
}

.column-checkbox-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 16px;
}

.column-checkbox {
    display: flex;
    align-items: center;
}

/* 表头样式优化 */
.header-wrapper {
    display: flex;
    flex-direction: column;
}

.header-title {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.header-title span {
    margin-right: 4px;
}

.sort-icon {
    display: flex;
    flex-direction: column;
    margin-right: 4px;
}

.sort-icon i {
    font-size: 10px;
    cursor: pointer;
    color: #909399;
}

.sort-icon i.is-active {
    color: #409eff;
}

.header-filter {
    display: flex;
    gap: 8px;
}

.date-range {
    display: flex;
    gap: 8px;
}

/* 表格样式优化 */
.el-table {
    font-size: 13px;
}

.el-table__header th {
    background-color: #f5f7fa;
    color: #303133;
    font-weight: 600;
}

.el-table__row:hover {
    background-color: #fafafa;
}

.el-pagination {
    margin-top: 16px;
}
</style>