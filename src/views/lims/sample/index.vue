<template>
  <div>
    <GenericTable :columnList="columnList" :buttonlist="buttons" :updateDataApi="updateSample" :getDataApi="listSample"
      @handleSelectionChange="handleSelectionChange" @dataLoaded="onDataLoaded" />
    <Dialog v-model="open" @success="getList"></Dialog>
  </div>
</template>

<script setup name="Sample" lang="ts">
import GenericTable from '@/components/GenericTable/GenericTable.vue'
import Dialog from './dialog.vue'
import { listSample, getSample, delSample, addSample, updateSample } from "@/api/lims/sample"
import { onMounted, ref, reactive, toRefs, watch, getCurrentInstance } from 'vue'
import column from './column';
import { ElMessage } from 'element-plus'

const columnList = ref(column);
const { proxy } = getCurrentInstance()
const { task_status, lims_sample_status } = proxy.useDict("task_status", "lims_sample_status");

watch(() => task_status.value, (val) => {
    const col = columnList.value.find(c => c.prop === 'taskStatus');
    if (col) {
        col.editType = 'select';
        col.options = val.map(d => ({ label: d.label, value: d.value }));
    }
}, { immediate: true });

watch(() => lims_sample_status.value, (val) => {
    const col = columnList.value.find(c => c.prop === 'sampleStatus');
    if (col) {
        col.editType = 'select';
        col.options = val.map(d => ({ label: d.label, value: d.value }));
    }
}, { immediate: true });

const onDataLoaded = (data) => {
  console.log('Data loaded:', data);
}

const sampleList = ref([])
const open = ref(false)
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const sampleForm = ref(null)

const buttons = [
  {
    label: '新增',
    hasPermi: 'lims:sample:add',
    icon: 'Plus',
    type: 'primary',
    onClick: handleAdd
  },
  {
    label: '修改',
    hasPermi: 'lims:sample:edit',
    icon: 'Edit',
    type: 'success',
    onClick: handleUpdate,
    disabled: 'single'
  },
  {
    label: '删除',
    hasPermi: 'lims:sample:remove',
    icon: 'Delete',
    type: 'danger',
    confirm: '确定要删除选中项吗？',
    onClick: handleDelete,
    disabled: 'multiple'
  },
  {
    label: '导出',
    hasPermi: 'lims:sample:export',
    icon: 'Download',
    type: 'warning',
    onClick: handleExport
    // disabled: true,
    // tooltip: '暂无数据可导出'
  }
]

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
function submitForm1() {
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
  proxy.$modal.confirm('是否确认删除LIMS样品编号为"' + _sampleIds + '"的数据项？').then(function () {
    return delSample(_sampleIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => { })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('lims/sample/export', {
    ...queryParams.value
  }, `sample_${new Date().getTime()}.xlsx`)
}
</script>

<style scoped>
.form-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
}

.form-header {
  background: linear-gradient(90deg, #5D8CAE 0%, #3A6B8F 100%);
  margin: 0;
  padding: calc(var(--spacing) * 3);
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.form-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(211, 220, 230, 0.6);
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.sample-icon {
  background: linear-gradient(135deg, #5D8CAE 0%, #3A6B8F 100%);
}

.items-center {
  align-items: center;
}

.text-form {
  --tw-text-opacity: 1;
  color: rgb(93 140 174 / var(--tw-text-opacity, 1));
}
</style>