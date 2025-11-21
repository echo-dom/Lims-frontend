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
                <el-form :inline="true" :model="formData" class="demo-form-inline">
                    <el-form-item label="选择客户">
                        <el-select v-model="formData.customer" multiple filterable remote reserve-keyword placeholder="请选择客户"
                            remote-show-suffix :remote-method="remoteMethod" :loading="loading2" >
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Activity zone">
                        <el-select v-model="formData.region" placeholder="Activity zone" clearable>
                            <el-option label="Zone one" value="shanghai" />
                            <el-option label="Zone two" value="beijing" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Activity time">
                        <el-date-picker v-model="formData.date" type="date" placeholder="Pick a date" clearable />
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <template #footer>
            <!-- 状态提示 -->
            <!-- 表单操作按钮 -->
            <div
                style="display: flex;justify-content: center;align-items: center;border-top: 1px solid #eee;padding: 10px;">
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
</template>
<script setup name="Dialog" lang="ts">

// 选择客户
import { listCustomer } from "@/api/lims/customer"
onMounted(() => {
    listCustomer({ pageSize: 1000 }).then(response => {
        options.value = response.rows.map(item => {
            return {
                label: item.compname,
                value: item.ccode
            }
        })

    })
})

const formData = ref({
    customer:'',
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

const options = ref([])
const value = ref<string[]>([])
const loading2 = ref(false)
const remoteMethod = (query: string) => {
    if (query) {
        loading2.value = true
        listCustomer({ "compname": query }).then(response => {
            options.value = response.rows.map(item => {
                return {
                    label: item.compname,
                    value: item.ccode
                }
            })
            loading2.value = false
        })
    } else {
        options.value = []
    }
}
</script>

<style scoped>
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
