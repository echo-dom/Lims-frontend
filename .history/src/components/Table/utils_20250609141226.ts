// src/components/SmartTable/utils.ts
import dayjs from 'dayjs'
import type { ColumnConfig } from './types'

// 格式化单元格值
export const formatCellValue = (value: any, type?: string) => {
  if (type === 'date' && value) {
    return dayjs(value).format('YYYY-MM-DD')
  }
  if (type === 'boolean' && typeof value === 'boolean') {
    return value ? '是' : '否'
  }
  return value
}

// 创建筛选处理器
export const createFilterHandler = (col: ColumnConfig) => {
  return (value: any, row: any) => {
    if (!col.filterMethod) return true
    return col.filterMethod(value, row[col.prop])
  }
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}