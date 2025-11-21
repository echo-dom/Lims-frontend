<template>
  <div class="report-sheet">
    <div class="sheet-header">
      <h2>食品检测报告单</h2>
      <div class="sheet-meta">
        <span>报告编号：{{ reportCode }}</span>
        <span>日期：{{ today }}</span>
      </div>
    </div>

    <el-form :model="form" label-width="150px" class="sheet-form">
      <el-row :gutter="10" v-for="(item, index) in form.items" :key="index">
        <el-col :span="12">
          <el-form-item :label="item.label">
            <el-input v-model="item.value" placeholder="请输入检测值">
              <template #append>{{ item.unit }}</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参考范围">
            <el-input v-model="item.ref" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark" rows="3" />
      </el-form-item>

      <div class="sheet-footer">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'

const today = new Date().toISOString().slice(0, 10)
const reportCode = 'LIMS-' + new Date().getTime().toString().slice(-6)

const form = reactive({
  items: [
    { label: 'pH值', value: '', unit: '', ref: '6.0 - 8.0' },
    { label: '重金属（Pb）', value: '', unit: 'mg/kg', ref: '< 0.1' },
    { label: '菌落总数', value: '', unit: 'CFU/g', ref: '< 1000' },
    { label: '亚硝酸盐', value: '', unit: 'mg/kg', ref: '< 2.0' }
  ],
  remark: ''
})

const submit = () => {
  console.log('提交数据：', form)
}

const reset = () => {
  form.items.forEach(i => (i.value = ''))
  form.remark = ''
}
</script>

<style scoped>
.report-sheet {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px;
  background: #fff;
  border: 1px solid #e5e5e5;
  font-family: 'Microsoft YaHei', sans-serif;
  color: #333;
}

.sheet-header {
  text-align: center;
  margin-bottom: 30px;
}

.sheet-header h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.sheet-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  border-top: 1px dashed #ccc;
  border-bottom: 1px dashed #ccc;
  padding: 8px 0;
}

.sheet-form .el-form-item {
  margin-bottom: 20px;
}

.sheet-footer {
  text-align: center;
  margin-top: 40px;
}
</style>
