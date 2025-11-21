<template>
  <el-container class="a-container">
    <!-- 顶部操作区：按钮、搜索、列配置等 -->
    <div class="table-header">
      <!-- 按钮区域，可保留原逻辑 -->
      <div class="table-title">
        <el-row :gutter="10" class="mb8">
          <el-col v-for="button in buttonlist" :key="button.label" :span="1.5">
            <el-button
              :disabled="handleButtonDisabled(button.disabled as string|boolean)"
              :size="button.size"
              :loading="button.loading"
              :type="button.type"
              :plain="button.plain || true"
              :icon="button.icon"
              @click="button.onClick"
              v-hasPermi="[button.hasPermi]"
            >
              {{ button.label }}
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table-actions">
        <!-- 列显示配置 -->
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
                  v-for="col in localColumns"
                  :key="col.prop"
                  :label="col.prop"
                  class="column-checkbox"
                  :value="col.prop"
                >
                  <span class="column-label">{{ col.label }}</span>
                  <el-tag v-if="col.type" size="small" effect="plain" class="type-tag">
                    {{ getColumnTypeName(col.type) }}
                  </el-tag>
                </el-checkbox>
              </el-checkbox-group>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- 刷新 -->
        <el-tooltip content="刷新数据" placement="top">
          <el-button circle @click="onRefresh">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 搜索条件区：对于 Virtualized Table，建议单独抽成一行或多行搜索控件，而非嵌入表头 -->
    <div class="search-bar">
      <el-row :gutter="10" class="mb8">
        <el-col
          v-for="col in searchableColumns"
          :key="col.prop"
          :span="6"
        >
          <template v-if="col.type === 'date'">
            <el-date-picker
              v-model="col.keyword"
              type="date"
              placeholder="开始日期"
              size="small"
              value-format="YYYY-MM-DD"
              @change="onSearchDebounced"
              style="width: 100%;"
            />
            <span class="date-separator">至</span>
            <el-date-picker
              v-model="col.keyword2"
              type="date"
              placeholder="结束日期"
              size="small"
              value-format="YYYY-MM-DD"
              @change="onSearchDebounced"
              style="width: 100%;"
            />
          </template>
          <template v-else>
            <el-input
              v-model="col.keyword"
              @keyup.enter.native="onSearchDebounced"
              size="small"
              placeholder="搜索 {{ col.label }}"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </template>
        </el-col>
        <!-- 可再加一个搜索按钮 -->
        <el-col :span="2">
          <el-button type="primary" size="small" @click="onSearch">搜索</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 虚拟表格主体 -->
    <el-config-provider :locale="locale">
      <!-- 使用 AutoResizer 自动获取容器高度 -->
      <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2
              :columns="v2Columns"
              :data="filteredData"
              :width="width"
              :height="height - headerHeight"  <!-- 可减去搜索区和页脚高度 -->
              fixed
            ></el-table-v2>
          </template>
        </el-auto-resizer>
      </div>
    </el-config-provider>

    <!-- 若仍需分页，可放在下方，或者结合“滚动加载更多”逻辑 -->
    <div class="pagination-container" v-if="usePagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        class="custom-pagination"
      />
    </div>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ElMessage } from 'element-plus';
import { Operation, Refresh, Search } from '@element-plus/icons-vue';
import { formatDateByYMD, getColumnTypeName } from '@/utils/utils';
import { debounce } from 'lodash-es';
import type { Column } from 'element-plus';
import { TableV2FixedDir } from 'element-plus';

interface ColumnItem {
  prop: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  fixed?: boolean | 'left' | 'right';
  type?: string;             // 用于搜索栏识别 date 等
  keyword?: any;             // 搜索关键字缓存
  keyword2?: any;            // 日期结束关键字缓存
  editable?: boolean;        // 是否可编辑
  editType?: string;         // 'text' | 'number' | 'date' | 'select' | ...
  options?: Array<{ label: string; value: any }>; // select 编辑时的选项
  // 其他自定义字段...
}
interface ButtonItem {
  label: string;
  icon?: string;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'large' | 'default' | 'small';
  plain?: boolean;
  round?: boolean;
  circle?: boolean;
  disabled?: string | boolean;
  loading?: boolean;
  tooltip?: string;
  visible?: boolean;
  confirm?: string;
  onClick?: () => void;
  hasPermi: string;
}

