<template>
  <div class="report-form">
    <h2 class="form-title">样品检测记录表</h2>

    <el-form :model="form" label-width="120px" class="form-content" ref="formRef">
      <!-- 基本信息 -->
      <fieldset class="fieldset">
        <legend>样品信息</legend>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="样品名称">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="样品编号">
              <el-input v-model="form.code" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="样品类型">
              <el-select v-model="form.type" placeholder="选择类型">
                <el-option label="固体" value="solid" />
                <el-option label="液体" value="liquid" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="送样日期">
              <el-date-picker v-model="form.date" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>

      <!-- 检测记录 -->
      <fieldset class="fieldset">
        <legend>检测数据记录</legend>
        <el-table :data="form.tests" border style="width: 100%">
          <el-table-column prop="item" label="检测项目" width="150" />
          <el-table-column label="测量值 X1">
            <template #default="scope">
              <el-input v-model="scope.row.x1" />
            </template>
          </el-table-column>
          <el-table-column label="测量值 X2">
            <template #default="scope">
              <el-input v-model="scope.row.x2" />
            </template>
          </el-table-column>
          <el-table-column label="平均值 X̄">
            <template #default="scope">
              {{ getAverage(scope.row.x1, scope.row.x2) }}
            </template>
          </el-table-column>
          <el-table-column label="单位">
            <template #default="scope">
              <el-input v-model="scope.row.unit" />
            </template>
          </el-table-column>
        </el-table>
      </fieldset>

      <!-- 分析结论 -->
      <fieldset class="fieldset">
        <legend>分析结论</legend>
        <el-form-item label="结论说明">
          <el-input type="textarea" v-model="form.conclusion" rows="4" />
        </el-form-item>
      </fieldset>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  code: 'LIMS-' + new Date().getTime().toString().slice(-6),
  type: '',
  date: '',
  conclusion: '',
  tests: [
    { item: 'pH值', x1: '', x2: '', unit: 'pH' },
    { item: '重金属（Pb）', x1: '', x2: '', unit: 'mg/kg' },
    { item: '细菌总数', x1: '', x2: '', unit: 'CFU/g' }
  ]
})

const formRef = ref()

const getAverage = (x1, x2) => {
  const n1 = parseFloat(x1)
  const n2 = parseFloat(x2)
  if (isNaN(n1) || isNaN(n2)) return ''
  return ((n1 + n2) / 2).toFixed(2)
}

const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      console.log('提交内容:', form.value)
    }
  })
}

const reset = () => {
  formRef.value.resetFields()
}
</script>

<style scoped>
.report-form {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
  background-color: #fff;
  border: 1px solid #ddd;
  font-family: 'Microsoft YaHei', sans-serif;
}
.form-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}
.fieldset {
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 24px;
  border-radius: 4px;
}
.fieldset legend {
  font-weight: bold;
  padding: 0 8px;
}
.form-actions {
  text-align: center;
  margin-top: 24px;
}
</style>
