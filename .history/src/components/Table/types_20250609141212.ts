// src/components/SmartTable/types.ts
import type { Filter } from 'element-plus'

export interface ColumnConfig {
  prop: string
  label: string
  type?: 'text' | 'number' | 'date' | 'select' | 'custom' | 'boolean'
  visible?: boolean
  sortable?: boolean | 'custom'
  filters?: Filter[]
  filterMethod?: (filterValue: any, cellValue: any) => boolean
  options?: Array<{ label: string; value: any }> // 下拉选项
  formatter?: (value: any, row?: any) => string // 自定义格式化
  event?: string // 自定义事件类型
  width?: string
  fixed?: boolean | 'left' | 'right'
  minWidth?: number
  align?: 'left' | 'center' | 'right'
  editable?: boolean // 是否可编辑
}