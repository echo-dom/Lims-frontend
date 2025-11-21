<template>
  <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['lims:sample:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['lims:sample:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['lims:sample:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['lims:sample:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <GenericTable 
        :columnList="columnList"
        :getDataApi="listSample"
        @dataLoaded="onDataLoaded"
    />
    <!-- 添加或修改LIMS样品对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="sampleRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="样品编码" prop="sampleCode">
          <el-input v-model="form.sampleCode" placeholder="请输入样品编码" />
        </el-form-item>
        <el-form-item label="样品名称" prop="sampleName">
          <el-input v-model="form.sampleName" placeholder="请输入样品名称" />
        </el-form-item>
        <el-form-item label="样品类型ID" prop="sampleTypeId">
          <el-input v-model="form.sampleTypeId" placeholder="请输入样品类型ID" />
        </el-form-item>
        <el-form-item label="客户ID" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户ID" />
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber">
          <el-input v-model="form.batchNumber" placeholder="请输入批次号" />
        </el-form-item>
        <el-form-item label="生产日期" prop="productionDate">
          <el-date-picker clearable
            v-model="form.productionDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择生产日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有效期至" prop="expiryDate">
          <el-date-picker clearable
            v-model="form.expiryDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择有效期至">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="采样日期" prop="samplingDate">
          <el-date-picker clearable
            v-model="form.samplingDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择采样日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="采样地点" prop="samplingLocation">
          <el-input v-model="form.samplingLocation" placeholder="请输入采样地点" />
        </el-form-item>
        <el-form-item label="存储位置" prop="storageLocation">
          <el-input v-model="form.storageLocation" placeholder="请输入存储位置" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
</template>

<script  setup name="Sample">
import GenericTable from '@/components/GenericTable/GenericTable.vue'
import { listSample, getSample, delSample, addSample, updateSample } from "@/api/lims/sample"

import column from './column';

const columnList = column;

const onDataLoaded = (data) => {
    console.log('Data loaded:', data);
}

const { proxy } = getCurrentInstance()

const sampleList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    sampleCode: null,
    sampleName: null,
    sampleTypeId: null,
    customerId: null,
    batchNumber: null,
    productionDate: null,
    expiryDate: null,
    samplingDate: null,
    samplingLocation: null,
    sampleStatus: null,
    storageLocation: null,
  },
  rules: {
    sampleCode: [
      { required: true, message: "样品编码不能为空", trigger: "blur" }
    ],
    sampleName: [
      { required: true, message: "样品名称不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询LIMS样品列表 */
function getList() {
  loading.value = true
  listSample(queryParams.value).then(response => {
    sampleList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    sampleId: null,
    sampleCode: null,
    sampleName: null,
    sampleTypeId: null,
    customerId: null,
    batchNumber: null,
    productionDate: null,
    expiryDate: null,
    samplingDate: null,
    samplingLocation: null,
    sampleStatus: null,
    storageLocation: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("sampleRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.sampleId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加LIMS样品"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _sampleId = row.sampleId || ids.value
  getSample(_sampleId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改LIMS样品"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sampleRef"].validate(valid => {
    if (valid) {
      if (form.value.sampleId != null) {
        updateSample(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSample(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _sampleIds = row.sampleId || ids.value
  proxy.$modal.confirm('是否确认删除LIMS样品编号为"' + _sampleIds + '"的数据项？').then(function() {
    return delSample(_sampleIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('lims/sample/export', {
    ...queryParams.value
  }, `sample_${new Date().getTime()}.xlsx`)
}

</script>