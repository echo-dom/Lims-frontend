<template>
  <el-container class="a-container">
    <!-- ... 表头、搜索区同前 ... -->
    <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <!-- 确保父容器及 el-auto-resizer 返回有效 height -->
          <el-table-v2
            :columns="v2Columns"
            :data="filteredData"
            :width="width"
            :height="height"
            fixed
          />
        </template>
      </el-auto-resizer>
    </div>
    <!-- ... 分页区 ... -->
  </el-container>
</template>

<script setup lang="tsx">
// 确保已安装并配置 @vitejs/plugin-vue-jsx，.tsx 支持
import { ref, reactive, computed, watch, onMounted, nextTick, h } from 'vue';
import { useRouter } from 'vue-router';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import {
  ElMessage,
  ElInput,
  ElInputNumber,
  ElDatePicker,
  ElSelect,
  ElOption,
  ElCheckbox
} from 'element-plus';
import { Operation, Refresh, Search } from '@element-plus/icons-vue';
import type { Column } from 'element-plus';
import { TableV2FixedDir } from 'element-plus';
import { formatDateByYMD, getColumnTypeName } from '@/utils/utils';
import { debounce } from 'lodash-es';

interface ColumnItem { /* 同前定义 */ }
interface ButtonItem { /* 同前定义 */ }

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

// 本地列配置等同之前逻辑
const localColumns = ref<ColumnItem[]>(props.columnList.map(col => ({ ...col, keyword: '', keyword2: '' })));
watch(() => props.columnList, newList => {
  localColumns.value = newList.map(col => ({ ...col, keyword: '', keyword2: '' }));
  selectedColumns.value = localColumns.value.map(col => col.prop);
}, { deep: true });

const selectedColumns = ref<string[]>(localColumns.value.map(col => col.prop));
const selectAllColumns = ref(true);
const isIndeterminate = computed(() => selectedColumns.value.length > 0 && selectedColumns.value.length < localColumns.value.length);
const handleSelectAll = (val: boolean) => {
  selectedColumns.value = val ? localColumns.value.map(col => col.prop) : [];
};
// 可搜索列同前
const searchableColumns = computed(() => localColumns.value.filter(col => true));

