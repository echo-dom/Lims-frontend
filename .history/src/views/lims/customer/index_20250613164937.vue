<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">LIMS 动态表单示例</h1>
    <DynamicForm :templateData="templateData" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DynamicForm from '@/components/Form/DynamicForm.vue'

// 示例模板定义
const templateData = ref({
  fields: [
    { id: 'C0', name: 'C0', label: '空白读数 C0', type: 'number', unit: '', required: true },
    { id: 'C', name: 'C', label: '仪器读数 C', type: 'number', unit: '', required: true },
    { id: 'V', name: 'V', label: '定容体积 V (mL)', type: 'number', unit: 'mL', required: true },
    { id: 'M', name: 'M', label: '样品质量 M (g)', type: 'number', unit: 'g', required: true },
    { id: 'X1', name: 'X1', label: '测量值 X1', type: 'number', unit: '', required: false, is_replicate: true, replicate_group: 'X' },
    { id: 'X2', name: 'X2', label: '测量值 X2', type: 'number', unit: '', required: false, is_replicate: true, replicate_group: 'X' },
  ],
  formulas: [
    { id: 'average_X', name: 'average_X', label: '平均测量值', expression: '(X1 + X2) / 2', dependencies: ['X1', 'X2'], output: true },
    { id: 'concentration', name: 'concentration', label: '浓度', expression: '(C - C0) * V / M', dependencies: ['C', 'C0', 'V', 'M'], output: true },
  ]
})
</script>
