<template>
  <el-dialog :title="title" v-model="visible" width="700px" append-to-body destroy-on-close>
    <el-form ref="programsRef" :model="form" :rules="rules" label-width="100px">
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="原系统ID" prop="originalId">
            <el-input v-model="form.originalId" placeholder="请输入原系统ID" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行标准编号" prop="spCode">
            <el-input v-model="form.spCode" placeholder="请输入执行标准编号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="备用标准编号" prop="spCodeAlt">
            <el-input v-model="form.spCodeAlt" placeholder="请输入备用标准编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准ID" prop="criterionId">
            <el-input v-model="form.criterionId" placeholder="请输入标准ID" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="版本号" prop="version">
            <el-input v-model="form.version" placeholder="请输入版本号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="领域ID" prop="domainId">
            <el-input v-model="form.domainId" placeholder="请输入领域ID" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="领域名称" prop="domainName">
            <el-input v-model="form.domainName" placeholder="请输入领域名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sorter">
            <el-input v-model="form.sorter" placeholder="请输入排序" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="测试规则" prop="testRules">
        <el-input v-model="form.testRules" type="textarea" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="详细名称" prop="detailName">
        <el-input v-model="form.detailName" type="textarea" placeholder="请输入内容" />
      </el-form-item>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="冻结标志" prop="freezeFlag">
            <el-input v-model="form.freezeFlag" placeholder="请输入冻结标志" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否校准" prop="isCal">
            <el-input v-model="form.isCal" placeholder="请输入是否校准" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="冻结者" prop="freezeBy">
            <el-input v-model="form.freezeBy" placeholder="请输入冻结者" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="冻结时间" prop="freezeTime">
            <el-date-picker
              v-model="form.freezeTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择冻结时间"
              style="width: 100%"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="冻结描述" prop="freezerDesc">
        <el-input v-model="form.freezerDesc" type="textarea" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="记录者描述" prop="recorderDesc">
        <el-input v-model="form.recorderDesc" type="textarea" placeholder="请输入内容" />
      </el-form-item>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="创建者描述" prop="createrDesc">
            <el-input v-model="form.createrDesc" placeholder="请输入创建者描述" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建者代码" prop="createrCode">
            <el-input v-model="form.createrCode" placeholder="请输入创建者代码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="创建日期" prop="createrDate">
            <el-date-picker
              v-model="form.createrDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择创建日期"
              style="width: 100%"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择开始时间"
              style="width: 100%"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="删除标志" prop="delFlag">
        <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import type { FormInstance } from "element-plus"

const props = defineProps<{
  modelValue: boolean
  title: string
  form: Record<string, any>
  rules: Record<string, any>
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
  (e: "submit"): void
  (e: "cancel"): void
}>()

const programsRef = ref<FormInstance>()

const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit("update:modelValue", val)
})

function handleSubmit() {
  programsRef.value?.validate(valid => {
    if (valid) {
      emit("submit")
    }
  })
}

function handleCancel() {
  emit("cancel")
  visible.value = false
}

defineExpose({
  resetFields: () => programsRef.value?.resetFields?.(),
  clearValidate: () => programsRef.value?.clearValidate?.()
})
</script>

