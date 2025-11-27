<template>
  <div class="programs-page">
    <GenericTable
      ref="tableRef"
      :columnList="columnList"
      :buttonlist="buttons"
      :getDataApi="listPrograms"
      :updateDataApi="updatePrograms"
      storageKey="lims_programs_columns"
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

<script setup name="Programs">
import { getCurrentInstance, reactive, ref, toRefs } from "vue"
import GenericTable from "@/components/GenericTable/GenericTable.vue"
import Dialog from "./dialog.vue"
import column from "./column"
import { listPrograms, getPrograms, delPrograms, addPrograms, updatePrograms } from "@/api/lims/programs"

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
    hasPermi: "lims:programs:add",
    icon: "Plus",
    type: "primary",
    onClick: handleAdd
  },
  {
    label: "修改",
    hasPermi: "lims:programs:edit",
    icon: "Edit",
    type: "success",
    onClick: handleUpdate,
    disabled: "single"
  },
  {
    label: "删除",
    hasPermi: "lims:programs:remove",
    icon: "Delete",
    type: "danger",
    onClick: handleDelete,
    disabled: "multiple"
  },
  {
    label: "导出",
    hasPermi: "lims:programs:export",
    icon: "Download",
    type: "warning",
    onClick: handleExport
  }
]

const data = reactive({
  form: getDefaultForm(),
  rules: {
    spCode: [
      { required: true, message: "执行标准编号不能为空", trigger: "blur" }
    ]
  }
})

const { form, rules } = toRefs(data)

function getDefaultForm() {
  return {
    sampleProgramsId: null,
    originalId: null,
    spCode: null,
    spCodeAlt: null,
    testRules: null,
    criterionId: null,
    version: null,
    domainId: null,
    domainName: null,
    sampleType: null,
    fullType: null,
    detailName: null,
    status: null,
    freezeFlag: null,
    isCal: null,
    dispStatus: null,
    freezeBy: null,
    freezerDesc: null,
    freezeTime: null,
    recorderDesc: null,
    createrDesc: null,
    createrCode: null,
    createrDate: null,
    startTime: null,
    sorter: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    delFlag: null
  }
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.sampleProgramsId)
}

function handleAdd() {
  resetForm()
  title.value = "添加执行标准"
  open.value = true
}

function handleUpdate(row) {
  const targetId = row?.sampleProgramsId ?? ids.value[0]
  if (!targetId) {
    proxy?.$modal?.msgWarning?.("请选择需要修改的数据")
    return
  }
  resetForm()
  getPrograms(targetId).then(response => {
    form.value = { ...getDefaultForm(), ...(response.data || {}) }
    title.value = "修改执行标准"
    open.value = true
  })
}

function handleDelete(row) {
  const targetIds = row?.sampleProgramsId ? [row.sampleProgramsId] : ids.value
  if (!targetIds || !targetIds.length) {
    proxy?.$modal?.msgWarning?.("请选择要删除的数据")
    return
  }
  proxy.$modal.confirm(`是否确认删除执行标准编号为"${targetIds}"的数据项？`).then(() => {
    return delPrograms(Array.isArray(targetIds) ? targetIds.join(",") : targetIds)
  }).then(() => {
    proxy.$modal.msgSuccess("删除成功")
    refreshTable()
  }).catch(() => {})
}

function handleExport() {
  proxy.download("lims/programs/export", {}, `programs_${new Date().getTime()}.xlsx`)
}

function submitForm() {
  const request = form.value.sampleProgramsId ? updatePrograms : addPrograms
  request(form.value).then(() => {
    proxy.$modal.msgSuccess(form.value.sampleProgramsId ? "修改成功" : "新增成功")
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
  form.value = getDefaultForm()
  dialogRef.value?.resetFields?.()
}

function refreshTable() {
  tableRef.value?.onRefresh?.()
}
</script>
