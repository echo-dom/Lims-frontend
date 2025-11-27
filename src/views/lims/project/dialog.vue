<template>
  <el-dialog :title="title" :model-value="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="原系统ID" prop="originalId">
            <el-input v-model="form.originalId" placeholder="请输入原系统ID" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="方案代码" prop="programCode">
            <el-input v-model="form.programCode" placeholder="请输入方案代码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="方案类型" prop="profileType">
            <el-input v-model="form.profileType" placeholder="请输入方案类型" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="方案名称" prop="profile">
            <el-input v-model="form.profile" placeholder="请输入方案名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主项目数" prop="mainProNum">
            <el-input v-model="form.mainProNum" placeholder="请输入主项目数" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="启用日期" prop="startUseDate">
            <el-date-picker clearable v-model="form.startUseDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择启用日期" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="到期日期" prop="expirationDate">
            <el-date-picker clearable v-model="form.expirationDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择到期日期" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-input v-model="form.status" placeholder="请输入状态" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示状态" prop="dispStatus">
            <el-input v-model="form.dispStatus" placeholder="请输入显示状态" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行审核状态" prop="rowAudit">
            <el-input v-model="form.rowAudit" placeholder="请输入行审核状态" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格" prop="mPrice">
            <el-input v-model="form.mPrice" placeholder="请输入价格" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="方案说明" prop="explainDesc">
            <el-input v-model="form.explainDesc" type="textarea" placeholder="请输入方案说明" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="删除标志" prop="delFlag">
            <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  form: Object,
  rules: Object
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const formRef = ref()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function submitForm() {
  formRef.value.validate((valid) => {
    if (valid) {
      emit('submit')
    }
  })
}

function cancel() {
  emit('cancel')
}

function resetFields() {
  formRef.value?.resetFields()
}

defineExpose({
  resetFields
})
</script>