const props = defineProps<{
  columnList: ColumnItem[];
  getDataApi: (params: Record<string, any>) => Promise<{ rows: any[]; total: number }>;
  updateDataApi?: (payload: Record<string, any>) => Promise<any>;
  title?: string;
  buttonlist: ButtonItem[];
}>();
const emits = defineEmits<{
  (e: 'dataLoaded', data: any[]): void;
  (e: 'handleSelectionChange', data: any[]): void;
}>();

const router = useRouter();

// 本地列配置拷贝
const localColumns = ref<ColumnItem[]>(props.columnList.map(col => ({ ...col, keyword: '', keyword2: '' })));
watch(
  () => props.columnList,
  (newList) => {
    localColumns.value = newList.map(col => ({ ...col, keyword: '', keyword2: '' }));
    selectedColumns.value = localColumns.value.map(col => col.prop);
  },
  { deep: true }
);

// 列显示控制
const selectedColumns = ref<string[]>(localColumns.value.map(col => col.prop));
const selectAllColumns = ref(true);
const isIndeterminate = computed(() => {
  return selectedColumns.value.length > 0 && selectedColumns.value.length < localColumns.value.length;
});
const handleSelectAll = (val: boolean) => {
  selectedColumns.value = val ? localColumns.value.map(col => col.prop) : [];
};

// 可搜索的列列表：若某些列不希望搜索，可过滤 localColumns
const searchableColumns = computed(() => {
  // 例如只对有 keyword 意义的列显示搜索
  return localColumns.value.filter(col => /* 根据需求决定是否显示搜索，如所有列均可 */ true);
});

// 搜索/筛选逻辑：外层过滤，生成 filteredData
const allData = ref<any[]>([]); // 存储从后端获取的当前所有数据（或分页数据）
const filteredData = computed(() => {
  // 根据 localColumns 中 keyword/keyword2，过滤 allData.value
  let data = allData.value;
  localColumns.value.forEach(col => {
    if (col.type === 'date') {
      if (col.keyword) {
        data = data.filter(item => {
          const v = item[col.prop];
          if (!v) return false;
          return formatDateByYMD(v, 'yyyy-MM-dd') >= formatDateByYMD(col.keyword, 'yyyy-MM-dd');
        });
      }
      if (col.keyword2) {
        data = data.filter(item => {
          const v = item[col.prop];
          if (!v) return false;
          return formatDateByYMD(v, 'yyyy-MM-dd') <= formatDateByYMD(col.keyword2, 'yyyy-MM-dd');
        });
      }
    } else if (col.keyword !== undefined && col.keyword !== '') {
      data = data.filter(item => {
        const cell = item[col.prop];
        return cell != null && String(cell).includes(String(col.keyword));
      });
    }
  });
  return data;
});

