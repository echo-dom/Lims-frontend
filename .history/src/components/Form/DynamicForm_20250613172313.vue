<template>
  <div class="p-4 space-y-4">
    <el-form :model="form" label-width="100px">
      <el-form-item label="项目名称">
        <el-input v-model="form.projectName" placeholder="请输入项目名称" />
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="addItem">添加分析项</el-button>

    <el-table :data="form.items" border class="w-full">
      <el-table-column label="#" type="index" width="50" />
      <el-table-column label="分析项标识">
        <template #default="{ row }">
          <el-input v-model="row.itemKey" size="small" placeholder="如 C0" />
        </template>
      </el-table-column>
      <el-table-column label="显示名称">
        <template #default="{ row }">
          <el-input v-model="row.itemLabel" size="small" placeholder="如 初始浓度" />
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template #default="{ row }">
          <el-select v-model="row.itemType" size="small" style="width: 100px">
            <el-option label="数字" value="number" />
            <el-option label="文本" value="text" />
            <el-option label="公式" value="formula" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="单位">
        <template #default="{ row }">
          <el-input v-model="row.unit" size="small" placeholder="如 mg/kg" />
        </template>
      </el-table-column>
      <el-table-column label="公式表达式" v-if="hasFormula">
        <template #default="{ row }">
          <el-input v-if="row.itemType === 'formula'" v-model="row.formulaExpr" size="small" placeholder="如 C * V / M" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ $index }">
          <el-button type="danger" size="small" @click="removeItem($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="text-right">
      <el-button type="primary" @click="submit">保存模板</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  projectName: '',
  items: []
})

const addItem = () => {
  form.items.push({
    itemKey: '',
    itemLabel: '',
    itemType: 'number',
    unit: '',
    formulaExpr: ''
  })
}

const removeItem = (index) => {
  form.items.splice(index, 1)
}

const hasFormula = computed(() => form.items.some(item => item.itemType === 'formula'))

const submit = () => {
  if (!form.projectName) return ElMessage.error('请输入项目名称')
  for (const item of form.items) {
    if (!item.itemKey || !item.itemLabel) {
      return ElMessage.error('分析项必须填写标识和名称')
    }
    if (item.itemType === 'formula' && !item.formulaExpr) {
      return ElMessage.error(`分析项 ${item.itemKey} 缺少公式表达式`)
    }
  }
  console.log('模板已保存：', JSON.stringify(form, null, 2))
  ElMessage.success('模板保存成功')
}
</script>

<style scoped>
.el-table .el-input {
  width: 100%;
}
</style>
