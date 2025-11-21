<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="原系统ID" prop="originalId">
        <el-input
          v-model="queryParams.originalId"
          placeholder="请输入原系统ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="方案代码" prop="programCode">
        <el-input
          v-model="queryParams.programCode"
          placeholder="请输入方案代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主项目数" prop="mainProNum">
        <el-input
          v-model="queryParams.mainProNum"
          placeholder="请输入主项目数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="启用日期" prop="startUseDate">
        <el-date-picker clearable
          v-model="queryParams.startUseDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择启用日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="到期日期" prop="expirationDate">
        <el-date-picker clearable
          v-model="queryParams.expirationDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择到期日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="行审核状态" prop="rowAudit">
        <el-input
          v-model="queryParams.rowAudit"
          placeholder="请输入行审核状态"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="价格" prop="mPrice">
        <el-input
          v-model="queryParams.mPrice"
          placeholder="请输入价格"
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
          v-hasPermi="['lims:project:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['lims:project:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['lims:project:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['lims:project:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="projectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="projectId" />
      <el-table-column label="原系统ID" align="center" prop="originalId" />
      <el-table-column label="方案代码" align="center" prop="programCode" />
      <el-table-column label="方案类型" align="center" prop="profileType" />
      <el-table-column label="方案名称" align="center" prop="profile" />
      <el-table-column label="主项目数" align="center" prop="mainProNum" />
      <el-table-column label="启用日期" align="center" prop="startUseDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startUseDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期日期" align="center" prop="expirationDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.expirationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="显示状态" align="center" prop="dispStatus" />
      <el-table-column label="行审核状态" align="center" prop="rowAudit" />
      <el-table-column label="价格" align="center" prop="mPrice" />
      <el-table-column label="方案说明" align="center" prop="explainDesc" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lims:project:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lims:project:remove']">删除</el-button>
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

    <!-- 添加或修改方案对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="projectRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="原系统ID" prop="originalId">
          <el-input v-model="form.originalId" placeholder="请输入原系统ID" />
        </el-form-item>
        <el-form-item label="方案代码" prop="programCode">
          <el-input v-model="form.programCode" placeholder="请输入方案代码" />
        </el-form-item>
        <el-form-item label="方案名称" prop="profile">
          <file-upload v-model="form.profile"/>
        </el-form-item>
        <el-form-item label="主项目数" prop="mainProNum">
          <el-input v-model="form.mainProNum" placeholder="请输入主项目数" />
        </el-form-item>
        <el-form-item label="启用日期" prop="startUseDate">
          <el-date-picker clearable
            v-model="form.startUseDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择启用日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期日期" prop="expirationDate">
          <el-date-picker clearable
            v-model="form.expirationDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择到期日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="行审核状态" prop="rowAudit">
          <el-input v-model="form.rowAudit" placeholder="请输入行审核状态" />
        </el-form-item>
        <el-form-item label="价格" prop="mPrice">
          <el-input v-model="form.mPrice" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="方案说明" prop="explainDesc">
          <el-input v-model="form.explainDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
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

<script setup name="Project">
import { listProject, getProject, delProject, addProject, updateProject } from "@/api/lims/project"

const { proxy } = getCurrentInstance()

const projectList = ref([])
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
    originalId: null,
    programCode: null,
    profileType: null,
    profile: null,
    mainProNum: null,
    startUseDate: null,
    expirationDate: null,
    status: null,
    dispStatus: null,
    rowAudit: null,
    mPrice: null,
    explainDesc: null,
  },
  rules: {
    programCode: [
      { required: true, message: "方案代码不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询方案列表 */
function getList() {
  loading.value = true
  listProject(queryParams.value).then(response => {
    projectList.value = response.rows
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
    projectId: null,
    originalId: null,
    programCode: null,
    profileType: null,
    profile: null,
    mainProNum: null,
    startUseDate: null,
    expirationDate: null,
    status: null,
    dispStatus: null,
    rowAudit: null,
    mPrice: null,
    explainDesc: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    delFlag: null
  }
  proxy.resetForm("projectRef")
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
  ids.value = selection.map(item => item.projectId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加方案"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _projectId = row.projectId || ids.value
  getProject(_projectId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改方案"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["projectRef"].validate(valid => {
    if (valid) {
      if (form.value.projectId != null) {
        updateProject(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addProject(form.value).then(response => {
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
  const _projectIds = row.projectId || ids.value
  proxy.$modal.confirm('是否确认删除方案编号为"' + _projectIds + '"的数据项？').then(function() {
    return delProject(_projectIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('lims/project/export', {
    ...queryParams.value
  }, `project_${new Date().getTime()}.xlsx`)
}

getList()
</script>
