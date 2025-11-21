<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="样品编码" prop="sampleCode">
        <el-input
          v-model="queryParams.sampleCode"
          placeholder="请输入样品编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="样品名称" prop="sampleName">
        <el-input
          v-model="queryParams.sampleName"
          placeholder="请输入样品名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="样品类型ID" prop="sampleTypeId">
        <el-input
          v-model="queryParams.sampleTypeId"
          placeholder="请输入样品类型ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户ID" prop="customerId">
        <el-input
          v-model="queryParams.customerId"
          placeholder="请输入客户ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次号" prop="batchNumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="请输入批次号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产日期" prop="productionDate">
        <el-date-picker clearable
          v-model="queryParams.productionDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择生产日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="有效期至" prop="expiryDate">
        <el-date-picker clearable
          v-model="queryParams.expiryDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择有效期至">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="采样日期" prop="samplingDate">
        <el-date-picker clearable
          v-model="queryParams.samplingDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择采样日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="采样地点" prop="samplingLocation">
        <el-input
          v-model="queryParams.samplingLocation"
          placeholder="请输入采样地点"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="存储位置" prop="storageLocation">
        <el-input
          v-model="queryParams.storageLocation"
          placeholder="请输入存储位置"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

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

    <el-table v-loading="loading" :data="sampleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="样品ID" align="center" prop="sampleId" />
      <el-table-column label="样品编码" align="center" prop="sampleCode" />
      <el-table-column label="样品名称" align="center" prop="sampleName" />
      <el-table-column label="样品类型ID" align="center" prop="sampleTypeId" />
      <el-table-column label="客户ID" align="center" prop="customerId" />
      <el-table-column label="批次号" align="center" prop="batchNumber" />
      <el-table-column label="生产日期" align="center" prop="productionDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.productionDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期至" align="center" prop="expiryDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.expiryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采样日期" align="center" prop="samplingDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.samplingDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采样地点" align="center" prop="samplingLocation" />
      <el-table-column label="样品状态" align="center" prop="sampleStatus" />
      <el-table-column label="存储位置" align="center" prop="storageLocation" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lims:sample:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lims:sample:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
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
  </div>
</template>

<script setup name="Sample">
import { listSample, getSample, delSample, addSample, updateSample } from "@/api/lims/sample"

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

getList()
</script>
