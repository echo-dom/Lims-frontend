<template>
  <div class="p-6 space-y-4">
    <el-card shadow="hover" header="检测数据填写">
      <el-form :model="formData" label-width="120px">
        <template v-for="field in template.fields" :key="field.name">
          <el-form-item :label="field.label">
            <el-input
              v-model="formData[field.name]"
              :disabled="field.calculated"
              @input="onInputChange"
              placeholder="请输入"
            />
          </el-form-item>
        </template>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form>
    </el-card>

    <el-card header="当前数据 JSON" shadow="hover">
      <el-input type="textarea" :rows="10" v-model="jsonResult" readonly />
    </el-card>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { create, all } from 'mathjs'
import { ElMessage } from 'element-plus'

const math = create(all)
math.import({ import: () => {}, createUnit: () => {}, evaluate: math.evaluate }, { override: true })

// 示例模板，可从后端或父组件传入
const template = reactive({
  fields: [
    { name: 'C0', label: '空白值', calculated: false },
    { name: 'C', label: '仪器读数', calculated: false },
    { name: 'V', label: '定容体积', calculated: false },
    { name: 'M', label: '质量', calculated: false },
    {
      name: 'Result',
      label: '结果',
      calculated: true,
      formula: '((C - C0) * V) / M'
    }
  ]
})

// 初始化 form 数据
const formData = reactive({})
template.fields.forEach(field => {
  formData[field.name] = ''
})

// 当输入发生变化时自动计算
function onInputChange() {
  template.fields.forEach(field => {
    if (field.calculated && field.formula) {
      try {
        const scope = { ...formData }
        const result = math.evaluate(field.formula, scope)
        formData[field.name] = Number.isFinite(result) ? result.toFixed(4) : ''
      } catch (err) {
        formData[field.name] = ''
      }
    }
  })
}

function submit() {
  ElMessage.success('数据已提交（模拟）')
  console.log('提交数据:', formData)
}

const jsonResult = computed(() => JSON.stringify(formData, null, 2))
</script>
