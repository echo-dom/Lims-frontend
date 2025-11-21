<template>
  <el-container class="container">
    <div class="table-header">
      <div class="table-title">
        <span class="title-text">{{ title }}</span>
        <el-tag type="info" size="small" class="record-count">共 {{ total }} 条记录</el-tag>
      </div>
      
      <div class="table-actions">
        <!-- 新增按钮模块 -->
        <el-button-group class="action-group">
          <el-button 
            v-for="(action, idx) in buttonActions"
            :key="idx"
            :type="action.type || 'primary'"
            :icon="action.icon ? createElementVNode(action.icon) : ''"
            @click="handleAction(action)"
          >
            {{ action.text }}
          </el-button>
        </el-button-group>
        
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
                  <!-- 固定列选择器 -->
                  <el-select 
                    v-model="column.fixed" 
                    size="mini" 
                    style="width: 80px; margin-left: 8px"
                    @click.stop
                    placeholder="固定"
                  >
                    <el-option label="无" :value="null" />
                    <el-option label="左固定" value="left" />
                    <el-option label="右固定" value="right" />
                  </el-select>
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
          <el-table-column type="selection" width="55" align="center" :fixed="selectionFixed" />
          
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
            :fixed="column.fixed"
          >
            <template #header>
              <div class="header-content">
                <span class="column-title">{{ column.label }}</span>
                <!-- 固定标记 -->
                <el-tag 
                  v-if="column.fixed" 
                  size="mini" 
                  :type="column.fixed === 'left' ? 'success' : 'warning'" 
                  style="margin-left: 5px"
                >
                  {{ column.fixed === 'left' ? '左固定' : '右固定' }}
                </el-tag>
                
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
          
          <!-- 新增操作列 -->
          <el-table-column v-if="hasActionColumn" label="操作" align="center" width="180" fixed="right">
            <template #default="scope">
              <el-button 
                v-for="(action, idx) in rowActions"
                :key="idx"
                :type="action.type || 'primary'"
                :size="action.size || 'small'"
                link
                @click="handleRowAction(action.command, scope.row)"
              >
                {{ action.text }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
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
      </div>
    </el-config-provider>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed, h, createElementVNode, nextTick } from 'vue';
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

// 类型定义
interface TableColumn {
  prop: string;
  label: string;
  width?: number | string;
  minWidth?: number | string;
  type?: string;
  fixed?: string | null;
  keyword?: any;
  keyword2?: any;
  renderer?: Function;
}

interface ButtonAction {
  text: string;
  type?: string;
  icon?: any;
  command: string;
}

interface RowAction {
  text: string;
  type?: string;
  size?: string;
  command: string;
}

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
    type: Array<TableColumn>,
    default: () => []
  },
  getDataApi: {
    type: Function,
    required: true
  },
  title: {
    type: String,
    default: '数据列表'
  },
  // 新增按钮模块配置
  buttonActions: {
    type: Array<ButtonAction>,
    default: () => [
      // 默认按钮配置（虚拟数据）
      { text: '新增', type: 'primary', icon: h('el-icon', {}, [h(CircleCloseFilled)]), command: 'add' },
      { text: '导出', type: 'success', icon: h('el-icon', {}, [h(Menu)]), command: 'export' }
    ]
  },
  // 行操作按钮配置
  rowActions: {
    type: Array<RowAction>,
    default: () => [
      { text: '编辑', type: 'primary', command: 'edit' },
      { text: '删除', type: 'danger', command: 'delete' }
    ]
  },
  // 初始固定列配置
  initialFixedColumns: {
    type: Array<string>,
    default: () => []
  }
})

const emits = defineEmits(['dataLoaded', 'action', 'row-action'])

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

// 初始固定列设置
const setInitialFixedColumns = () => {
  props.columnList.forEach(col => {
    if (props.initialFixedColumns.includes(col.prop)) {
      col.fixed = 'left';
    }
  });
}

// 固定选择列
const selectionFixed = computed(() => {
  // 如果有任何列固定在左侧，则选择列也固定在左侧
  if (props.columnList.some(col => col.fixed === 'left')) {
    return 'left';
  }
  return undefined;
})

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
  setInitialFixedColumns();
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

// -------------------------- 新增功能 --------------------------
// 按钮模块处理
const handleAction = (action: ButtonAction) => {
  emits('action', action.command);
  
  // 示例操作 - 实际项目中可移除
  if (action.command === 'add') {
    ElMessage.success('执行新增操作');
  } else if (action.command === 'export') {
    ElMessage.warning('执行导出操作');
  }
};

// 行操作处理
const handleRowAction = (command: string, row: any) => {
  emits('row-action', command, row);
  
  // 示例操作 - 实际项目中可移除
  if (command === 'edit') {
    ElMessage.info(`编辑行: ${row.id || row.name || '未命名记录'}`);
  } else if (command === 'delete') {
    ElMessage.error(`删除行: ${row.id || row.name || '未命名记录'}`);
  }
};

// 检查是否有操作列
const hasActionColumn = computed(() => {
  return props.rowActions && props.rowActions.length > 0;
});
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

.action-group {
  margin-right: 10px;
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
  display: flex;
  align-items: center;
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

.pagination-container {
  display: flex;
  justify-content: flex-end; /* 分页固定到右边 */
  margin-top: 16px;
}

.custom-pagination {
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
  min-width: 80px;
}

.type-tag {
  font-size: 10px;
  padding: 0 5px;
  height: 18px;
  line-height: 17px;
}
</style>