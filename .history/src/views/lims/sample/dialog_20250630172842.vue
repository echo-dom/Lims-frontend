<template>
    <el-dialog width="80%" height="80%" fullscreen>
        <template #header>
            <div class="el-dialog__title" style="font-size: 18px;">国家食品安全抽样检验抽样单</div>
        </template>
        <div style="height: calc(100vh - 150px);overflow: auto;">

            <!-- 卡片风格 -->
            <el-card shadow="hover">
                <template #header>
                    <div class="el-card__title">
                        样品信息
                    </div>
                </template>
                <el-form :rules="rules" :inline="true" :model="formData" class="demo-form-inline" size="default"
                    label-width="155px" label-position="left">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="样品名称" required prop="sample_name" >
                                <el-input v-model="formData.sample_name" />
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item label="测试周期" required >
                                <el-select v-model="formData.customer" placeholder="请选择测试周期" prop="customer"
                                    remote-show-suffix>
                                    <el-option label="3个工作日" value="3" />
                                    <el-option label="5个工作日" value="5" />
                                    <el-option label="7个工作日" value="7" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" style="display: flex;">
                            <el-form-item label-width="155px" label="样品数量" required prop="sample_quantity" >
                                <el-input-number v-model="formData.sample_quantity" :min="1" />
                            </el-form-item>
                            <el-form-item label-width="110px" label="样品批次" required prop="batch_number">
                                <el-input-number v-model="formData.batch_number" :min="1" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="选择客户" required >
                                <el-select v-model="formData.customer" filterable remote reserve-keyword
                                    placeholder="请选择客户" prop="customer" remote-show-suffix :remote-method="remoteMethod"
                                    :loading="loading2" @change="changeCustomer">
                                    <el-option v-for="item in options" :key="item.compcode" :label="item.label"
                                        :value="item.compcode" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="选择合同" required >
                                <el-select v-model="formData.contract_name" filterable remote reserve-keyword
                                    placeholder="请选择合同" prop="contract_name" remote-show-suffix :remote-method="remoteContractMethod"
                                    :loading="loading2" @change="changeCustomer">
                                    <el-option v-for="item in options" :key="item.compcode" :label="item.label"
                                        :value="item.compcode" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="地址编码" required prop="ccode" >
                                <el-input v-model="formData.ccode" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        
                        <el-col :span="8" style="display: flex;">
                            <el-form-item label="要求完成时间" required prop="inspectioncompletiondate">
                                <el-date-picker v-model="formData.inspectioncompletiondate" type="date"
                                    placeholder="Pick a date" clearable />
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
                    <i class="fas fa-paper-plane mr-2"></i>提交检测申请
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
// 选择客户
import { listCustomer } from "@/api/lims/customer"
onMounted(() => {
    listCustomer({ pageSize: 1000 }).then(response => {
        console.log(response.rows)
        list.value = response.rows.map(item => {
            return {
                label: item.compname,
                value: item.ccode || '',
                ...item
            }
        })

    })
})
import type { FormInstance, FormRules } from 'element-plus'

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

interface RuleForm {
    customer: string,
    ccode: string,
    inspectioncompletiondate: string
}

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
    ccode: '',
    attachments: [],
    inspectioncompletiondate: ''
})

const options = ref([])
const contractOptions = ref([])
const list = ref([])
const value = ref<string[]>([])
const loading2 = ref(false)
const loading = ref(false)
const remoteMethod = (query: string) => {
    if (query) {
        loading2.value = true
        listCustomer({ "compname": query }).then(response => {
            options.value = response.rows.map(item => {
                return {
                    label: item.compname,
                    value: item.ccode,
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
        listCustomer({ "contract_name": query }).then(response => {
            options.value = response.rows.map(item => {
                return {
                    label: item.compname,
                    value: item.ccode,
                    ...item
                }
            })
            loading.value = false
        })
    } else {
        contractOptions.value = list.value
    }
}
const changeCustomer = (val) => {
    const ccode = list.value.filter(ite => ite.compcode == val)[0]?.ccode

    if (!ccode?.trim()) {
        ElMessage.warning('该客户无地址编码,请手动输入！')
    }
    formData.value.ccode = ccode
}
const submit = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    console.log(formData.value)
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
