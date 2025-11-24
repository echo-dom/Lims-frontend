<template>
    <el-dialog width="80%" height="80%" fullscreen v-model="visible">
        <template #header>
            <div class="el-dialog__title" style="font-size: 18px;">新增样品</div>
        </template>
        <div style="height: calc(100vh - 150px);overflow: auto;">

            <!-- 卡片风格 -->
            <el-card shadow="hover">
                <template #header>
                    <div class="el-card__title">
                        样品信息
                    </div>
                </template>
                <el-form ref="ruleFormRef" :rules="rules" :inline="true" :model="formData" class="demo-form-inline" size="default"
                    label-width="155px" label-position="left">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="样品名称" required prop="sample_name" >
                                <el-input v-model="formData.sample_name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" style="display: flex;">
                            <el-form-item label-width="110px" style="width: 140px;" label="是否自编编号" >
                                <el-switch  v-model="formData.manualy" />
                            </el-form-item>
                             <el-form-item label-width="110px" style="margin-right:0" label="自编样品编号" :required="formData.manualy" prop="sample_code" >
                                <el-input :disabled="!formData.manualy" v-model="formData.sample_code" />
                            </el-form-item>
                        </el-col>
                       
                        <el-col :span="8" style="display: flex;">
                            <el-form-item label-width="155px" label="样品数量" required prop="sampling_receivecount" >
                                <el-input-number v-model="formData.sampling_receivecount" :min="1" />
                            </el-form-item>
                            <el-form-item label-width="110px" label="样品批次" required prop="samplebatch">
                                <el-input-number v-model="formData.samplebatch" :min="1" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="选择客户" required >
                                <el-select v-model="formData.customer" filterable remote reserve-keyword
                                    placeholder="请选择客户" prop="customer" remote-show-suffix :remote-method="remoteMethod"
                                    :loading="loading2" @change="changeCustomer">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        
                        <el-col :span="8">
                            <el-form-item label="地址编码" required prop="ccode" >
                                <el-input v-model="formData.ccode" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" >
                            <el-form-item label="榨季阶段" required>
                                <el-select v-model="formData.grindingseason" filterable reserve-keyword
                                    placeholder="请选择" prop="grindingseason">
                                    <el-option v-for="item in grindingseasonOption" :key="item.value"
                                        :label="item.label" :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="选择合同" required >
                                <el-select v-model="formData.contract_name" filterable remote reserve-keyword
                                    placeholder="请选择合同" prop="contract_name" remote-show-suffix :remote-method="remoteContractMethod"
                                    :loading="loading">
                                    <el-option v-for="item in contractOptions" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" >
                            <el-form-item label="要求完成时间"  required prop="inspectioncompletiondate">
                                <el-date-picker style="width: 100%;" v-model="formData.inspectioncompletiondate" type="date"
                                    placeholder="Pick a date" clearable />
                            </el-form-item>
                        </el-col>
                         <el-col :span="8">
                            <el-form-item label="测试周期" required >
                                <el-select v-model="formData.period" placeholder="请选择测试周期" prop="period"
                                    remote-show-suffix>
                                    <el-option label="3个工作日" value="3" />
                                    <el-option label="5个工作日" value="5" />
                                    <el-option label="7个工作日" value="7" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="来源文件夹编号" prop="fromFolderNo">
                                <el-input v-model="formData.fromFolderNo" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="原始记录名称" prop="originalRecordName">
                                <el-input v-model="formData.originalRecordName" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="主项目数" prop="mainProNum">
                                <el-input v-model="formData.mainProNum" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="任务状态" prop="taskStatus">
                                <el-select v-model="formData.taskStatus" placeholder="请选择任务状态">
                                    <el-option
                                        v-for="dict in task_status"
                                        :key="dict.value"
                                        :label="dict.label"
                                        :value="dict.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </div>
        <template #footer>
            <!-- 状态提示 -->
            <!-- 表单操作按钮 -->
            <div
                style="display: flex;justify-content: center;align-items: center;border-top: 1px solid #eee;padding: 10px;">
                <el-button type="primary" @click="submit(ruleFormRef)"
                    class="px-8 py-3 rounded-xl shadow-lg bg-gradient-to-r from-form to-blue-700 hover:opacity-90 transition-all">
                    <i class="fas fa-paper-plane mr-2"></i>新增
                </el-button>
                <el-button class="px-8 py-3 rounded-xl border border-gray-300 hover:bg-gray-50">
                    <i class="fas fa-redo mr-2"></i>重置表单
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup name="Dialog" lang="ts">
import { ElMessage } from 'element-plus'
import { listCustomer } from "@/api/lims/customer"
import { listContractmanagement } from "@/api/lims/contractmanagement"
import { addSample } from "@/api/lims/sample"
import type { FormInstance, FormRules } from 'element-plus'
import { getCurrentInstance, computed, onMounted, ref, reactive } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'success'])
const { proxy } = getCurrentInstance()
const { task_status, lims_sample_status } = proxy.useDict("task_status", "lims_sample_status");

