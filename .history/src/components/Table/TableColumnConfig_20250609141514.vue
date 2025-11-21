<template>
  <el-drawer 
    v-model="drawerVisible" 
    title="列配置" 
    direction="rtl" 
    size="300px"
    destroy-on-close
  >
    <div class="column-config-container">
      <el-checkbox-group v-model="visibleProps">
        <draggable 
          v-model="localColumns" 
          item-key="prop"
          handle=".drag-handle"
        >
          <template #item="{ element: col }">
            <div class="column-item">
              <el-icon class="drag-handle"><Menu /></el-icon>
              <el-checkbox :label="col.prop">
                {{ col.label }}
              </el-checkbox>
              <el-tag v-if="col.type" size="small" class="type-tag">
                {{ getTypeName(col.type) }}
              </el-tag>
            </div>
          </template>
        </draggable>
      </el-checkbox-group>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { Menu } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import type { ColumnConfig } from './types'

const props = defineProps({
  visible: Boolean,
  columns: { 
    type: Array as () => ColumnConfig[],
    required: true
  },
  visibleColumns: {
    type: Array as () => ColumnConfig[],
    required: true
  }
})

const emit = defineEmits([
  'update:visible',
  'update:visibleColumns'
])

// 控制抽屉显示
const drawerVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

// 本地列数据（用于拖拽排序）
const localColumns = ref<ColumnConfig[]>([...props.columns])

// 可见的列prop数组（用于checkbox）
const visibleProps = computed({
  get: () => props.visibleColumns.map(c => c.prop),
  set: (newVal) => {
    // 根据当前选中的prop数组，重新排序可见列（保持原始顺序）
    const newVisibleColumns = props.columns
      .filter(col => newVal.includes(col.prop))
      .sort((a, b) => 
        newVal.indexOf(a.prop) - newVal.indexOf(b.prop)
      )
    emit('update:visibleColumns', newVisibleColumns)
  }
})

// 当列顺序拖拽改变时，更新可见列的顺序
watch(localColumns, (newColumns) => {
  const currentVisible = [...visibleProps.value]
  // 重新排序可见列，使其与localColumns中的顺序一致
  const sortedVisible = currentVisible.sort(
    (a, b) => newColumns.findIndex(c => c.prop === a) - 
              newColumns.findIndex(c => c.prop === b)
  )
  visibleProps.value = sortedVisible
}, { deep: true })

// 类型名称映射
const getTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    'text': '文本',
    'number': '数字',
    'date': '日期',
    'select': '下拉',
    'custom': '自定义',
    'boolean': '布尔'
  }
  return typeMap[type] || type
}
</script>

<style scoped>
.column-item {
  display: flex;
  align-items: center;
  padding: 8px 5px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s;
}

.column-item:hover {
  background-color: #f5f7fa;
}

.drag-handle {
  cursor: move;
  margin-right: 10px;
  color: #999;
}

.column-config-container {
  padding: 10px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.type-tag {
  margin-left: 8px;
}
</style>