<template>
  <div>
    <GenericTable 
      :columnList="columnList" 
      :buttonlist="buttons" 
      :updateDataApi="updateMethods" 
      :getDataApi="listMethods"
      storageKey="lims_methods"
      @handleSelectionChange="handleSelectionChange" 
      @dataLoaded="onDataLoaded" />
    <Dialog v-model="open" :formData="form" :title="title" @success="handleDialogSuccess"></Dialog>
  </div>
</template>

<script setup name="Methods" lang="ts">
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import GenericTable from '@/components/GenericTable/GenericTable.vue'
import Dialog from './dialog.vue'
import { listMethods, getMethods, delMethods, addMethods, updateMethods } from "@/api/lims/methods"
import column from './column';

const columnList = column;

const onDataLoaded = (data) => {
  console.log('Data loaded:', data);
}

const { proxy } = getCurrentInstance()
const methodsList = ref([])
const open = ref(false)
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const buttons = [
  {
    label: '新增',
    hasPermi: 'lims:methods:add',
    icon: 'Plus',
    type: 'primary',
    onClick: handleAdd
  },
  {
    label: '修改',
    hasPermi: 'lims:methods:edit',
    icon: 'Edit',
    type: 'success',
    onClick: handleUpdate,
    disabled: 'single'
  },
  {
    label: '删除',
    hasPermi: 'lims:methods:remove',
    icon: 'Delete',
    type: 'danger',
    confirm: '确定要删除选中项吗？',
    onClick: handleDelete,
    disabled: 'multiple'
  },
  {
    label: '导出',
    hasPermi: 'lims:methods:export',
    icon: 'Download',
    type: 'warning',
    onClick: handleExport
  }
]

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    originalId: null,
    methodCode: null,
    methodNo: null,
    methodName: null,
    methodNameEng: null,
    methodType: null,
    status: null,
    clause: null,
    clauseName: null,
    clauseNameEng: null,
    isOrders: null,
    methodStatus: null,
    methodStatusValue: null,
    methodDesc: null,
    version: null,
    detectorAndCondition: null,
    eqRemarkAndMethod: null,
    methodOverview: null,
    testExplain: null,
    methodExplain: null,
    consumable: null,
    deptId: null,
  },
  rules: {
    methodCode: [
      { required: true, message: "方法编号不能为空", trigger: "blur" }
    ],
    methodName: [
      { required: true, message: "方法名称不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询测试方法列表 */
function getList() {
  loading.value = true
  listMethods(queryParams.value).then(response => {
    methodsList.value = response.rows
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
    testMethodsId: null,
    originalId: null,
    methodCode: null,
    methodNo: null,
    methodName: null,
    methodNameEng: null,
    methodType: null,
    status: null,
    clause: null,
    clauseName: null,
    clauseNameEng: null,
    isOrders: null,
    methodStatus: null,
    methodStatusValue: null,
    methodDesc: null,
    version: null,
    detectorAndCondition: null,
    eqRemarkAndMethod: null,
    methodOverview: null,
    testExplain: null,
    methodExplain: null,
    consumable: null,
    deptId: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    delFlag: null
  }
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
  ids.value = selection.map(item => item.testMethodsId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加测试方法"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const testMethodsId = row.testMethodsId || ids.value
  getMethods(testMethodsId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改测试方法"
  })
}

/** 对话框成功回调 */
function handleDialogSuccess() {
  getList()
}

/** 删除按钮操作 */
function handleDelete(row) {
  const testMethodsIds = row.testMethodsId || ids.value
  proxy.$modal.confirm('是否确认删除测试方法编号为"' + testMethodsIds + '"的数据项？').then(function () {
    return delMethods(testMethodsIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('lims/methods/export', {
    ...queryParams.value
  }, `methods_${new Date().getTime()}.xlsx`)
}

</script>
