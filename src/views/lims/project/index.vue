<template>
  <div class="project-page" style="height: calc(100vh - 84px);">
    <div :style="{ height: `${topPaneHeight}%` }">
      <GenericTable ref="tableRef" :columnList="columnList" :buttonlist="buttons" :getDataApi="listProject"
        :updateDataApi="updateProject" storageKey="lims_project_columns" @handleSelectionChange="handleSelectionChange"
        @handleRowClick="handleRowClick" />
    </div>
    <!-- 可拖拽分隔条 -->
    <DraggableDivider mode="horizontal" :initial-position="topPaneHeight"
      @position-change="handleHorizontalDividerChange" />
    <Dialog ref="dialogRef" v-model="open" :title="title" :form="form" :rules="rules" @submit="submitForm"
      @cancel="cancel" />
    <div :style="{ height: `${100 - topPaneHeight}%` }">
      <TestsIndex :projectId="selectedProjectId" :programCode="selectedProgramCode" />
    </div>
  </div>
</template>

<script setup name="Project">
import { getCurrentInstance, reactive, ref, toRefs } from "vue"
import GenericTable from "@/components/GenericTable/GenericTable.vue"
import Dialog from "./dialog.vue"
import TestsIndex from "./components/ProjectTests.vue"
import column from "./column"
import { listProject, getProject, delProject, addProject, updateProject } from "@/api/lims/project"
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import DraggableDivider from '../../../components/DraggableDivider/DraggableDivider.vue'
const handleHorizontalDividerChange = (newPosition) => {
  topPaneHeight.value = newPosition
}
const topPaneHeight = ref(50)
const columnList = column
const tableRef = ref()
const dialogRef = ref()
const { proxy } = getCurrentInstance()
const open = ref(false)
const title = ref("")
const ids = ref([])
const selectedProjectId = ref(null)
const selectedProgramCode = ref(null)

const buttons = [
  {
    label: "新增",
    hasPermi: "lims:project:add",
    icon: "Plus",
    type: "primary",
    onClick: handleAdd
  },
  {
    label: "修改",
    hasPermi: "lims:project:edit",
    icon: "Edit",
    type: "success",
    onClick: handleUpdate,
    disabled: "single"
  },
  {
    label: "删除",
    hasPermi: "lims:project:remove",
    icon: "Delete",
    type: "danger",
    onClick: handleDelete,
    disabled: "multiple"
  },
  {
    label: "导出",
    hasPermi: "lims:project:export",
    icon: "Download",
    type: "warning",
    onClick: handleExport
  }
]

const data = reactive({
  form: {},
  rules: {
    programCode: [
      { required: true, message: "方案代码不能为空", trigger: "blur" }
    ],
  }
})

const { form, rules } = toRefs(data)

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.projectId)
}

function handleRowClick(row) {
  selectedProjectId.value = row.projectId
  selectedProgramCode.value = row.programCode
}

function handleAdd() {
  resetForm()
  title.value = "添加方案"
  open.value = true
}

function handleUpdate(row) {
  const targetId = row?.projectId ?? ids.value[0]
  if (!targetId) {
    proxy?.$modal?.msgWarning?.("请选择需要修改的数据")
    return
  }
  resetForm()
  getProject(targetId).then(response => {
    form.value = response.data
    title.value = "修改方案"
    open.value = true
  })
}

function handleDelete(row) {
  const targetIds = row?.projectId ? [row.projectId] : ids.value
  if (!targetIds || !targetIds.length) {
    proxy?.$modal?.msgWarning?.("请选择要删除的数据")
    return
  }
  proxy.$modal.confirm(`是否确认删除方案编号为"${targetIds}"的数据项？`).then(() => {
    return delProject(targetIds)
  }).then(() => {
    proxy.$modal.msgSuccess("删除成功")
    refreshTable()
  }).catch(() => { })
}

function handleExport() {
  proxy.download("lims/project/export", {}, `project_${new Date().getTime()}.xlsx`)
}

function submitForm() {
  const request = form.value.projectId ? updateProject : addProject
  request(form.value).then(() => {
    proxy.$modal.msgSuccess(form.value.projectId ? "修改成功" : "新增成功")
    open.value = false
    resetForm()
    refreshTable()
  })
}

function cancel() {
  open.value = false
  resetForm()
}

function resetForm() {
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
  dialogRef.value?.resetFields?.()
}

function refreshTable() {
  tableRef.value?.onRefresh?.()
}
</script>
<style lang="scss">
.horizontal-layout {
  @apply flex flex-col h-full;
}

.top-pane,
.bottom-pane {
  @apply bg-white border border-gray-200 rounded p-4 overflow-auto;
}
</style>