// 数据与过滤
const allData = ref<any[]>([]);
const filteredData = computed(() => {
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

// 编辑状态管理，确保 getRowKey 返回稳定键
const editStatus = reactive<Record<string, Record<string, boolean>>>({});
const editCache = reactive<Record<string, Record<string, any>>>({});
function getRowKey(row: any): string | number {
  return row.id ?? row._rowId;
}
function startEditVirtual(row: any, col: ColumnItem) {
  const rowKey = getRowKey(row);
  if (!editCache[rowKey]) editCache[rowKey] = {};
  // 取消其他编辑
  for (const rk in editStatus) {
    for (const p in editStatus[rk]) {
      editStatus[rk][p] = false;
    }
  }
  editCache[rowKey][col.prop] = row[col.prop];
  if (!editStatus[rowKey]) editStatus[rowKey] = {};
  editStatus[rowKey][col.prop] = true;
  // 聚焦：虚拟化可能卸载再挂载，聚焦逻辑需在 cellRenderer 内 nextTick 后使用 ref
}
async function saveEditVirtual(row: any, col: ColumnItem) {
  const rowKey = getRowKey(row);
  if (!editStatus[rowKey]?.[col.prop]) return;
  const newVal = editCache[rowKey][col.prop];
  if (newVal === row[col.prop]) {
    editStatus[rowKey][col.prop] = false;
    return;
  }
  row[col.prop] = newVal;
  if (props.updateDataApi) {
    try {
      await props.updateDataApi(row);
      ElMessage.success('保存成功');
    } catch (err) {
      console.error('保存失败', err);
      ElMessage.error('保存失败');
    }
  }
  editStatus[rowKey][col.prop] = false;
  delete editCache[rowKey][col.prop];
}

// 生成 v2Columns，使用 JSX 渲染时注意导入组件名大写
const v2Columns = computed<Column<any>[]>(() => {
  const cols: Column<any>[] = [];
  // 如果需要选择列，可 unshift 选列定义，示例省略 headerCellRenderer
  // cols.push({ key: 'selection', width: 50, cellRenderer: ... });
  for (const col of localColumns.value.filter(c => selectedColumns.value.includes(c.prop))) {
    const base: Column<any> = {
      key: col.prop,
      dataKey: col.prop,
      title: col.label,
      width: col.width ? Number(col.width) : undefined,
    };
    if (col.fixed) {
      if (col.fixed === true || col.fixed === 'left') base.fixed = TableV2FixedDir.LEFT;
      else if (col.fixed === 'right') base.fixed = TableV2FixedDir.RIGHT;
    }
    base.cellRenderer = ({ rowData }) => {
      const cellValue = rowData[col.prop];
      const rowKey = getRowKey(rowData);
      const isEditing = !!(editStatus[rowKey] && editStatus[rowKey][col.prop]);
      // 只读列
      if (!col.editable) {
        if (col.type === 'date') {
          return formatDateByYMD(cellValue, 'yyyy-MM-dd');
        }
        return cellValue != null ? String(cellValue) : '';
      }
      // 可编辑列
      if (!isEditing) {
        return (
          <div
            class="editable-cell-wrapper"
            style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;"
            onClick={() => startEditVirtual(rowData, col)}
          >
            {cellValue != null && cellValue !== ''
              ? (col.type === 'date' ? formatDateByYMD(cellValue, 'yyyy-MM-dd') : String(cellValue))
              : <span style="visibility:hidden;">&nbsp;</span>
            }
          </div>
        );
      } else {
        // 编辑模式，渲染对应输入组件
        // 通过 ref 聚焦时，可在这里使用 nextTick
        const cacheVal = editCache[rowKey]?.[col.prop];
        const commonProps = {
          modelValue: cacheVal,
          'onUpdate:modelValue': (v: any) => { editCache[rowKey][col.prop] = v; },
          size: 'small',
          style: { width: '100%' },
          onBlur: () => saveEditVirtual(rowData, col),
          onKeyup: (e: KeyboardEvent) => { if (e.key === 'Enter') saveEditVirtual(rowData, col); }
        };
        if (!col.editType || col.editType === 'text') {
          return <ElInput {...commonProps} />;
        } else if (col.editType === 'number') {
          return <ElInputNumber {...commonProps} onChange={() => saveEditVirtual(rowData, col)} />;
        } else if (col.editType === 'date') {
          return (
            <ElDatePicker
              v-model={editCache[rowKey][col.prop]}
              type="date"
              size="small"
              value-format="YYYY-MM-DD"
              onChange={() => saveEditVirtual(rowData, col)}
              onBlur={() => saveEditVirtual(rowData, col)}
              style="width:100%;"
            />
          );
        } else if (col.editType === 'select' && col.options) {
          return (
            <ElSelect
              v-model={editCache[rowKey][col.prop]}
              size="small"
              onChange={() => saveEditVirtual(rowData, col)}
              style="width:100%;"
            >
              {col.options.map(opt => <ElOption key={opt.value} label={opt.label} value={opt.value} />)}
            </ElSelect>
          );
        }
        // fallback
        return <ElInput {...commonProps} />;
      }
    };
    cols.push(base);
  }
  return cols;
});

// 数据获取、分页、搜索、刷新等同之前逻辑，注意 allData、filteredData 绑定
const router = useRouter();
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(1000);
const usePagination = ref(false);

async function getData(searchParams: Record<string, any> = {}) {
  loading.value = true;
  try {
    const params = { pageNum: currentPage.value, start: pageSize.value*(currentPage.value-1), pageSize: pageSize.value, ...searchParams };
    const res = await props.getDataApi(params);
    if (res) {
      const rows = (res.rows||[]).map((item:any, idx:number) => {
        if (item.id == null) return { ...item, _rowId: `${Date.now()}-${Math.random()}-${idx}` };
        return item;
      });
      allData.value = rows;
      total.value = res.total || rows.length;
      emits('dataLoaded', allData.value);
    }
  } catch (err) {
    console.error('数据加载失败', err);
    ElMessage.error('数据加载失败');
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
  localColumns.value.forEach(col => { col.keyword = ''; col.keyword2 = ''; });
  currentPage.value = 1;
  getData();
}
function onPageSizeChange(newSize: number) { pageSize.value = newSize; onSearch(true); }
function onPageChange(newPage: number) { currentPage.value = newPage; onSearch(true); }

watch(() => router.currentRoute.value.path, () => onRefresh(), { immediate: true });
onMounted(() => getData());

const headerHeight = 50;
const locale = computed(() => zhCn);

// 按钮禁用逻辑同前
const single = ref(true);
const multiple = ref(true);
const handleButtonDisabled = (val: string|boolean) => {
  if (val === 'single') return single.value;
  if (val === 'multiple') return multiple.value;
  return Boolean(val);
};
</script>

<style scoped>
/* 同前样式，检查 el-auto-resizer 父容器高度 */
.a-container { height: 100%; padding:16px; display:flex; flex-direction:column; background:#fff; border-radius:8px; }
.table-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.search-bar { margin-bottom:8px; }
/* 确保 el-auto-resizer 的父元素在 flex 布局下能拉伸 */
</style>
