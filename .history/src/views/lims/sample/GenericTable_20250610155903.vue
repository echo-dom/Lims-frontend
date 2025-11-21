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
            @click="handleAction(action.command)"
          >
            <el-icon v-if="action.icon">
              <component :is="action.icon" />
            </el-icon>
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
                  v-for="column in internalColumnList" 
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
                    <el-option label="无" value="" />
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
          v-loading="loading" 
          element-loading-text="拼命加载中"
          @row-click="handleRowClick"
          highlight-current-row
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
            sortable 
            :prop="column.prop"
            :label="column.label" 
            :width="column.width"
            :min-width="column.minWidth || 120"
            :fixed="column.fixed"
          >
            <template #header="scope">
              <div class="header-content">
                <div class="header-title-row">
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
                </div>
                
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
                  <div v-if="column.type === 'date'" class="date-filter">
                    <el-date-picker
                      v-model="column.keyword"
                      type="date"
                      placeholder="开始日期"
                      size="small"
                      format="YYYY-MM-DD"
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
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      @change="changeTime(column)"
                      class="date-picker"
                    />
                  </div>
                </div>
              </div>
            </template>
            
            <template #default="scope">
              <!-- 日期类型格式化 -->
              <span v-if="column.type === 'date'">
                {{ formatDate(scope.row[column.prop]) }}
              </span>
              
              <!-- 状态类型 -->
              <el-tag v-else-if="column.type === 'status'" 
                      :type="getStatusTagType(scope.row[column.prop])">
                {{ getStatusLabel(scope.row[column.prop]) }}
              </el-tag>
              
              <!-- 默认渲染 -->
              <span v-else>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>
          
          <!-- 新增操作列 -->
          <el-table-column label="操作" align="center" width="180" fixed="right">
            <template #default="scope">
              <el-button 
                v-for="(action, idx) in rowActions"
                :key="idx"
                :type="action.type || 'primary'"
                size="small"
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
            :page-sizes="[10, 20, 50, 100]" 
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

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { 
  Operation, Refresh, Search,
  Plus, Download
} from '@element-plus/icons-vue';
import type { Component } from 'vue';

// 类型定义
interface TableColumn {
  prop: string;
  label: string;
  type?: string;
  width?: number | string;
  minWidth?: number | string;
  fixed?: string;
  keyword?: any;
  keyword2?: any;
}

interface ButtonAction {
  text: string;
  type?: string;
  icon?: Component;
  command: string;
}

interface RowAction {
  text: string;
  type?: string;
  command: string;
}

const router = useRouter();

// Props定义
const props = withDefaults(defineProps<{
  columnList: TableColumn[];
  getDataApi?: Function;
  title?: string;
  buttonActions?: ButtonAction[];
  rowActions?: RowAction[];
}>(), {
  title: '数据列表',
  buttonActions: () => [
    { text: '新增', type: 'primary', icon: Plus, command: 'add' },
    { text: '导出', type: 'success', icon: Download, command: 'export' }
  ],
  rowActions: () => [
    { text: '编辑', type: 'primary', command: 'edit' },
    { text: '删除', type: 'danger', command: 'delete' }
  ]
});

const emits = defineEmits(['action', 'row-action']);

// 创建内部列配置副本
const internalColumnList = ref<TableColumn[]>([]);

// 虚拟数据
const mockData = [
  { id: 1, name: '张三', age: 28, status: 1, role: '管理员', department: '研发部', createTime: '2023-01-15' },
  { id: 2, name: '李四', age: 32, status: 2, role: '用户', department: '市场部', createTime: '2023-02-20' },
  { id: 3, name: '王五', age: 25, status: 1, role: '编辑', department: '内容部', createTime: '2023-03-10' },
  { id: 4, name: '赵六', age: 40, status: 3, role: '管理员', department: '财务部', createTime: '2023-04-05' },
  { id: 5, name: '钱七', age: 35, status: 2, role: '用户', department: '客服部', createTime: '2023-05-12' },
  { id: 6, name: '孙八', age: 29, status: 1, role: '编辑', department: '内容部', createTime: '2023-06-18' },
  { id: 7, name: '周九', age: 45, status: 4, role: '管理员', department: '研发部', createTime: '2023-07-22' },
  { id: 8, name: '吴十', age: 31, status: 1, role: '用户', department: '市场部', createTime: '2023-08-30' },
  { id: 9, name: '郑十一', age: 26, status: 2, role: '编辑', department: '内容部', createTime: '2023-09-05' },
  { id: 10, name: '王十二', age: 38, status: 1, role: '管理员', department: '研发部', createTime: '2023-10-11' },
];

// 表格数据
const tableData = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);

// 初始化内部列配置
const initInternalColumns = () => {
  internalColumnList.value = props.columnList.map(column => ({
    ...column,
    fixed: column.fixed || '',
    keyword: '',
    keyword2: ''
  }));
};

