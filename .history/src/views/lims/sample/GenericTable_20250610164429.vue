<template>
  <el-container class="container">
    <div class="table-header">
      <div class="table-title">
        <span class="title-text">{{ title }}</span>
        <el-tag type="info" size="small" class="record-count">共 {{ total }} 条记录</el-tag>
      </div>
      <div class="table-actions">
        <el-dropdown trigger="click" placement="bottom-end" @command="handleColumnCommand">
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
              <div class="column-checkbox-group">
                <div
                  v-for="col in localColumns"
                  :key="col.prop"
                  class="column-checkbox"
                >
                  <el-checkbox
                    :label="col.prop"
                    v-model="selectedColumns"
                  >
                    <span class="column-label">{{ col.label }}</span>
                  </el-checkbox>
                  <el-dropdown
                    trigger="click"
                    size="mini"
                    @command="(cmd) => handleFixCommand(col.prop, cmd)"
                  >
                    <el-button type="text" icon="el-icon-more" />
                    <el-dropdown-menu>
                      <el-dropdown-item command="fixLeft">固定左侧</el-dropdown-item>
                      <el-dropdown-item command="fixRight">固定右侧</el-dropdown-item>
                      <el-dropdown-item command="unfix">取消固定</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-tag v-if="col.type" size="small" effect="plain" class="type-tag">
                    {{ getColumnTypeName(col.type) }}
                  </el-tag>
                </div>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-tooltip content="刷新数据" placement="top">
          <el-button circle @click="onRefresh">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <el-config-provider :locale="locale">
      <div class="table-container">
        <el-table
          ref="tableRef"
          :data="tableData"
          v-loading.lock="loading"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
          highlight-current-row
          stripe
          border
          class="custom-table"
          :header-cell-style="headerCellStyle"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            v-for="col in visibleColumns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :width="col.width"
            :min-width="col.minWidth || 120"
            align="center"
            show-overflow-tooltip
            :fixed="col.fixed"       
            :filters="getFilters(col.prop)"
            :filter-method="filterHandler"
            sortable
          >
            <template #header>
              <div class="column-title">{{ col.label }}</div>
              <div class="filter-container">
                <el-input
                  v-if="!col.type"
                  v-model="col.keyword"
                  @keyup.enter.native="onSearchDebounced"
                  size="small"
                  placeholder="搜索"
                  clearable
                  class="filter-input"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
                <div v-if="col.type === 'date'" class="date-filter">
                  <el-date-picker
                    v-model="col.keyword"
                    type="date"
                    placeholder="开始日期"
                    size="small"
                    value-format="YYYY-MM-DD"
                    @change="onSearchDebounced"
                    class="date-picker"
                  />
                  <span class="date-separator">至</span>
                  <el-date-picker
                    v-model="col.keyword2"
                    type="date"
                    placeholder="结束日期"
                    size="small"
                    value-format="YYYY-MM-DD"
                    @change="onSearchDebounced"
                    class="date-picker"
                  />
                </div>
              </div>
            </template>
            <template v-if="typeof col.renderer === 'function'" #default="scope">
              <div v-html="col.renderer(scope)"></div>
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
          @size-change="onPageSizeChange"
          @current-change="onPageChange"
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
import { ElMessage, ElTable } from 'element-plus';
import { Operation, Refresh, Search } from '@element-plus/icons-vue';
import { formatDateByYMD, getColumnTypeName } from './utils';
import { debounce } from 'lodash-es';

const props = defineProps({
  columnList: { type: Array, default: () => [] },
  getDataApi: { type: Function, required: true },
  title: { type: String, default: '数据列表' }
});
const emits = defineEmits(['dataLoaded']);

const router = useRouter();
const tableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<any[]>([]);
const loading = ref(false);
const tableData = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

// 本地列，添加 keyword、keyword2 和 fixed 字段
const localColumns = ref(
  props.columnList.map(col => ({
    ...col,
    keyword: '',
    keyword2: '',
    fixed: col.fixed || undefined  // 支持固定列状态
  }))
);
watch(
  () => props.columnList,
  (newList) => {
    localColumns.value = newList.map(col => ({
      ...col,
      keyword: '',
      keyword2: '',
      fixed: col.fixed || undefined
    }));
    selectedColumns.value = localColumns.value.map(col => col.prop);
  },
  { deep: true }
);

// 列显示控制
const selectedColumns = ref(localColumns.value.map(col => col.prop));
const selectAllColumns = ref(true);
const isIndeterminate = computed(() => {
  return selectedColumns.value.length > 0 && selectedColumns.value.length < localColumns.value.length;
});
const handleSelectAll = (val: boolean) => {
  selectedColumns.value = val ? localColumns.value.map(col => col.prop) : [];
};

