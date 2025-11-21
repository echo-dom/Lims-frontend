<template>
  <el-form :model="formData" label-width="120px" class="p-4 grid grid-cols-2 gap-4">
    <template v-for="field in visibleFields" :key="field.key">
      <el-form-item :label="field.label">
        <el-input v-if="field.type === 'text'" v-model="formData[field.key]" :readonly="field.readonly" />
        <el-input-number v-else-if="field.type === 'number'" v-model="formData[field.key]" :readonly="field.readonly" :precision="3" />
      </el-form-item>
    </template>
  </el-form>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'

// 假设这是从后端加载的模板定义
const template = {
  templateId: 'TMP001',
  name: '农药残留检测模板',
  fields: [
    { key: 'sampleName', label: '样品名称', type: 'text', required: true },
    { key: 'X1', label: 'X1', type: 'number', showIf: 'hasX' },
    { key: 'X2', label: 'X2', type: 'number', showIf: 'hasX' },
    { key: 'XMean', label: '平均值', type: 'number', readonly: true, formula: '(X1 + X2) / 2' },
    { key: 'C', label: '仪器读数C', type: 'number' },
    { key: 'C0', label: '空白读数C0', type: 'number' },
    { key: 'V', label: '定容体积V', type: 'number' },
    { key: 'M', label: '样品质量M', type: 'number' },
    { key: 'Result', label: '结果', type: 'number', readonly: true, formula: '((C - C0) * V) / M' }
  ],
  conditions: {
    hasX: true
  }
}

const formData = reactive({})

// 初始赋值，避免未定义报错
template.fields.forEach(field => {
  formData[field.key] = 0
})

const visibleFields = computed(() => {
  return template.fields.filter(field => {
    if (!field.showIf) return true
    return template.conditions[field.showIf]
  })
})

function computeFormula(formula, data) {
  try {
    const expr = formula.replace(/\b\w+\b/g, key => data[key] ?? 0)
    return eval(expr)
  } catch (e) {
    return 0
  }
}

// 自动计算公式字段
watch(
  () => ({ ...formData }),
  () => {
    template.fields.forEach(field => {
      if (field.formula && field.readonly) {
        formData[field.key] = parseFloat(
          computeFormula(field.formula, formData).toFixed(3)
        )
      }
    })
  },
  { deep: true, immediate: true }
)
</script>

<style scoped>
/* Tailwind 样式在组件外生效，这里可选添加局部样式 */
</style>
