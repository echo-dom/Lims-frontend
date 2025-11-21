<template>
  <div>
    <GenericTable :columnList="columnList" :buttonlist="buttons" :updateDataApi="updateSample" :getDataApi="listSample"
      @handleSelectionChange="handleSelectionChange" @dataLoaded="onDataLoaded" />
    <el-dialog v-model="open"  width="80%" height="80%"  fullscreen >
      <template #header>
        
      </template>
      <div  >
        <!-- 表单头部 -->
        
       

      </div>
      <!-- <SampleDetectionForm></SampleDetectionForm> -->
      <template #footer>
        <!-- 状态提示 -->
        <!-- 表单操作按钮 -->
        <div style="display: flex;justify-content: center;align-items: center;border-top: 1px solid #eee;">
          <el-button type="primary" @click="submitForm1"
            class="px-8 py-3 rounded-xl shadow-lg bg-gradient-to-r from-form to-blue-700 hover:opacity-90 transition-all">
            <i class="fas fa-paper-plane mr-2"></i>提交检测申请
          </el-button>
          <el-button @click="resetForm" class="px-8 py-3 rounded-xl border border-gray-300 hover:bg-gray-50">
            <i class="fas fa-redo mr-2"></i>重置表单
          </el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="Sample">
import GenericTable from '@/components/GenericTable/GenericTable.vue'
import { listSample, getSample, delSample, addSample, updateSample } from "@/api/lims/sample"
import SampleDetectionForm from '@/components/Form/SampleDetectionForm.vue'
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


import { ElMessage } from 'element-plus'

const sampleForm = ref(null)
const formData = ref({
  name: '',
  code: 'LAB-' + new Date().getTime().toString().slice(-6),
  type: '',
  quantity: null,
  unit: 'g',
  submitDate: '',
  expectedDate: '',
  tests: [],
  standard: '',
  method: '',
  urgency: 'normal',
  remarks: '',
  attachments: []
})

// 验证规则
const rules1 = {
  name: [
    { required: true, message: '请输入样品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择样品类型', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入样品数量', trigger: 'blur' },
    { type: 'number', message: '数量必须为数字', trigger: 'blur' },
    { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }
  ],
  submitDate: [
    { required: true, message: '请选择送样日期', trigger: 'change' }
  ],
  expectedDate: [
    {
      required: true,
      message: '请选择期望完成日期',
      trigger: 'change'
    },
    // 防止期望完成早于送样日期
    {
      validator: (rule, value, callback) => {
        if (
          value &&
          formData.value.submitDate &&
          new Date(value) < new Date(formData.value.submitDate)
        ) {
          callback(new Error('期望完成日期不能早于送样日期'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  tests: [
    { required: true, message: '请至少选择一个检测项目', trigger: 'change' }
  ],
  standard: [
    { required: true, message: '请选择检测标准', trigger: 'change' }
  ],
  method: [
    { required: true, message: '请选择检测方法', trigger: 'change' }
  ]
}

// 处理文件变化
const handleFileChange = (file, fileList) => {
  formData.value.attachments = fileList
}
const handleFileRemove = (file, fileList) => {
  formData.value.attachments = fileList
}

// 提交表单
const submitForm = () => {
  sampleForm.value.validate(valid => {
    if (valid) {
      // 在此处调用后端 API 创建检测申请
      // 例如：await api.addSample(formData.value)
      // 这里只做模拟
      setTimeout(() => {
        ElMessage.success({
          message: '样品检测申请提交成功！',
          duration: 3000,
          showClose: true
        })
        resetForm()
      }, 800)
    } else {
      ElMessage.error('请检查表单输入')
      return false
    }
  })
}

// 重置表单
const resetForm = () => {
  sampleForm.value.resetFields()
  formData.value.code = 'LAB-' + new Date().getTime().toString().slice(-6)
  formData.value.attachments = []
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