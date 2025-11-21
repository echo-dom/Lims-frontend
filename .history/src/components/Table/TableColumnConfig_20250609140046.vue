<template>
  <el-drawer v-model="visible" title="列配置" direction="rtl">
    <div class="column-config-container">
      <el-checkbox-group v-model="visibleProps">
        <draggable v-model="localColumns" handle=".drag-handle">
          <div v-for="col in localColumns" :key="col.prop" class="column-item">
            <i class="ri-draggable drag-handle" />
            <el-checkbox :label="col.prop">
              {{ col.label }}
            </el-checkbox>
            <el-tag size="small" v-if="col.type">{{ col.type }}</el-tag>
          </div>
        </draggable>
      </el-checkbox-group>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
// import type { ColumnConfig } from './types'
// src/components/SmartTable/types.ts
import type { Filter } from 'element-plus'

interface ColumnConfig {
  prop: string
  label: string
  type?: 'text' | 'number' | 'date' | 'select' | 'custom'
  visible?: boolean
  sortable?: boolean
  filters?: Filter[]
  filterMethod?: (filterValue: any, cellValue: any) => boolean
  options?: Array<{ label: string; value: any }> // 下拉选项
  formatter?: (value: any) => string // 自定义格式化
  event?: string // 自定义事件类型
  width?: string
}
const props = defineProps({
  visible: Boolean,
  columns: Array as () => ColumnConfig[],
  visibleColumns: Array as () => ColumnConfig[]
})

const emit = defineEmits(['update:visible', 'update:visibleColumns'])

const visible = ref(props.visible)
const localColumns = ref([...props.columns])
const visibleProps = ref(props.visibleColumns.map(c => c.prop))

// 同步列可见性变化
watch(visibleProps, (newVal) => {
  const newVisibleColumns = props.columns
    .filter(col => newVal.includes(col.prop))
    .sort((a, b) => 
      newVal.indexOf(a.prop) - newVal.indexOf(b.prop)
  
  emit('update:visibleColumns', newVisibleColumns)
})

// 同步列顺序变化
watch(localColumns, (newColumns) => {
  visibleProps.value = [...visibleProps.value].sort(
    (a, b) => newColumns.findIndex(c => c.prop === a) - 
              newColumns.findIndex(c => c.prop === b)
  )
})

watch(() => props.visible, val => visible.value = val)
watch(visible, val => emit('update:visible', val))
</script>

<style scoped>
.column-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.drag-handle {
  cursor: move;
  margin-right: 10px;
  color: #999;
}
</style>