<template>
  <el-form
    :model="form"
    label-width="120px"
    class="responsive-form"
    ref="formRef"
  >
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="样品名称" prop="sampleName">
          <el-input v-model="form.sampleName" placeholder="请输入样品名称" />
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="样品编号" prop="sampleCode">
          <el-input v-model="form.sampleCode" placeholder="自动生成或手动输入" />
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="检测日期" prop="testDate">
          <el-date-picker v-model="form.testDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="样品类型" prop="sampleType">
          <el-select v-model="form.sampleType" placeholder="请选择类型" style="width: 100%">
            <el-option label="固体" value="solid" />
            <el-option label="液体" value="liquid" />
            <el-option label="气体" value="gas" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="1" style="width: 100%" />
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="单位" prop="unit">
          <el-select v-model="form.unit" placeholder="请选择单位" style="width: 100%">
            <el-option label="克" value="g" />
            <el-option label="毫升" value="ml" />
            <el-option label="件" value="pcs" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="备注">
      <el-input type="textarea" v-model="form.remark" rows="3" />
    </el-form-item>

    <el-form-item class="form-actions">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  sampleName: '',
  sampleCode: '',
  testDate: '',
  sampleType: '',
  quantity: 1,
  unit: '',
  remark: ''
})

const formRef = ref()

const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      console.log('提交成功:', form.value)
    }
  })
}

const reset = () => {
  formRef.value.resetFields()
}
</script>

<style scoped>
.responsive-form {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
}

.form-actions {
  text-align: center;
  margin-top: 24px;
}
</style>
