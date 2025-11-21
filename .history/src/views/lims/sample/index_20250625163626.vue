<template>
  <div class="report-container">
    <!-- 标题 -->
    <h1 class="report-title">样品检测报告表</h1>

    <!-- 基本信息表单 -->
    <el-form :model="form" label-width="100px" class="report-form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="报告编号：">
            <el-input v-model="form.reportNo" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测日期：">
            <el-date-picker v-model="form.testDate" type="date" placeholder="选择日期" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="客户单位：">
            <el-input v-model="form.client" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="样品名称：">
            <el-input v-model="form.sampleName" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="样品编号：">
            <el-input v-model="form.sampleCode" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测人员：">
            <el-input v-model="form.tester" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 检测项目表格 -->
      <div class="section-title">检测项目</div>
      <el-table :data="form.items" border>
        <el-table-column prop="item" label="检测项目" width="160" />
        <el-table-column prop="method" label="检测方法" />
        <el-table-column label="检测结果" width="140">
          <template #default="{ row }">
            <el-input v-model="row.result" />
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="limit" label="标准限值" width="120" />
        <el-table-column label="结论" width="100">
          <template #default="{ row }">
            <el-select v-model="row.conclusion" placeholder="选择">
              <el-option label="合格" value="合格" />
              <el-option label="不合格" value="不合格" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>

      <!-- 备注 -->
      <div class="section-title">备注</div>
      <el-form-item label="备注：">
        <el-input type="textarea" v-model="form.remarks" rows="4" />
      </el-form-item>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button type="primary" @click="submit">保存报告</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  reportNo: 'LIMS20250613-001',
  testDate: '',
  client: '',
  sampleName: '',
  sampleCode: '',
  tester: '',
  remarks: '',
  items: [
    {
      item: '重金属含量',
      method: '原子吸收光谱法',
      result: '',
      unit: 'mg/kg',
      limit: '≤0.5',
      conclusion: ''
    },
    {
      item: 'pH值',
      method: '玻璃电极法',
      result: '',
      unit: '',
      limit: '6.5~8.5',
      conclusion: ''
    }
  ]
})

const submit = () => {
  console.log('保存报告：', form.value)
}

const reset = () => {
  Object.assign(form.value, {
    testDate: '',
    client: '',
    sampleName: '',
    sampleCode: '',
    tester: '',
    remarks: '',
    items: form.value.items.map(i => ({ ...i, result: '', conclusion: '' }))
  })
}
</script>

<style scoped>
.report-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 40px;
  background: #fff;
  border: 1px solid #ddd;
  font-family: 'Microsoft YaHei', sans-serif;
}

.report-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
}

.report-form {
  font-size: 14px;
}

.section-title {
  margin: 20px 0 10px;
  font-size: 16px;
  font-weight: 600;
  border-left: 4px solid #409EFF;
  padding-left: 8px;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
}
</style>
