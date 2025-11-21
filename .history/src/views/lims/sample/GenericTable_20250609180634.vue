<template>
  <el-container class="container">
    <div class="table-header">
      <div class="table-title">
        <span class="title-text">数据表格</span>
        <el-tag type="info" size="small" class="record-count">共 {{ total }} 条记录</el-tag>
      </div>
      
      <div class="table-actions">
        <el-dropdown trigger="click" placement="bottom-end">
          <el-button type="primary" plain>
            <el-icon><Operation /></el-icon> 自定义列
          </el-button>
          <template #dropdown>
            <el-dropdown-menu class="column-selector">
              <div class="dropdown-header">
                <el-checkbox 
                  v-model="selectAllColumns" 
                  :indeterminate="isIndeterminate"
                  @change="handleSelectAll"
                >
                  列显示配置
                </el-checkbox>
              </div>
              <el-divider style="margin: 5px 0" />
              <el-checkbox-group v-model="selectedColumns" class="column-checkbox-group">
                <el-checkbox 
                  v-for="column in columnList" 
                  :key="column.prop" 
                  :label="column.prop"
                  class="column-checkbox"
                >
                  <span class="column-label">{{ column.label }}</span>
                  <el-tag v-if="column.type" size="small" effect="plain" class="type-tag">
                    {{ getColumnTypeName(column.type) }}
                  </el-tag>
                </el-checkbox>
              </el-checkbox-group>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <el-tooltip content="刷新数据" placement="top">
          <el-button circle @click="refreshTable">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <el-config-provider :locale="locale">
      <div class="table-container">
        <el-table 
          @selection-change="handleSelectionChange" 
          ref="multipleTableRef"
          v-loading.lock="loading" 
          id="mtable"
          @row-click="handleRowClick"
          highlight-current-row
          :header-cell-style="headerCellStyle"
          stripe 
          :data="tableData" 
          border
          class="custom-table"
        >
          <el-table-column type="selection" width="55" align="center" />
          
          <!-- 动态渲染列 -->
          <el-table-column 
            v-for="column in visibleColumns" 
            :key="column.prop" 
            align="center" 
            show-overflow-tooltip
            :filters="buildFilter(column.prop)" 
            :filter-method="filterHandler" 
            sortable 
            :prop="column.prop"
            :label="column.label" 
            :width="column.width"
            :min-width="column.minWidth || 120"
          >
            <template #header>
              <div class="header-content">
                <span class="column-title">{{ column.label }}</span>
                
                <div class="filter-container">
                  <!-- 文本搜索 -->
                  <el-input 
                    v-if="!column.type" 
                    v-model="column.keyword"
                    @keyup.enter="searchTable"
                    size="small"
                    placeholder="搜索"
                    clearable
                    class="filter-input"
                  >
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                  
                  <!-- 日期范围搜索 -->
                  <div v-if="column.type == 'date'" class="date-filter">
                    <el-date-picker
                      v-model="column.keyword"
                      type="date"
                      placeholder="开始日期"
                      size="small"
                      value-format="YYYY-MM-DD"
                      @change="changeTime(column)"
                      class="date-picker"
                    />
                    <span class="date-separator">至</span>
                    <el-date-picker
                      v-model="column.keyword2"
                      type="date"
                      placeholder="结束日期"
                      size="small"
                      value-format="YYYY-MM-DD"
                      @change="changeTime(column)"
                      class="date-picker"
                    />
                  </div>
                </div>
              </div>
            </template>
            
            <template v-if="typeof column.renderer == 'function'" #default="scope">
              <div v-html="column.renderer(scope)"></div>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination 
          v-model:current-page="currentPage" 
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100, 200]" 
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" 
          @size-change="handleSizeChange" 
          @current-change="handleCurrentChange"
          class="custom-pagination"
        />
      </div>
    </el-config-provider>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { 
  ElMessage, ElTable, 
  ElIcon, ElTag, ElDivider,
  ElTooltip
} from 'element-plus';
import { 
  Operation, Refresh, Search, 
  ArrowDown, Menu, CircleCloseFilled
} from '@element-plus/icons-vue';

// 日期格式化函数
const formatDateByYMD = (timestamp: any, fmt: string) => {
  const date = new Date(timestamp);
  const o: Record<string, any> = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S": date.getMilliseconds()
  };
  
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, date.getFullYear().toString().substr(4 - RegExp.$1.length));
  }
  
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, 
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(o[k].toString().length));
    }
  }
  return fmt;
}

const props = defineProps({
  columnList: {
    type: Array,
    default: () => []
  },
  getDataApi: {
    type: Function,
    required: true
  },
  title: {
    type: String,
    default: '数据列表'
  }
})

const emits = defineEmits(['dataLoaded'])

const router = useRouter()
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<[]>([])

