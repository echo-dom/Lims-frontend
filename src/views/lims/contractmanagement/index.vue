<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="合同编号" prop="contractcode">
        <el-input
          v-model="queryParams.contractcode"
          placeholder="请输入合同编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户编号" prop="customercode">
        <el-input
          v-model="queryParams.customercode"
          placeholder="请输入客户编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customername">
        <el-input
          v-model="queryParams.customername"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人名称" prop="createrdesc">
        <el-input
          v-model="queryParams.createrdesc"
          placeholder="请输入创建人名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人工号" prop="creatercode">
        <el-input
          v-model="queryParams.creatercode"
          placeholder="请输入创建人工号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createrdate">
        <el-date-picker clearable
          v-model="queryParams.createrdate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="合同名称" prop="contractname">
        <el-input
          v-model="queryParams.contractname"
          placeholder="请输入合同名称"
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
          v-hasPermi="['lims:contractmanagement:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['lims:contractmanagement:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['lims:contractmanagement:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['lims:contractmanagement:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contractmanagementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="合同ID" align="center" prop="contractid" />
      <el-table-column label="合同编号" align="center" prop="contractcode" />
      <el-table-column label="客户编号" align="center" prop="customercode" />
      <el-table-column label="客户名称" align="center" prop="customername" />
      <el-table-column label="创建人名称" align="center" prop="createrdesc" />
      <el-table-column label="创建人工号" align="center" prop="creatercode" />
      <el-table-column label="创建时间" align="center" prop="createrdate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createrdate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同名称" align="center" prop="contractname" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lims:contractmanagement:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lims:contractmanagement:remove']">删除</el-button>
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

    <!-- 添加或修改合同管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="contractmanagementRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="合同编号" prop="contractcode">
          <el-input v-model="form.contractcode" placeholder="请输入合同编号" />
        </el-form-item>
        <el-form-item label="客户编号" prop="customercode">
          <el-input v-model="form.customercode" placeholder="请输入客户编号" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customername">
          <el-input v-model="form.customername" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="创建人名称" prop="createrdesc">
          <el-input v-model="form.createrdesc" placeholder="请输入创建人名称" />
        </el-form-item>
        <el-form-item label="创建人工号" prop="creatercode">
          <el-input v-model="form.creatercode" placeholder="请输入创建人工号" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createrdate">
          <el-date-picker clearable
            v-model="form.createrdate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同名称" prop="contractname">
          <el-input v-model="form.contractname" placeholder="请输入合同名称" />
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

<script setup name="Contractmanagement">
import { listContractmanagement, getContractmanagement, delContractmanagement, addContractmanagement, updateContractmanagement } from "@/api/lims/contractmanagement"

const { proxy } = getCurrentInstance()

const contractmanagementList = ref([])
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
    contractcode: null,
    customercode: null,
    customername: null,
    createrdesc: null,
    creatercode: null,
    createrdate: null,
    contractname: null
  },
  rules: {
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询合同管理列表 */
function getList() {
  loading.value = true
  listContractmanagement(queryParams.value).then(response => {
    contractmanagementList.value = response.rows
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
    contractid: null,
    contractcode: null,
    customercode: null,
    customername: null,
    createrdesc: null,
    creatercode: null,
    createrdate: null,
    contractname: null
  }
  proxy.resetForm("contractmanagementRef")
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
  ids.value = selection.map(item => item.contractid)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加合同管理"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _contractid = row.contractid || ids.value
  getContractmanagement(_contractid).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改合同管理"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["contractmanagementRef"].validate(valid => {
    if (valid) {
      if (form.value.contractid != null) {
        updateContractmanagement(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addContractmanagement(form.value).then(response => {
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
  const _contractids = row.contractid || ids.value
  proxy.$modal.confirm('是否确认删除合同管理编号为"' + _contractids + '"的数据项？').then(function() {
    return delContractmanagement(_contractids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('lims/contractmanagement/export', {
    ...queryParams.value
  }, `contractmanagement_${new Date().getTime()}.xlsx`)
}

getList()
</script>