// Virtualized Table 的 columns 定义，动态根据 selectedColumns 生成
const v2Columns = computed<Column<any>[]>(() => {
  return localColumns.value
    .filter(col => selectedColumns.value.includes(col.prop))
    .map(col => {
      const base: Column<any> = {
        key: col.prop,
        dataKey: col.prop,
        title: col.label,
        width: col.width ? Number(col.width) : undefined,
        minWidth: col.minWidth ? Number(col.minWidth) : undefined,
      };
      // 处理固定
      if (col.fixed) {
        if (col.fixed === true || col.fixed === 'left') {
          base.fixed = TableV2FixedDir.LEFT;
        } else if (col.fixed === 'right') {
          base.fixed = TableV2FixedDir.RIGHT;
        }
      }
      // 生成 cellRenderer：考虑只读/可编辑
      base.cellRenderer = ({ rowData }) => {
        const cellValue = rowData[col.prop];
        // 如果不可编辑，则展示
        if (!col.editable) {
          // 根据类型渲染，如 date 格式化
          if (col.type === 'date') {
            return formatDateByYMD(cellValue, 'yyyy-MM-dd');
          }
          return cellValue != null ? String(cellValue) : '';
        }
        // 若可编辑：判断是否正在编辑该行该列？
        // 由于 Virtualized Table 渲染方式非 template slot，需要在渲染函数中插入输入组件，并在 blur/enter/change 时触发保存
        // 这里示例用一个简单逻辑：点击时切换到编辑模式，可通过 reactive 编辑状态管理
        // NOTE: 需在外层维护 editStatus，例如 { [rowKey]: { [prop]: boolean }}，以及 editCache
        const rowKey = getRowKey(rowData);
        const isEditing = editStatus[rowKey]?.[col.prop] === true;
        if (!isEditing) {
          // 展示模式，可点击进入编辑
          return (
            <div
              class="editable-cell-wrapper"
              style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; cursor:pointer;"
              onClick={() => startEditVirtual(rowData, col)}
            >
              {cellValue != null && cellValue !== '' ? (
                col.type === 'date'
                  ? formatDateByYMD(cellValue, 'yyyy-MM-dd')
                  : String(cellValue)
              ) : (
                // 空占位
                <span style="visibility: hidden;">&nbsp;</span>
              )}
            </div>
          );
        } else {
          // 编辑模式：根据 editType 渲染不同组件
          const cacheVal = editCache[rowKey]?.[col.prop];
          const commonProps = {
            modelValue: cacheVal,
            'onUpdate:modelValue': (v: any) => {
              // Vue JSX 语法：更新 editCache
              editCache[rowKey][col.prop] = v;
            },
            size: 'small',
            style: { width: '100%' },
            onBlur: () => saveEditVirtual(rowData, col),
            onKeyup: (e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                saveEditVirtual(rowData, col);
              }
            },
          };
          if (!col.editType || col.editType === 'text') {
            return <el-input {...commonProps} data-row-key={rowKey} data-prop={col.prop} />;
          } else if (col.editType === 'number') {
            return <el-input-number {...commonProps} onChange={() => saveEditVirtual(rowData, col)} />;
          } else if (col.editType === 'date') {
            return (
              <el-date-picker
                v-model={editCache[rowKey][col.prop]}
                type="date"
                size="small"
                value-format="YYYY-MM-DD"
                onChange={() => saveEditVirtual(rowData, col)}
                onBlur={() => saveEditVirtual(rowData, col)}
                style="width: 100%;"
              />
            );
          } else if (col.editType === 'select' && col.options) {
            return (
              <el-select
                v-model={editCache[rowKey][col.prop]}
                size="small"
                onChange={() => saveEditVirtual(rowData, col)}
                style="width: 100%;"
              >
                {col.options.map(opt => (
                  <el-option key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </el-select>
            );
          }
          // fallback
          return <el-input {...commonProps} />;
        }
      };
      return base;
    });
});

// 维护虚拟表格编辑状态
const editStatus = reactive<Record<string, Record<string, boolean>>>({});
const editCache = reactive<Record<string, Record<string, any>>>({});

function getRowKey(row: any): string | number {
  return row.id ?? row._rowId;
}
function startEditVirtual(row: any, col: ColumnItem) {
  const rowKey = getRowKey(row);
  if (!editCache[rowKey]) {
    editCache[rowKey] = {};
  }
  // 取消之前的编辑状态（可根据需求：是否只允许一个单元格编辑）
  Object.keys(editStatus).forEach(rk => {
    Object.keys(editStatus[rk]).forEach(p => {
      editStatus[rk][p] = false;
    });
  });
  // 缓存当前值
  editCache[rowKey][col.prop] = row[col.prop];
  if (!editStatus[rowKey]) editStatus[rowKey] = {};
  editStatus[rowKey][col.prop] = true;
}
async function saveEditVirtual(row: any, col: ColumnItem) {
  const rowKey = getRowKey(row);
  if (!editStatus[rowKey]?.[col.prop]) return;
  const newVal = editCache[rowKey][col.prop];
  if (newVal === row[col.prop]) {
    editStatus[rowKey][col.prop] = false;
    return;
  }
  // 写回 row
  row[col.prop] = newVal;
  if (props.updateDataApi) {
    try {
      await props.updateDataApi(row);
      ElMessage.success('保存成功');
    } catch (err) {
      console.error('保存失败', err);
      ElMessage.error('保存失败');
      // 若需要回退，可额外缓存原始值
    }
  }
  // 清理状态
  editStatus[rowKey][col.prop] = false;
  delete editCache[rowKey][col.prop];
}

// 行选择示例：在 v2Columns 中插入 selection 列，并维护 selectedRows
const multipleSelection = ref<any[]>([]);
const selectedRowKeys = ref<Set<string|number>>(new Set());
function toggleRowSelectionVirtual(row: any) {
  const rk = getRowKey(row);
  if (selectedRowKeys.value.has(rk)) {
    selectedRowKeys.value.delete(rk);
  } else {
    selectedRowKeys.value.add(rk);
  }
  // 更新 multipleSelection
  multipleSelection.value = filteredData.value.filter(r => selectedRowKeys.value.has(getRowKey(r)));
  // 发出事件
  emits('handleSelectionChange', multipleSelection.value);
}
// 如果需要在 v2Columns 前插入选择列：
watch(v2Columns, () => {
  // 确保插入一次
});
// 以下可在 v2Columns 计算时，unshift：
/*
v2Columns.value.unshift({
  key: 'selection',
  width: 50,
  cellRenderer: ({ rowData }) => {
    const rk = getRowKey(rowData);
    const checked = selectedRowKeys.value.has(rk);
    return (
      <el-checkbox
        modelValue={checked}
        onChange={() => toggleRowSelectionVirtual(rowData)}
      />
    );
  }
});
*/

// 数据获取与分页/滚动加载
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(1000); // 若使用虚拟化一次加载大量行，可调大；若用分页则小一些
const usePagination = ref(false); // 根据需求决定是否使用分页
async function getData(searchParams: Record<string, any> = {}) {
  loading.value = true;
  try {
    const params = {
      pageNum: currentPage.value,
      start: pageSize.value * (currentPage.value - 1),
      pageSize: pageSize.value,
      ...searchParams,
    };
    const res = await props.getDataApi(params);
    if (res) {
      const rows = (res.rows || []).map((item: any, idx: number) => {
        if (item.id == null) {
          return { ...item, _rowId: `${Date.now()}-${Math.random()}-${idx}` };
        }
        return item;
      });
      allData.value = rows;
      total.value = res.total || rows.length;
      emits('dataLoaded', allData.value);
    }
  } catch (err) {
    console.error('数据加载失败:', err);
    ElMessage.error('数据加载失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}
function onSearch(init = false) {
  if (!init) currentPage.value = 1;
  const params: Record<string, any> = {};
  localColumns.value.forEach(col => {
    if (col.type === 'date') {
      if (col.keyword) params[`${col.prop}_start`] = formatDateByYMD(col.keyword, 'yyyy-MM-dd');
      if (col.keyword2) params[`${col.prop}_end`] = formatDateByYMD(col.keyword2, 'yyyy-MM-dd');
    } else if (col.keyword !== undefined && col.keyword !== '') {
      params[col.prop] = `%${col.keyword}%`;
    }
  });
  getData(params);
}
const onSearchDebounced = debounce(onSearch, 300);
function onRefresh() {
  localColumns.value.forEach(col => {
    col.keyword = '';
    col.keyword2 = '';
  });
  currentPage.value = 1;
  getData();
}
function onPageSizeChange(newSize: number) {
  pageSize.value = newSize;
  onSearch(true);
}
function onPageChange(newPage: number) {
  currentPage.value = newPage;
  onSearch(true);
}

watch(
  () => router.currentRoute.value.path,
  () => { onRefresh(); },
  { immediate: true }
);
onMounted(() => { getData(); });

// 表头样式、国际化
const headerHeight = 50; // 根据 search-bar 区域高度自行调整
const locale = computed(() => zhCn);

// 按钮禁用逻辑
const single = ref(true);
const multiple = ref(true);
const handleButtonDisabled = (val: string | boolean) => {
  if (val === 'single') {
    return single.value;
  } else if (val === 'multiple') {
    return multiple.value;
  }
  return val as boolean;
};
</script>

<style scoped>
/* 保留原有样式，仅在必要时调整 */
.a-container {
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
  margin-bottom: 8px;
}
/* 可根据 search-bar 实际高度调整 */
.search-bar {
  margin-bottom: 8px;
}
/* 其它样式同原组件，可复用 */
</style>