const tableData = ref<any>([]);
const loading = ref(false);
const getData = async (searchParams: any = {}) => {
  loading.value = true;
  const params = {
    page: currentPage.value,
    start: pageSize.value * (currentPage.value - 1),
    limit: pageSize.value,
    jsonString: JSON.stringify({ "cond": { ...searchParams } })
  }

  try {
    const res = await props.getDataApi(params);
    if (res) {
      tableData.value = res.rows || [];
      total.value = res.total || 0;
    }
    emits('dataLoaded', tableData.value);
  } catch (error) {
    ElMessage.error('数据加载失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const filterHandler = (value: any, row: any, column: any) => {
  const property = column['property'];
  return row[property] === value;
};

const buildFilter = (key: any) => {
  if (!tableData.value || tableData.value.length === 0) return [];
  
  const uniqueValues = new Set();
  const filters = [];
  
  for (const data of tableData.value) {
    if (data[key] && !uniqueValues.has(data[key])) {
      uniqueValues.add(data[key]);
      filters.push({ text: data[key], value: data[key] });
    }
  }
  
  return filters;
};

const searchTable = () => {
  const searchParams: Record<string, any> = {};
  
  props.columnList.forEach((col: any) => {
    if (col.type === 'date') {
      if (col.keyword) {
        searchParams[`${col.prop}_start`] = formatDateByYMD(col.keyword, 'yyyy-MM-dd');
      }
      if (col.keyword2) {
        searchParams[`${col.prop}_end`] = formatDateByYMD(col.keyword2, 'yyyy-MM-dd');
      }
    } else if (col.keyword || col.keyword === 0) {
      searchParams[col.prop] = `%${col.keyword}%`;
    }
  });
  
  currentPage.value = 1; // 重置到第一页
  getData(searchParams);
}

const changeTime = (column: any) => {
  searchTable();
}

// 分页
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize;
  getData();
};
const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
  getData();
};

// 当前行点击
const handleRowClick = (row: any) => {
  multipleTableRef.value?.clearSelection();
  multipleTableRef.value?.toggleRowSelection(row, true);
}

// 操作相关
const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
}

// mounted
onMounted(async () => {
  getData();
});

// 监听路由变化
watch(() => router.currentRoute.value.path, () => {
  getData();
}, { immediate: true });

// 列选择功能
const selectedColumns = ref(props.columnList.map((col: any) => col.prop));
const visibleColumns = computed(() => {
  return props.columnList.filter((col: any) => selectedColumns.value.includes(col.prop));
});

// 刷新表格
const refreshTable = () => {
  // 重置搜索条件
  props.columnList.forEach((col: any) => {
    col.keyword = '';
    col.keyword2 = '';
  });
  getData();
};

// 全选/取消全选列
const selectAllColumns = ref(true);
const isIndeterminate = computed(() => {
  return selectedColumns.value.length > 0 && 
         selectedColumns.value.length < props.columnList.length;
});

const handleSelectAll = (val: boolean) => {
  selectedColumns.value = val ? props.columnList.map((col: any) => col.prop) : [];
};

// 获取列类型名称
const getColumnTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    'text': '文本',
    'number': '数字',
    'date': '日期',
    'boolean': '布尔值',
    'custom': '自定义'
  };
  return typeMap[type] || type;
};

// 表头样式
const headerCellStyle = computed(() => ({
  fontSize: '14px',
  fontWeight: '600',
  color: '#303133',
  backgroundColor: '#f5f7fa',
  padding: '8px 0'
}));

// 国际化
const locale = computed(() => zhCn);
</script>

<style scoped>
.container {
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.record-count {
  font-size: 12px;
  height: 24px;
  line-height: 22px;
}

.table-actions {
  display: flex;
  gap: 10px;
}

.table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.custom-table {
  flex: 1;
  font-size: 13px;
  border-radius: 6px;
  overflow: hidden;
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
}

.custom-table :deep(.el-table__header) {
  font-size: 14px;
  font-weight: 600;
}

.custom-table :deep(.el-table__body) {
  font-size: 13px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.column-title {
  font-weight: 600;
  color: #303133;
}

.filter-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-input {
  width: 100%;
}

.filter-input :deep(.el-input__inner) {
  height: 28px;
  line-height: 28px;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 4px;
}

.date-picker {
  flex: 1;
}

.date-picker :deep(.el-input__inner) {
  height: 28px;
  line-height: 28px;
}

.date-separator {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

.custom-pagination {
  margin-top: 16px;
  padding: 8px 0;
  background: #fff;
  border-radius: 4px;
}

:deep(.el-pagination__total) {
  margin-right: 12px;
}

:deep(.el-pagination__jump) {
  margin-left: 12px;
}

/* 列选择器样式 */
.column-selector {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 0;
}

.dropdown-header {
  padding: 5px 15px;
  font-weight: 600;
  color: #303133;
}

.column-checkbox-group {
  display: flex;
  flex-direction: column;
  padding: 0 15px;
}

.column-checkbox {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 5px;
  transition: background-color 0.2s;
}

.column-checkbox:hover {
  background-color: #f5f7fa;
}

.column-label {
  margin-right: 8px;
}

.type-tag {
  font-size: 10px;
  padding: 0 5px;
  height: 18px;
  line-height: 17px;
}
</style>