watch(() => task_status.value, (val) => {
    if (val && val.length > 0 && !formData.value.taskStatus) {
        const defaultItem = val.find(item => item.label === '常规');
        if (defaultItem) {
            formData.value.taskStatus = defaultItem.value;
        }
    }
}, { immediate: true });

watch(() => lims_sample_status.value, (val) => {
    if (val && val.length > 0 && !formData.value.sampleStatus) {
        const defaultItem = val.find(item => item.label === '新增状态');
        if (defaultItem) {
            formData.value.sampleStatus = defaultItem.value;
        }
    }
}, { immediate: true });

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

onMounted(() => {
    listCustomer({ pageSize: 1000 }).then(response => {
        list.value = response.rows.map(item => {
            return {
                label: item.compname,
                value: item.customerId,
                ...item
            }
        })
    })
    listContractmanagement({ pageSize: 1000 }).then(response => {
        list2.value = response.rows.map(item => {
            return {
                label: item.contractname,
                value: item.contractid || '',
                ...item
            }
        })
    })
})

const grindingseasonOption = [
    {
        label: '前期',
        value: '前期'
    },
    {
        label: '中期',
        value: '中期'
    },
    {
        label: '后期',
        value: '后期'
    },
]

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules>({
    customer: [
        { required: true, message: '请选择客户', trigger: 'change' },
    ],
    ccode: [
        {
            required: true,
            message: '请输入地址编码',
            trigger: 'blur',
        },
    ],
    inspectioncompletiondate: [
        {
            required: true,
            message: '请输入选择要求完成日期',
            trigger: 'blur',
        },
    ],
})
const formData = ref({
    customer: '',
    sample_name: '',
    sample_code: '',
    sampling_receivecount: 1,
    samplebatch: 1,
    ccode: '',
    grindingseason: '',
    contract_name: '',
    inspectioncompletiondate: '',
    period: '',
    manualy: false, // 是否自编
    fromFolderNo: '',
    originalRecordName: '',
    mainProNum: '',
    taskStatus: '',
    sampleStatus: '',
    paymentStatus: '',
    auditorDesc: '',
})

const options = ref([])
const contractOptions = ref([])
const list = ref([])
const list2 = ref([])
const loading2 = ref(false)
const loading = ref(false)

const remoteMethod = (query: string) => {
    if (query) {
        loading2.value = true
        listCustomer({ "compname": query }).then(response => {
            options.value = response.rows.map(item => {
                return {
                    label: item.compname,
                    value: item.customerId,
                    ...item
                }
            })
            loading2.value = false
        })
    } else {
        options.value = list.value
    }
}
const remoteContractMethod = (query: string) => {
    if (query) {
        loading.value = true
        listContractmanagement({ "contractname": query }).then(response => {
            contractOptions.value = response.rows.map(item => {
                return {
                    label: item.contractname,
                    value: item.contractid,
                    ...item
                }
            })
            loading.value = false
        })
    } else {
        contractOptions.value = list2.value
    }
}
const changeCustomer = (val) => {
    const ccode = list.value.filter(ite => ite.customerId == val)[0]?.ccode

    if (!ccode?.trim()) {
        ElMessage.warning('该客户无地址编码,请手动输入！')
    }
    formData.value.ccode = ccode
}
const submit = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            const data = {
                sampleName: formData.value.sample_name,
                customerId: formData.value.customer,
                batchNumber: formData.value.samplebatch,
                sampleCode: formData.value.manualy ? formData.value.sample_code : null,
                // Extra fields that might be needed or stored in remark/other fields
                // For now, sending them as is, assuming backend DTO might handle or ignore
                remark: JSON.stringify({
                    ccode: formData.value.ccode,
                    grindingseason: formData.value.grindingseason,
                    contractId: formData.value.contract_name,
                    inspectioncompletiondate: formData.value.inspectioncompletiondate,
                    period: formData.value.period,
                    samplingReceivecount: formData.value.sampling_receivecount
                }),
                fromFolderNo: formData.value.fromFolderNo,
                originalRecordName: formData.value.originalRecordName,
                mainProNum: formData.value.mainProNum,
                taskStatus: formData.value.taskStatus,
                sampleStatus: formData.value.sampleStatus,
                paymentStatus: formData.value.paymentStatus,
                auditorDesc: formData.value.auditorDesc
            }
            addSample(data).then(response => {
                ElMessage.success("新增成功")
                emit('success')
                visible.value = false
            })
        }
    })
}
</script>

<style scoped>
.el-form-item{
    width: 100%;
}
.el-dialog__title,
.el-card__title {
    line-height: 24px;
    font-size: 18px;
    color: #333;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.el-dialog__title:before {
    content: "";
    margin-right: 10px;
    background: var(--el-color-primary);
    width: 7px;
    height: 21px;
    border-radius: 3px;
}

.el-card__title {
    color: var(--el-color-primary);
    font-weight: 600;
}

.el-card__title:before {
    content: "";
    margin-right: 10px;
    background: var(--el-color-primary);
    width: 7px;
    height: 21px;
    border-radius: 3px;
}
</style>
