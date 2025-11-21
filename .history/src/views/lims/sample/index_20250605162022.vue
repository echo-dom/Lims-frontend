<template>
  <div class="app-container">
    <el-form ref="formRef" :model="formData" label-width="120px">
      <!-- 样品基本信息 -->
      <el-card header="样品基本信息">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="formData.productName" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产批号" prop="batchNo">
              <el-input v-model="formData.batchNo" placeholder="扫描或输入批号">
                <template #append>
                  <el-icon @click="handleScanBatch"><Camera /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 生产日期和保质期 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="生产日期" prop="productionDate">
              <el-date-picker
                v-model="formData.productionDate"
                type="date"
                placeholder="选择生产日期"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保质期" prop="expirationDate">
              <el-date-picker
                v-model="formData.expirationDate"
                type="date"
                placeholder="选择保质期"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 检测项目 -->
      <el-card header="检测项目" class="mt-20">
        <el-button type="primary" @click="addTestItem">添加检测项目</el-button>
        
        <el-table :data="formData.testItems" border class="mt-10">
          <el-table-column label="检测项目" width="200">
            <template #default="{ row, $index }">
              <el-select 
                v-model="row.testItem" 
                filterable
                placeholder="请选择检测项目"
                @change="item => handleTestItemChange(item, $index)"
              >
                <el-option
                  v-for="item in testItemOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="检测标准" prop="standardName" />
          <el-table-column label="限量值" prop="limitValue" width="120" />
          <el-table-column label="操作" width="80">
            <template #default="{ $index }">
              <el-button type="danger" icon="Delete" @click="removeTestItem($index)" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 提交按钮 -->
      <div class="mt-20">
        <el-button type="primary" @click="submitForm">提交登记</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Camera } from '@element-plus/icons-vue'
import { getTestItems } from '@/api/lims/standard'
import { registerSample } from '@/api/lims/sample'

const formRef = ref(null)
const testItemOptions = ref([])

const formData = reactive({
  productName: '',
  batchNo: '',
  productionDate: '',
  expirationDate: '',
  storageCondition: '常温',
  testItems: [
    { testItem: '', standardId: null, standardName: '', limitValue: '' }
  ]
})

// 加载检测项目选项
onMounted(async () => {
  const res = await getTestItems()
  testItemOptions.value = res.data.map(item => ({
    value: item.itemCode,
    label: item.itemName,
    standardId: item.standardId,
    limitValue: item.limitValue
  }))
})

// 处理检测项目选择
const handleTestItemChange = (itemCode, index) => {
  const selected = testItemOptions.value.find(item => item.value === itemCode)
  if (selected) {
    formData.testItems[index] = {
      testItem: selected.value,
      standardId: selected.standardId,
      standardName: selected.label,
      limitValue: selected.limitValue
    }
  }
}

// 提交表单
const submitForm = async () => {
  await formRef.value.validate()
  const { data } = await registerSample(formData)
  ElMessage.success(`样品登记成功！样品编号：${data}`)
  // 打印条码
  printSampleBarcode(data)
}
</script>