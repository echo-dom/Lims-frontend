<template>
  <div>
    <GenericTable :columnList="columnList" :buttonlist="buttons" :updateDataApi="updateSample" :getDataApi="listSample"
      @handleSelectionChange="handleSelectionChange" @dataLoaded="onDataLoaded" />
    <el-dialog v-model="open" title="新增样品" width="80%" height="80%"  fullscreen >
      <template #header>
        <!-- 表单标题和说明 -->
        <div class="text-center mb-10">
          <h1 class="text-3xl font-bold text-gray-800 mb-3">样品检测新增表单</h1>
          <p class="text-gray-600 max-w-2xl mx-auto">
            请填写样品信息及检测要求，带<span class="text-red-500">*</span>的为必填项
          </p>
        </div>
      </template>
      <el-scrollbar>
      <div style="height: 70vh;" class="form-card bg-white rounded-2xl  form-container">
        <!-- 表单头部 -->
        <div class="form-header p-6 flex items-center">
          <div class="sample-icon w-14 h-14 rounded-xl flex items-center justify-center mr-4">
            <i class="fas fa-flask text-white text-2xl"></i>
          </div>
          <div>
            <div class="text-xl font-bold text-white">新增检测样品</div>
            <p class="text-blue-100 mt-1">实验室样品管理系统</p>
          </div>
        </div>
        <!-- 表单内容 -->
        <div class="p-6 md:p-8">
          <el-form ref="sampleForm" :model="formData" :rules="rules1" label-width="120px" class="space-y-6">
            <!-- 样品基本信息 -->
            <div class="border-b border-gray-200 pb-6">
              <div class="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                <i class="fas fa-vial text-form mr-2"></i> 样品基本信息
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 样品名称 -->
                <el-form-item label="样品名称" prop="name" class="m-0">
                  <el-input v-model="formData.name" placeholder="请输入样品名称" class="rounded-lg">
                    <template #prefix>
                      <i class="el-icon-box text-gray-400"></i>
                    </template>
                  </el-input>
                </el-form-item>
                <!-- 样品编号 -->
                <el-form-item label="样品编号" prop="code" class="m-0">
                  <el-input v-model="formData.code" placeholder="系统自动生成" disabled class="rounded-lg bg-gray-100">
                    <template #prefix>
                      <i class="el-icon-document text-gray-400"></i>
                    </template>
                  </el-input>
                </el-form-item>
                <!-- 样品类型 -->
                <el-form-item label="样品类型" prop="type" class="m-0">
                  <el-select v-model="formData.type" placeholder="请选择样品类型" class="w-full rounded-lg">
                    <el-option label="固体" value="solid" />
                    <el-option label="液体" value="liquid" />
                    <el-option label="气体" value="gas" />
                    <el-option label="粉末" value="powder" />
                    <el-option label="其他" value="other" />
                  </el-select>
                </el-form-item>
                <!-- 样品数量 -->
                <el-form-item label="样品数量" prop="quantity" class="m-0">
                  <el-input v-model.number="formData.quantity" placeholder="请输入样品数量" class="rounded-lg">
                    <template #prefix>
                      <i class="el-icon-s-data text-gray-400"></i>
                    </template>
                    <template #append>
                      <div class="w-20">
                        <el-select v-model="formData.unit" class="w-full">
                          <el-option label="克" value="g" />
                          <el-option label="毫升" value="ml" />
                          <el-option label="件" value="pcs" />
                        </el-select>
                      </div>
                    </template>
                  </el-input>
                </el-form-item>
                <!-- 送样日期 -->
                <el-form-item label="送样日期" prop="submitDate" class="m-0">
                  <el-date-picker v-model="formData.submitDate" type="date" placeholder="请选择送样日期"
                    class="w-full rounded-lg" />
                </el-form-item>
                <!-- 期望完成日期 -->
                <el-form-item label="期望完成日期" prop="expectedDate" class="m-0">
                  <el-date-picker v-model="formData.expectedDate" type="date" placeholder="请选择期望完成日期"
                    class="w-full rounded-lg" />
                </el-form-item>
              </div>
            </div>
            <!-- 检测要求 -->
            <div class="border-b border-gray-200 pb-6">
              <div class="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                <i class="fas fa-microscope text-form mr-2"></i> 检测要求
              </div>
              <!-- 检测项目 -->
              <el-form-item label="检测项目" prop="tests" class="mb-6">
                <el-checkbox-group v-model="formData.tests" class="flex flex-wrap gap-4">
                  <el-checkbox label="ph值检测" class="!m-0">
                    <div class="p-3 border border-gray-200 rounded-lg transition-all hover:border-primary">
                      <div class="font-semibold">pH值检测</div>
                      <div class="text-xs text-gray-500 mt-1">酸碱度测定</div>
                    </div>
                  </el-checkbox>
                  <el-checkbox label="重金属检测" class="!m-0">
                    <div class="p-3 border border-gray-200 rounded-lg transition-all hover:border-primary">
                      <div class="font-semibold">重金属检测</div>
                      <div class="text-xs text-gray-500 mt-1">铅、汞等含量</div>
                    </div>
                  </el-checkbox>
                  <el-checkbox label="微生物检测" class="!m-0">
                    <div class="p-3 border border-gray-200 rounded-lg transition-all hover:border-primary">
                      <div class="font-semibold">微生物检测</div>
                      <div class="text-xs text-gray-500 mt-1">菌落总数等</div>
                    </div>
                  </el-checkbox>
                  <el-checkbox label="成分分析" class="!m-0">
                    <div class="p-3 border border-gray-200 rounded-lg transition-all hover:border-primary">
                      <div class="font-semibold">成分分析</div>
                      <div class="text-xs text-gray-500 mt-1">主要成分及含量</div>
                    </div>
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 检测标准 -->
                <el-form-item label="检测标准" prop="standard" class="m-0">
                  <el-select v-model="formData.standard" placeholder="请选择检测标准" class="w-full rounded-lg">
                    <el-option label="GB 标准" value="gb" />
                    <el-option label="ISO 标准" value="iso" />
                    <el-option label="ASTM 标准" value="astm" />
                    <el-option label="企业标准" value="enterprise" />
                    <el-option label="其他标准" value="other" />
                  </el-select>
                </el-form-item>
                <!-- 检测方法 -->
                <el-form-item label="检测方法" prop="method" class="m-0">
                  <el-select v-model="formData.method" placeholder="请选择检测方法" class="w-full rounded-lg">
                    <el-option label="光谱分析法" value="spectrum" />
                    <el-option label="色谱分析法" value="chromatography" />
                    <el-option label="质谱分析法" value="mass" />
                    <el-option label="电化学法" value="electrochemistry" />
                  </el-select>
                </el-form-item>
                <!-- 紧急程度 -->
                <el-form-item label="紧急程度" prop="urgency" class="m-0">
                  <el-radio-group v-model="formData.urgency" class="flex flex-wrap gap-4">
                    <el-radio label="normal" class="!m-0">
                      <div class="p-3 border border-gray-200 rounded-lg transition-all hover:border-green-500">
                        <div class="font-semibold">普通</div>
                        <div class="text-xs text-gray-500 mt-1">5-7个工作日</div>
                      </div>
                    </el-radio>
                    <el-radio label="urgent" class="!m-0">
                      <div class="p-3 border border-gray-200 rounded-lg transition-all hover:border-yellow-500">
                        <div class="font-semibold">加急</div>
                        <div class="text-xs text-gray-500 mt-1">3-5个工作日</div>
                      </div>
                    </el-radio>
                    <el-radio label="emergency" class="!m-0">
                      <div class="p-3 border border-gray-200 rounded-lg transition-all hover:border-red-500">
                        <div class="font-semibold">特急</div>
                        <div class="text-xs text-gray-500 mt-1">1-3个工作日</div>
                      </div>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <!-- 其他信息 -->
            <div>
              <div class="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                <i class="fas fa-file-alt text-form mr-2"></i> 其他信息
              </div>
              <!-- 备注 -->
              <el-form-item label="备注" prop="remarks" class="m-0">
                <el-input v-model="formData.remarks" type="textarea" :rows="4" placeholder="请输入样品特殊要求或其他说明"
                  class="rounded-lg" />
              </el-form-item>
              <!-- 附件上传 -->
              <el-form-item label="相关附件" prop="attachments" class="mt-6">
                <el-upload action="#" multiple :on-change="handleFileChange" :on-remove="handleFileRemove"
                  :file-list="formData.attachments" :auto-upload="false" class="w-full">
                  <el-button type="primary" class="rounded-lg">
                    <i class="el-icon-upload mr-2"></i>上传文件
                  </el-button>
                  <template #tip>
                    <div class="el-upload__tip text-xs text-gray-500 mt-2">
                      支持上传PDF、Word、Excel、图片等文件，单个文件不超过10MB
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </div>
            <!-- 表单操作按钮 -->
            <div class="flex flex-wrap justify-center gap-4 pt-8">
              <el-button type="primary" @click="submitForm1"
                class="px-8 py-3 rounded-xl shadow-lg bg-gradient-to-r from-form to-blue-700 hover:opacity-90 transition-all">
                <i class="fas fa-paper-plane mr-2"></i>提交检测申请
              </el-button>
              <el-button @click="resetForm" class="px-8 py-3 rounded-xl border border-gray-300 hover:bg-gray-50">
                <i class="fas fa-redo mr-2"></i>重置表单
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
      </el-scrollbar>
      <!-- <SampleDetectionForm></SampleDetectionForm> -->
      <template #footer>
        <!-- 状态提示 -->
        <div class="text-center mt-8 text-gray-600 text-sm">
          <i class="fas fa-info-circle mr-2"></i>提交后可在"检测管理"中查看进度
        </div>
        <!-- 装饰元素 -->
        <!-- <div class="fixed top-10 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 -z-10"></div>
        <div class="fixed bottom-10 right-10 w-40 h-40 bg-green-100 rounded-full opacity-20 -z-10"></div> -->
        <div class="dialog-footer">
          <el-button @click="open = false">取消</el-button>
          <el-button type="primary" @click="open = false">
            确定
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
  padding: calc(var(--spacing) * 6);
}

.form-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(211, 220, 230, 0.6);
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