// 获取数据（支持虚拟数据）
const getData = async () => {
  loading.value = true;
  
  try {
    // 使用虚拟数据
    if (!props.getDataApi) {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 应用搜索条件
      const filteredData = applySearchFilters(mockData);
      
      // 分页处理
      const startIndex = (currentPage.value - 1) * pageSize.value;
      tableData.value = filteredData.slice(startIndex, startIndex + pageSize.value);
      total.value = filteredData.length;
      
      loading.value = false;
      return;
    }
    
    // 调用真实API
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...getSearchParams()
    };
    
    const res = await props.getDataApi(params);
    if (res) {
      tableData.value = res.rows || [];
      total.value = res.total || 0;
    }
  } catch (error) {
    console.error('数据加载失败:', error);
    tableData.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

// 应用搜索条件到虚拟数据
const applySearchFilters = (data: any[]) => {
  return data.filter(item => {
    return internalColumnList.value.every(column => {
      const value = item[column.prop];
      const keyword = column.keyword?.toString().toLowerCase();
      
      if (!keyword) return true;
      
      if (column.type === 'date') {
        // 日期范围过滤
        const dateValue = new Date(value).getTime();
        const startDate = column.keyword ? new Date(column.keyword).getTime() : null;
        const endDate = column.keyword2 ? new Date(column.keyword2).getTime() : null;
        
        if (startDate && endDate) {
          return dateValue >= startDate && dateValue <= endDate;
        }
        if (startDate) {
          return dateValue >= startDate;
        }
        if (endDate) {
          return dateValue <= endDate;
        }
        return true;
      }
      
      // 文本模糊匹配
      return value?.toString().toLowerCase().includes(keyword);
    });
  });
};

// 获取搜索参数
const getSearchParams = () => {
  const params: any = {};
  
  internalColumnList.value.forEach(column => {
    if (column.type === 'date') {
      if (column.keyword) params[`${column.prop}Start`] = column.keyword;
      if (column.keyword2) params[`${column.prop}End`] = column.keyword2;
    } else if (column.keyword) {
      params[column.prop] = column.keyword;
    }
  });
  
  return params;
};

// 分页控制
const currentPage = ref(1);
const pageSize = ref(10);
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize;
  getData();
};
const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
  getData();
};

// 刷新表格
const refreshTable = () => {
  internalColumnList.value.forEach(column => {
    column.keyword = '';
    column.keyword2 = '';
  });
  currentPage.value = 1;
  getData();
};

// 行点击处理
const handleRowClick = (row: any) => {
  console.log('行点击:', row);
};

// 选中行处理
const handleSelectionChange = (val: any[]) => {
  console.log('选中行:', val);
};

// 日期格式化
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 状态标签类型
const getStatusTagType = (status: number) => {
  switch (status) {
    case 1: return 'success';
    case 2: return 'primary';
    case 3: return 'warning';
    case 4: return 'danger';
    default: return 'info';
  }
};

// 状态标签文本
const getStatusLabel = (status: number) => {
  switch (status) {
    case 1: return '启用';
    case 2: return '禁用';
    case 3: return '待审核';
    case 4: return '已注销';
    default: return '未知';
  }
};

// 列选择功能
const selectedColumns = ref<string[]>([]);
const selectAllColumns = ref(true);
const isIndeterminate = computed(() => {
  return selectedColumns.value.length > 0 && 
         selectedColumns.value.length < internalColumnList.value.length;
});

// 处理全选/取消全选
const handleSelectAll = (val: boolean) => {
  selectedColumns.value = val ? internalColumnList.value.map(col => col.prop) : [];
};

// 获取可见列
const visibleColumns = computed(() => {
  return internalColumnList.value.filter(col => selectedColumns.value.includes(col.prop));
});

// 固定选择列
const selectionFixed = computed(() => {
  // 如果有任何列固定在左侧，则选择列也固定在左侧
  if (internalColumnList.value.some(col => col.fixed === 'left')) {
    return 'left';
  }
  return undefined;
});

// 获取列类型名称
const getColumnTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    'text': '文本',
    'number': '数字',
    'date': '日期',
    'status': '状态',
    'role': '角色'
  };
  return typeMap[type] || type;
};

// 处理按钮动作
const handleAction = (command: string) => {
  emits('action', command);
  console.log('按钮动作:', command);
  
  // 虚拟动作处理
  if (command === 'add') {
    // 这里可以添加新增数据的逻辑
    ElMessage.success('执行新增操作');
  } else if (command === 'export') {
    // 这里可以添加导出逻辑
    ElMessage.warning('执行导出操作');
  }
};

// 处理行动作
const handleRowAction = (command: string, row: any) => {
  emits('row-action', command, row);
  console.log('行动作:', command, row);
  
  // 虚拟动作处理
  if (command === 'edit') {
    // 编辑操作
    ElMessage.info(`编辑行: ${row.id || row.name || '未命名记录'}`);
  } else if (command === 'delete') {
    // 删除操作
    ElMessage.error(`删除行: ${row.id || row.name || '未命名记录'}`);
  }
};

// 时间搜索改变
const changeTime = (column: TableColumn) => {
  currentPage.value = 1;
  getData();
};

// 初始化
onMounted(() => {
  // 初始化内部列配置
  initInternalColumns();
  
  // 初始化选中的列
  selectedColumns.value = props.columnList.map(col => col.prop);
  
  // 获取数据
  getData();
});

// 监听路由变化（可选）
watch(() => router.currentRoute.value.path, () => {
  getData();
}, { immediate: true });

// 国际化
const locale = ref(zhCn);
</script>

<style scoped>
.container {
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
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
  align-items: center;
}

.action-group {
  margin-right: 10px;
}

.action-group button {
  display: flex;
  align-items: center;
  gap: 4px;
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
  border-radius: 4px;
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

.header-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.column-title {
  font-weight: 600;
  color: #303133;
}

.filter-container {
  display: flex;
  justify-content: center;
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
  width: 110px;
}

.date-separator {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  padding: 0 4px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.custom-pagination {
  padding: 8px 0;
  background: #fff;
  border-radius: 4px;
}

/* 列选择器样式 */
.column-selector {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 0;
  width: 300px;
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

/* 操作按钮样式 */
.el-button--small.link {
  padding: 5px 0;
  margin: 0 5px;
}
</style>