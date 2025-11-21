<template>
  <div class="p-6 space-y-4">
    <el-card shadow="hover" header="模板字段定义">
      <el-form :model="newField" inline>
        <el-form-item label="字段名">
          <el-input v-model="newField.name" placeholder="如 C0" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="newField.label" placeholder="如 空白值" />
        </el-form-item>
        <el-form-item label="是否计算">
          <el-switch v-model="newField.calculated" />
        </el-form-item>
        <el-form-item v-if="newField.calculated" label="公式">
          <el-input v-model="newField.formula" placeholder="如 (C - C0) * V / M" />
        </el-form-item>
        <el-button type="primary" @click="addField">添加字段</el-button>
      </el-form>

      <el-table :data="template.fields" border style="margin-top: 20px">
        <el-table-column prop="name" label="字段名" />
        <el-table-column prop="label" label="标签" />
        <el-table-column prop="calculated" label="计算字段" />
        <el-table-column prop="formula" label="公式" />
        <el-table-column label="操作" width="100">
          <template #default="{ row, $index }">
            <el-button size="small" type="danger" @click="removeField($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="hover" header="模板 JSON 结构">
      <el-input type="textarea" :rows="10" v-model="jsonPreview" readonly />
    </el-card>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const template = reactive({
  fields: [],
})

const newField = reactive({
  name: '',
  label: '',
  calculated: false,
  formula: '',
})

function addField() {
  if (!newField.name || !newField.label) {
    ElMessage.warning('字段名和标签不能为空')
    return
  }
  template.fields.push({
    name: newField.name,
    label: newField.label,
    calculated: newField.calculated,
    formula: newField.calculated ? newField.formula : '',
  })
  // 重置
  newField.name = ''
  newField.label = ''
  newField.calculated = false
  newField.formula = ''
}

function removeField(index) {
  template.fields.splice(index, 1)
}

const jsonPreview = computed(() => {
  return JSON.stringify(template, null, 2)
})
</script>

<style scoped>
.el-form-item {
  margin-right: 16px;
}
</style>
