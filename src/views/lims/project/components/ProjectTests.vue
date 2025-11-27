<template>
  <div class="app-container">
    <GenericTable
      ref="tableRef"
      :columnList="columnList"
      :buttonlist="buttons"
      :getDataApi="getData"
      :updateDataApi="updateTests"
      storageKey="lims_tests_columns"
      @handleSelectionChange="handleSelectionChange"
    />
    <Dialog
      ref="dialogRef"
      v-model="open"
      :title="title"
      :form="form"
      :rules="rules"
      @submit="submitForm"
      @cancel="cancel"
    />
  </div>
</template>

<script setup name="Tests">
import { getCurrentInstance, reactive, ref, toRefs, watch } from "vue"
import GenericTable from "@/components/GenericTable/GenericTable.vue"
import Dialog from "./TestsDialog.vue"
import column from "./testsColumn"
import { listSpTests, getSpTests, delSpTests, addSpTests, updateSpTests } from "@/api/lims/sptests"

const props = defineProps({
  programId: {
    type: [Number, String],
    default: null
  },
  projectId: {
    type: [Number, String],
    default: null
  },
  programCode: {
    type: String,
    default: null
  }
})

const columnList = column
const tableRef = ref()
const dialogRef = ref()
const { proxy } = getCurrentInstance()
const open = ref(false)
const title = ref("")
const ids = ref([])

const buttons = [
  {
    label: "新增",
    hasPermi: "lims:sp_tests:add",
    icon: "Plus",
    type: "primary",
    onClick: handleAdd
  },
  {
    label: "修改",
    hasPermi: "lims:sp_tests:edit",
    icon: "Edit",
    type: "success",
    onClick: handleUpdate,
    disabled: "single"
  },
  {
    label: "删除",
    hasPermi: "lims:sp_tests:remove",
    icon: "Delete",
    type: "danger",
    onClick: handleDelete,
    disabled: "multiple"
  },
  {
    label: "导出",
    hasPermi: "lims:sp_tests:export",
    icon: "Download",
    type: "warning",
    onClick: handleExport
  }
]

const data = reactive({
  form: {},
  rules: {
    spCode: [
      { required: true, message: "执行标准代码不能为空", trigger: "blur" }
    ],
    spTestName: [
      { required: true, message: "方案测试名称不能为空", trigger: "blur" }
    ],
  }
})

const { form, rules } = toRefs(data)

function getData(params) {
  const finalParams = { ...params }
  if (props.programCode) {
    finalParams.programCode = props.programCode
  }
  // Keep projectId logic if needed, but prioritize programCode as requested
  if (props.projectId) {
    finalParams.projectId = props.projectId
  }
  return listSpTests(finalParams)
}

// Watchers
watch(() => props.programCode, (newVal) => {
  if (newVal) refreshTable()
  else refreshTable()
})
watch(() => props.projectId, (newVal) => {
  if (newVal) refreshTable()
  else refreshTable()
})

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.spTestsId)
}

function handleAdd() {
  resetForm()
  // Pre-fill programCode if available
  if (props.programCode) {
    form.value.programCode = props.programCode
  }
  if (props.projectId) {
    form.value.projectId = props.projectId
  }
  title.value = "添加方案项目"
  open.value = true
}

function handleUpdate(row) {
  const targetId = row?.spTestsId ?? ids.value[0]
  if (!targetId) {
    proxy?.$modal?.msgWarning?.("请选择需要修改的数据")
    return
  }
  resetForm()
  getSpTests(targetId).then(response => {
    form.value = response.data
    title.value = "修改方案项目"
    open.value = true
  })
}

function handleDelete(row) {
  const targetIds = row?.spTestsId ? [row.spTestsId] : ids.value
  if (!targetIds || !targetIds.length) {
    proxy?.$modal?.msgWarning?.("请选择要删除的数据")
    return
  }
  proxy.$modal.confirm(`是否确认删除方案项目编号为"${targetIds}"的数据项？`).then(() => {
    return delSpTests(targetIds)
  }).then(() => {
    proxy.$modal.msgSuccess("删除成功")
    refreshTable()
  }).catch(() => {})
}

function handleExport() {
  proxy.download("lims/sp_tests/export", {
    programCode: props.programCode,
    projectId: props.projectId
  }, `sp_tests_${new Date().getTime()}.xlsx`)
}

function submitForm() {
  const request = form.value.spTestsId ? updateSpTests : addSpTests
  request(form.value).then(() => {
    proxy.$modal.msgSuccess(form.value.spTestsId ? "修改成功" : "新增成功")
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
    spTestsId: null,
    originalId: null,
    testsId: null,
    sampleProgramsId: null,
    projectId: props.projectId || null,
    spCode: null,
    spTestName: null,
    testName: null,
    testAlias: null,
    specialTestName: null,
    testCateId: null,
    testType: null,
    profileType: null,
    programCode: props.programCode || null,
    qty: null,
    qtyUnits: null,
    price: null,
    addPrice: null,
    priceUnits: null,
    criterion: null,
    testCriterion: null,
    evaluateRule: null,
    copNo: null,
    lowA: null,
    highA: null,
    highAUnit: null,
    units: null,
    charLimits: null,
    dataReference: null,
    status: null,
    isRetire: null,
    isMainPro: null,
    freezeFlag: null,
    defaultTest: null,
    auditFlag: null,
    auditLevel: null,
    rowAudit: null,
    dispStatus: null,
    reportType: null,
    reportRemark: null,
    drawPlan: null,
    dept: null,
    ccId: null,
    submitCorp: null,
    specialGroupName: null,
    mainGroupZum: null,
    groupNums: null,
    startUseDate: null,
    expirationDate: null,
    version: null,
    profile: null,
    explainDesc: null,
    comments: null,
    specAnalytesComments: null,
    workflowId: null,
    sorter: null,
    recorderDesc: null,
    auditorCode: null,
    auditorDesc: null,
    auditTime: null,
    freezerCode: null,
    freezerDesc: null,
    freezeTime: null,
    remark: null
  }
  dialogRef.value?.resetFields?.()
}

function refreshTable() {
  tableRef.value?.onRefresh?.()
}
</script>
