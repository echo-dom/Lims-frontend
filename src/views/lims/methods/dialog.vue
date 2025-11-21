<template>
    <el-dialog :model-value="modelValue" @update:model-value="updateModelValue" width="80%" fullscreen>
        <template #header>
            <div class="el-dialog__title" style="font-size: 18px;">{{ title }}</div>
        </template>
        <div style="height: calc(100vh - 150px);overflow: auto;">
            <!-- 卡片风格 -->
            <el-card shadow="hover">
                <template #header>
                    <div class="el-card__title">
                        测试方法信息
                    </div>
                </template>
                <el-form ref="formRef" :rules="rules" :model="formData" :inline="true" class="demo-form-inline" size="default"
                    label-width="140px" label-position="left">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="原系统ID" prop="originalId">
                                <el-input v-model="formData.originalId" placeholder="请输入原系统ID" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="方法编号" prop="methodCode">
                                <el-input v-model="formData.methodCode" placeholder="请输入方法编号" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="方法号" prop="methodNo">
                                <el-input v-model="formData.methodNo" placeholder="请输入方法号" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="方法名称" prop="methodName">
                                <el-input v-model="formData.methodName" type="textarea" :rows="2" placeholder="请输入方法名称" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="方法简称" prop="methodNameEng">
                                <el-input v-model="formData.methodNameEng" placeholder="请输入方法简称" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="方法类型" prop="methodType">
                                <el-input v-model="formData.methodType" placeholder="请输入方法类型" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="状态" prop="status">
                                <el-input v-model="formData.status" placeholder="请输入状态" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="条款号" prop="clause">
                                <el-input v-model="formData.clause" placeholder="请输入条款号" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="条款名称" prop="clauseName">
                                <el-input v-model="formData.clauseName" type="textarea" :rows="2" placeholder="请输入条款名称" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="条款名称英文" prop="clauseNameEng">
                                <el-input v-model="formData.clauseNameEng" type="textarea" :rows="2" placeholder="请输入条款名称英文" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="是否接单" prop="isOrders">
                                <el-input v-model="formData.isOrders" placeholder="请输入是否接单" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="方法状态" prop="methodStatus">
                                <el-input v-model="formData.methodStatus" placeholder="请输入方法状态" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="方法状态值" prop="methodStatusValue">
                                <el-input v-model="formData.methodStatusValue" placeholder="请输入方法状态值" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="方法描述" prop="methodDesc">
                                <el-input v-model="formData.methodDesc" type="textarea" :rows="2" placeholder="请输入方法描述" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="版本号" prop="version">
                                <el-input v-model="formData.version" placeholder="请输入版本号" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="检测仪器及条件" prop="detectorAndCondition">
                                <el-input v-model="formData.detectorAndCondition" type="textarea" :rows="2" placeholder="请输入检测仪器及条件" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="仪器备注及方法" prop="eqRemarkAndMethod">
                                <el-input v-model="formData.eqRemarkAndMethod" type="textarea" :rows="2" placeholder="请输入仪器备注及方法" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="样品处理及方法概述" prop="methodOverview">
                                <el-input v-model="formData.methodOverview" type="textarea" :rows="2" placeholder="请输入样品处理及方法概述" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="检验项目说明" prop="testExplain">
                                <el-input v-model="formData.testExplain" type="textarea" :rows="2" placeholder="请输入检验项目说明" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="方法说明" prop="methodExplain">
                                <el-input v-model="formData.methodExplain" type="textarea" :rows="2" placeholder="请输入方法说明" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="耗材" prop="consumable">
                                <el-input v-model="formData.consumable" type="textarea" :rows="2" placeholder="请输入耗材" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="部门ID" prop="deptId">
                                <el-input v-model="formData.deptId" placeholder="请输入部门ID" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入备注" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </div>
        <template #footer>
            <div style="display: flex;justify-content: center;align-items: center;border-top: 1px solid #eee;padding: 10px;">
                <el-button type="primary" @click="submitForm">
                    确 定
                </el-button>
                <el-button @click="cancel">
                    取 消
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup name="Dialog" lang="ts">
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getMethods, addMethods, updateMethods } from "@/api/lims/methods"

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    formData: {
        type: Object,
        default: () => ({})
    },
    title: {
        type: String,
        default: '新增测试方法'
    }
})

const emit = defineEmits(['update:modelValue', 'success'])

const formRef = ref<FormInstance>()
const formData = ref({ ...props.formData })

watch(() => props.formData, (newVal) => {
    formData.value = { ...newVal }
}, { deep: true })

const rules = reactive<FormRules>({
    methodCode: [
        { required: true, message: "方法编号不能为空", trigger: "blur" }
    ],
    methodName: [
        { required: true, message: "方法名称不能为空", trigger: "blur" }
    ],
})

const updateModelValue = (val: boolean) => {
    emit('update:modelValue', val)
}

const cancel = () => {
    updateModelValue(false)
    formRef.value?.resetFields()
}

const submitForm = () => {
    if (!formRef.value) return
    formRef.value.validate((valid) => {
        if (valid) {
            if (formData.value.testMethodsId != null) {
                updateMethods(formData.value).then(response => {
                    ElMessage.success("修改成功")
                    updateModelValue(false)
                    emit('success')
                })
            } else {
                addMethods(formData.value).then(response => {
                    ElMessage.success("新增成功")
                    updateModelValue(false)
                    emit('success')
                })
            }
        }
    })
}
</script>

<style scoped>
.el-form-item {
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

