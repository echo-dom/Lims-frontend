<template>
  <el-dialog :title="title" :model-value="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="原系统ID" prop="originalId">
            <el-input v-model="form.originalId" placeholder="请输入原系统ID" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测项目ID" prop="testsId">
            <el-input v-model="form.testsId" placeholder="请输入检测项目ID" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行标准ID" prop="sampleProgramsId">
            <el-input v-model="form.sampleProgramsId" placeholder="请输入执行标准ID" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目ID" prop="projectId">
            <el-input v-model="form.projectId" placeholder="请输入项目ID" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行标准代码" prop="spCode">
            <el-input v-model="form.spCode" placeholder="请输入执行标准代码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="方案测试名称" prop="spTestName">
            <el-input v-model="form.spTestName" placeholder="请输入方案测试名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="测试名称" prop="testName">
            <el-input v-model="form.testName" placeholder="请输入测试名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="测试别名" prop="testAlias">
            <el-input v-model="form.testAlias" placeholder="请输入测试别名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="特殊测试名称" prop="specialTestName">
            <el-input v-model="form.specialTestName" placeholder="请输入特殊测试名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="测试分类ID" prop="testCateId">
            <el-input v-model="form.testCateId" placeholder="请输入测试分类ID" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目代码" prop="programCode">
            <el-input v-model="form.programCode" placeholder="请输入项目代码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数量" prop="qty">
            <el-input v-model="form.qty" placeholder="请输入数量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数量单位" prop="qtyUnits">
            <el-input v-model="form.qtyUnits" placeholder="请输入数量单位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格" prop="price">
            <el-input v-model="form.price" placeholder="请输入价格" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="附加价格" prop="addPrice">
            <el-input v-model="form.addPrice" placeholder="请输入附加价格" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格单位" prop="priceUnits">
            <el-input v-model="form.priceUnits" placeholder="请输入价格单位" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="标准" prop="criterion">
            <el-input v-model="form.criterion" type="textarea" placeholder="请输入标准" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="测试标准" prop="testCriterion">
            <el-input v-model="form.testCriterion" type="textarea" placeholder="请输入测试标准" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="评估规则" prop="evaluateRule">
            <el-input v-model="form.evaluateRule" placeholder="请输入评估规则" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="COP编号" prop="copNo">
            <el-input v-model="form.copNo" placeholder="请输入COP编号" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="低限A" prop="lowA">
            <el-input v-model="form.lowA" placeholder="请输入低限A" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="高限A" prop="highA">
            <el-input v-model="form.highA" placeholder="请输入高限A" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="高限单位" prop="highAUnit">
            <el-input v-model="form.highAUnit" placeholder="请输入高限单位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位" prop="units">
            <el-input v-model="form.units" placeholder="请输入单位" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文本限制" prop="charLimits">
            <el-input v-model="form.charLimits" type="textarea" placeholder="请输入文本限制" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="数据参考" prop="dataReference">
            <el-input v-model="form.dataReference" type="textarea" placeholder="请输入数据参考" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-input v-model="form.status" placeholder="请输入状态" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否退休" prop="isRetire">
            <el-input v-model="form.isRetire" placeholder="请输入是否退休" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否主项目" prop="isMainPro">
            <el-input v-model="form.isMainPro" placeholder="请输入是否主项目" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="冻结标志" prop="freezeFlag">
            <el-input v-model="form.freezeFlag" placeholder="请输入冻结标志" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认测试" prop="defaultTest">
            <el-input v-model="form.defaultTest" placeholder="请输入默认测试" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审核标志" prop="auditFlag">
            <el-input v-model="form.auditFlag" placeholder="请输入审核标志" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审核级别" prop="auditLevel">
            <el-input v-model="form.auditLevel" placeholder="请输入审核级别" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行审核" prop="rowAudit">
            <el-input v-model="form.rowAudit" placeholder="请输入行审核" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="报告备注" prop="reportRemark">
            <el-input v-model="form.reportRemark" type="textarea" placeholder="请输入报告备注" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="抽样计划" prop="drawPlan">
            <el-input v-model="form.drawPlan" placeholder="请输入抽样计划" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="dept">
            <el-input v-model="form.dept" placeholder="请输入部门" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成本中心ID" prop="ccId">
            <el-input v-model="form.ccId" placeholder="请输入成本中心ID" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="提交公司" prop="submitCorp">
            <el-input v-model="form.submitCorp" placeholder="请输入提交公司" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="特殊组名称" prop="specialGroupName">
            <el-input v-model="form.specialGroupName" placeholder="请输入特殊组名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主组汇总" prop="mainGroupZum">
            <el-input v-model="form.mainGroupZum" placeholder="请输入主组汇总" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组编号" prop="groupNums">
            <el-input v-model="form.groupNums" placeholder="请输入组编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始使用日期" prop="startUseDate">
            <el-date-picker clearable v-model="form.startUseDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择开始使用日期" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="到期日期" prop="expirationDate">
            <el-date-picker clearable v-model="form.expirationDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择到期日期" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本" prop="version">
            <el-input v-model="form.version" placeholder="请输入版本" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="方案描述" prop="profile">
            <el-input v-model="form.profile" type="textarea" placeholder="请输入方案描述" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="说明描述" prop="explainDesc">
            <el-input v-model="form.explainDesc" type="textarea" placeholder="请输入说明描述" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注说明" prop="comments">
            <el-input v-model="form.comments" type="textarea" placeholder="请输入备注说明" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="规格分析物备注" prop="specAnalytesComments">
            <el-input v-model="form.specAnalytesComments" type="textarea" placeholder="请输入规格分析物备注" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工作流ID" prop="workflowId">
            <el-input v-model="form.workflowId" placeholder="请输入工作流ID" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sorter">
            <el-input v-model="form.sorter" placeholder="请输入排序" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="记录者描述" prop="recorderDesc">
            <el-input v-model="form.recorderDesc" type="textarea" placeholder="请输入记录者描述" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审核人代码" prop="auditorCode">
            <el-input v-model="form.auditorCode" placeholder="请输入审核人代码" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="审核人描述" prop="auditorDesc">
            <el-input v-model="form.auditorDesc" type="textarea" placeholder="请输入审核人描述" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审核时间" prop="auditTime">
            <el-date-picker clearable v-model="form.auditTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择审核时间" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="冻结人代码" prop="freezerCode">
            <el-input v-model="form.freezerCode" placeholder="请输入冻结人代码" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="冻结人描述" prop="freezerDesc">
            <el-input v-model="form.freezerDesc" type="textarea" placeholder="请输入冻结人描述" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="冻结时间" prop="freezeTime">
            <el-date-picker clearable v-model="form.freezeTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择冻结时间" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  form: Object,
  rules: Object
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const formRef = ref()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function submitForm() {
  formRef.value.validate((valid) => {
    if (valid) {
      emit('submit')
    }
  })
}

function cancel() {
  emit('cancel')
}

function resetFields() {
  formRef.value?.resetFields()
}

defineExpose({
  resetFields
})
</script>
