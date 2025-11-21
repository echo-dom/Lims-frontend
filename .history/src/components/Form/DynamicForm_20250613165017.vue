<template>
  <el-form :model="formData" ref="formRef" label-width="150px" class="space-y-4">
    <template v-for="field in templateData.fields" :key="field.id">
      <el-form-item  :label="field.label" :prop="field.name" :rules="field.required ? [{ required: true, message: field.label + ' 为必填', trigger: 'blur' }] : []">
        <el-input v-if="field.type==='text'" v-model="formData[field.name]" />
        <el-input-number v-else-if="field.type==='number'" v-model="formData[field.name]" :precision="4" class="w-full" />
        <el-date-picker v-else-if="field.type==='date'" v-model="formData[field.name]" type="date" class="w-full" />
        <el-select v-else-if="field.type==='select'" v-model="formData[field.name]" class="w-full">
          <el-option v-for="opt in field.options||[]" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
        <template v-else>
          <el-input v-model="formData[field.name]" />
        </template>
      </el-form-item>
    </template>
    <!-- 显示公式结果 -->
    <template v-for="formula in templateData.formulas">
      <el-form-item :key="formula.id" :label="formula.label">
        <el-input v-model="results[formula.name]" disabled />
      </el-form-item>
    </template>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { evaluate } from 'mathjs'

const props = defineProps({
  templateData: {
    type: Object,
    required: true
  }
})

const formRef = ref(null)
const formData = reactive({})
const results = reactive({})

// 初始化表单数据
props.templateData.fields.forEach(field => {
  formData[field.name] = null
})
props.templateData.formulas.forEach(f => {
  results[f.name] = null
})

// 计算公式函数
function computeFormulas() {
  props.templateData.formulas.forEach(f => {
    try {
      const scope = {}
      let ready = true
      f.dependencies.forEach(dep => {
        const val = formData[dep]
        if (val === null || val === undefined || val === '') {
          ready = false
        } else {
          scope[dep] = Number(val)
        }
      })
      if (ready) {
        const res = evaluate(f.expression, scope)
        results[f.name] = Number(res.toFixed(4))
      } else {
        results[f.name] = null
      }
    } catch (e) {
      console.error('Formula error', f.expression, e)
      results[f.name] = null
    }
  })
}

// 监听依赖字段变化
props.templateData.formulas.forEach(f => {
  f.dependencies.forEach(dep => {
    watch(() => formData[dep], computeFormulas)
  })
})

// 提交与重置
function onSubmit() {
  formRef.value.validate(valid => {
    if (valid) {
      console.log('Submitted Data:', JSON.parse(JSON.stringify(formData)))
      console.log('Computed Results:', JSON.parse(JSON.stringify(results)))
      alert('提交成功，查看控制台数据')
    } else {
      alert('请完善必填字段')
    }
  })
}

function onReset() {
  props.templateData.fields.forEach(field => {
    formData[field.name] = null
  })
  props.templateData.formulas.forEach(f => {
    results[f.name] = null
  })
}
</script>

<style scoped>
/* 可根据需要添加 Tailwind 类或自定义样式 */
</style>
