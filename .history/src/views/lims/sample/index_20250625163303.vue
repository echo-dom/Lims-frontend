<template>
  <el-card shadow="always" class="report-form max-w-5xl mx-auto my-8 p-6">
    <!-- 报告标题 -->
    <div class="text-center text-2xl font-bold mb-6">样品检测报告表</div>

    <!-- 报告基础信息 -->
    <el-form :model="form" label-position="left" label-width="120px" class="mb-4">
      <div class="grid grid-cols-2 gap-6">
        <el-form-item label="报告编号：">
          <el-input v-model="form.reportNo" disabled />
        </el-form-item>
        <el-form-item label="检测日期：">
          <el-date-picker v-model="form.testDate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="客户单位：">
          <el-input v-model="form.client" />
        </el-form-item>
        <el-form-item label="样品名称：">
          <el-input v-model="form.sampleName" />
        </el-form-item>
        <el-form-item label="样品编号：">
          <el-input v-model="form.sampleCode" />
        </el-form-item>
        <el-form-item label="检测人员：">
          <el-input v-model="form.tester" />
        </el-form-item>
      </div>
    </el-form>

    <!-- 检测项目表格 -->
    <el-table :data="form.items" border stripe class="mb-4">
      <el-table-column prop="item" label="检测项目" width="180" />
      <el-table-column prop="method" label="检测方法" />
      <el-table-column prop="result" label="检测结果">
        <template #default="{ row }">
          <el-input v-model="row.result" />
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" />
      <el-table-column prop="limit" label="标准限值" width="120" />
      <el-table-column prop="conclusion" label="结论" width="100">
        <template #default="{ row }">
          <el-select v-model="row.conclusion" placeholder="选择">
            <el-option label="合格" value="合格" />
            <el-option label="不合格" value="不合格" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>

    <!-- 备注 -->
    <el-form-item label="备注：" class="mt-4">
      <el-input v-model="form.remark" type="textarea" rows="4" />
    </el-form-item>

    <!-- 操作按钮 -->
    <div class="text-center mt-6">
      <el-button type="primary" @click="submit">保存报告</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
  </el-card>
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
  remark: '',
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
  form.value.testDate = ''
  form.value.client = ''
  form.value.sampleName = ''
  form.value.sampleCode = ''
  form.value.tester = ''
  form.value.remark = ''
  form.value.items.forEach(item => {
    item.result = ''
    item.conclusion = ''
  })
}
</script>

<style scoped>
.report-form {
  font-family: "Microsoft YaHei", sans-serif;
  background: #fff;
  border: 1px solid #ccc;
}
</style>