// 支持根据 selectedColumns 和固定列状态排列 visibleColumns
const visibleColumns = computed(() => {
  // 左固定列，显示且fixed=left
  const leftFixed = localColumns.value.filter(
    col => selectedColumns.value.includes(col.prop) && col.fixed === 'left'
  );
  // 中间非固定列，显示且fixed为空或undefined
  const centerCols = localColumns.value.filter(
    col => selectedColumns.value.includes(col.prop) && !col.fixed
  );
  // 右固定列，显示且fixed=right
  const rightFixed = localColumns.value.filter(
    col => selectedColumns.value.includes(col.prop) && col.fixed === 'right'
  );
  return [...leftFixed, ...centerCols, ...rightFixed];
});

// 过滤器缓存（按列prop存储）
const filters = ref<Record<string, Array<{ text: any; value: any }>>>({});

// 按需构造列过滤选项
const getFilters = (key: string) => {
  if (filters.value[key]) return filters.value[key];
  if (!tableData.value.length) return [];
  const uniqueValues = new Set<any>();
  const arr: Array<{ text: any; value: any }> = [];
  tableData.value.forEach(item => {
    const v = item[key];
    if (v != null && !uniqueValues.has(v)) {
      uniqueValues.add(v);
      arr.push({ text: v, value: v });
    }
  });
  filters.value[key] = arr;
  return arr;
};

const filterHandler = (value: any, row: any, column: any) => {
  const property = column.property;
  return row[property] === value;
};

// 搜索及数据请求
const getData = async (searchParams: Record<string, any> = {}) => {
  loading.value = true;
  const params = {
    page: currentPage.value,
    start: pageSize.value * (currentPage.value - 1),
    limit: pageSize.value,
    jsonString: JSON.stringify({ cond: { ...searchParams } })
  };
  try {
    const res = await props.getDataApi(params);
    if (res) {
      tableData.value = res.rows || [];
      total.value = res.total || 0;
      // 清空过滤缓存，防止数据变化过滤不准确
      filters.value = {};
      emits('dataLoaded', tableData.value);
    }
  } catch (error) {
    console.error('数据加载失败:', error);
    ElMessage.error('数据加载失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 构造搜索条件
const buildSearchParams = () => {
  const params: Record<string, any> = {};
  localColumns.value.forEach(col => {
    if (col.type === 'date') {
      if (col.keyword) params[`${col.prop}_start`] = formatDateByYMD(col.keyword, 'yyyy-MM-dd');
      if (col.keyword2) params[`${col.prop}_end`] = formatDateByYMD(col.keyword2, 'yyyy-MM-dd');
    } else if (col.keyword !== undefined && col.keyword !== '') {
      params[col.prop] = `%${col.keyword}%`;
    }
  });
  return params;
};

const onSearch = () => {
  currentPage.value = 1;
  const params = buildSearchParams();
  getData(params);
};
const onSearchDebounced = debounce(onSearch, 300);

// 分页
const onPageSizeChange = (newSize: number) => {
  pageSize.value = newSize;
  onSearch();
};
const onPageChange = (newPage: number) => {
  currentPage.value = newPage;
  onSearch();
};

// 刷新
const onRefresh = () => {
  localColumns.value.forEach(col => {
    col.keyword = '';
    col.keyword2 = '';
  });
  filters.value = {};
  currentPage.value = 1;
  getData();
};

// 选择行
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val;
};
const handleRowClick = (row: any) => {
  tableRef.value?.clearSelection();
  tableRef.value?.toggleRowSelection(row, true);
};

// 处理列操作指令（右侧固定菜单）
const handleFixCommand = (prop: string, cmd: string) => {
  const col = localColumns.value.find(c => c.prop === prop);
  if (!col) return;
  if (cmd === 'fixLeft') col.fixed = 'left';
  else if (cmd === 'fixRight') col.fixed = 'right';
  else if (cmd === 'unfix') col.fixed = undefined;
};
// 处理自定义列下拉菜单命令（后续可拓展）
const handleColumnCommand = (cmd: string) => {
  // 占位，当前无全局命令
};

// 监听路由变化刷新数据
watch(
  () => router.currentRoute.value.path,
  () => { onRefresh(); },
  { immediate: true }
);

onMounted(() => {
  getData();
});

const headerCellStyle = computed(() => ({
  fontSize: '14px',
  fontWeight: '600',
  color: '#303133',
  backgroundColor: '#f5f7fa',
  padding: '8px 0'
}));

const locale = computed(() => zhCn);

</script>
<style scoped>
/* 保持你的样式，只新增以下样式支持固定列操作按钮布局 */
.column-checkbox {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 5px;
  transition: background-color 0.2s;
  gap: 8px;
}
.column-checkbox:hover {
  background-color: #f5f7fa;
}
/* 样式保持不变 */
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

.column-title {
  font-weight: 600;
  color: #303133;
  padding: 2px;
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
:deep(.caret-wrapper){
    position: absolute;
    top: 25px;
    right: 40px;
}
:deep(.el-table__column-filter-trigger.el-none-outline.el-tooltip__trigger.el-tooltip__trigger){
    position: absolute;
    top: 25px;
    right: 20px;
}
</style>
