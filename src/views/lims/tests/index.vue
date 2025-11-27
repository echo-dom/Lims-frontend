<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="原系统ID" prop="originalId">
        <el-input
          v-model="queryParams.originalId"
          placeholder="请输入原系统ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="测试代码" prop="testCode">
        <el-input
          v-model="queryParams.testCode"
          placeholder="请输入测试代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="原始代码" prop="originalCode">
        <el-input
          v-model="queryParams.originalCode"
          placeholder="请输入原始代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="领域ID" prop="domainId">
        <el-input
          v-model="queryParams.domainId"
          placeholder="请输入领域ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="测试分类ID" prop="testCategoryId">
        <el-input
          v-model="queryParams.testCategoryId"
          placeholder="请输入测试分类ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="测试分类名称" prop="testCateName">
        <el-input
          v-model="queryParams.testCateName"
          placeholder="请输入测试分类名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="测试分组" prop="testGroup">
        <el-input
          v-model="queryParams.testGroup"
          placeholder="请输入测试分组"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="拼音简写" prop="spellSimplify">
        <el-input
          v-model="queryParams.spellSimplify"
          placeholder="请输入拼音简写"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="报告测试编号" prop="reportTestNo">
        <el-input
          v-model="queryParams.reportTestNo"
          placeholder="请输入报告测试编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="测试价格" prop="tPrice">
        <el-input
          v-model="queryParams.tPrice"
          placeholder="请输入测试价格"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input
          v-model="queryParams.unit"
          placeholder="请输入单位"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="CMA认证" prop="cma">
        <el-input
          v-model="queryParams.cma"
          placeholder="请输入CMA认证"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="CNAS认证" prop="cnas">
        <el-input
          v-model="queryParams.cnas"
          placeholder="请输入CNAS认证"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门" prop="dept">
        <el-input
          v-model="queryParams.dept"
          placeholder="请输入部门"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="成本中心ID" prop="ccId">
        <el-input
          v-model="queryParams.ccId"
          placeholder="请输入成本中心ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提交公司" prop="submitCorp">
        <el-input
          v-model="queryParams.submitCorp"
          placeholder="请输入提交公司"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="环境样品保存代码" prop="envSampleSaveCode">
        <el-input
          v-model="queryParams.envSampleSaveCode"
          placeholder="请输入环境样品保存代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="环境样品保存日期" prop="envSampleSaveDate">
        <el-input
          v-model="queryParams.envSampleSaveDate"
          placeholder="请输入环境样品保存日期"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="冻结标志" prop="freezeFlag">
        <el-input
          v-model="queryParams.freezeFlag"
          placeholder="请输入冻结标志"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="WSW标志" prop="wswFlag">
        <el-input
          v-model="queryParams.wswFlag"
          placeholder="请输入WSW标志"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核标志" prop="auditFlag">
        <el-input
          v-model="queryParams.auditFlag"
          placeholder="请输入审核标志"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核级别" prop="auditLevel">
        <el-input
          v-model="queryParams.auditLevel"
          placeholder="请输入审核级别"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行审核" prop="rowAudit">
        <el-input
          v-model="queryParams.rowAudit"
          placeholder="请输入行审核"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核人代码" prop="auditorCode">
        <el-input
          v-model="queryParams.auditorCode"
          placeholder="请输入审核人代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核时间" prop="auditTime">
        <el-date-picker clearable
          v-model="queryParams.auditTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择审核时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="工作流ID" prop="workflowId">
        <el-input
          v-model="queryParams.workflowId"
          placeholder="请输入工作流ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序" prop="sorter">
        <el-input
          v-model="queryParams.sorter"
          placeholder="请输入排序"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="历史人员" prop="historyPerson">
        <el-input
          v-model="queryParams.historyPerson"
          placeholder="请输入历史人员"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="添加人员" prop="addPerson">
        <el-input
          v-model="queryParams.addPerson"
          placeholder="请输入添加人员"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="添加日期" prop="addDate">
        <el-date-picker clearable
          v-model="queryParams.addDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择添加日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="冻结人代码" prop="freezerCode">
        <el-input
          v-model="queryParams.freezerCode"
          placeholder="请输入冻结人代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="冻结时间" prop="freezeTime">
        <el-date-picker clearable
          v-model="queryParams.freezeTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择冻结时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['lims:tests:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['lims:tests:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['lims:tests:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['lims:tests:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="testsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="testId" />
      <el-table-column label="原系统ID" align="center" prop="originalId" />
      <el-table-column label="测试代码" align="center" prop="testCode" />
      <el-table-column label="测试名称" align="center" prop="testName" />
      <el-table-column label="GC测试名称" align="center" prop="gcTestName" />
      <el-table-column label="原始代码" align="center" prop="originalCode" />
      <el-table-column label="领域ID" align="center" prop="domainId" />
      <el-table-column label="测试分类ID" align="center" prop="testCategoryId" />
      <el-table-column label="测试分类名称" align="center" prop="testCateName" />
      <el-table-column label="完整类型" align="center" prop="fullType" />
      <el-table-column label="测试分组" align="center" prop="testGroup" />
      <el-table-column label="报告中名称" align="center" prop="nameInReport" />
      <el-table-column label="拼音简写" align="center" prop="spellSimplify" />
      <el-table-column label="报告测试编号" align="center" prop="reportTestNo" />
      <el-table-column label="测试项目" align="center" prop="testItems" />
      <el-table-column label="测试说明" align="center" prop="testExplain" />
      <el-table-column label="抽样方法" align="center" prop="samplingMethod" />
      <el-table-column label="测试价格" align="center" prop="tPrice" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="CMA认证" align="center" prop="cma" />
      <el-table-column label="CNAS认证" align="center" prop="cnas" />
      <el-table-column label="部门" align="center" prop="dept" />
      <el-table-column label="成本中心ID" align="center" prop="ccId" />
      <el-table-column label="提交公司" align="center" prop="submitCorp" />
      <el-table-column label="环境样品保存代码" align="center" prop="envSampleSaveCode" />
      <el-table-column label="环境样品保存条件" align="center" prop="envSampleSaveCon" />
      <el-table-column label="环境样品保存日期" align="center" prop="envSampleSaveDate" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="冻结标志" align="center" prop="freezeFlag" />
      <el-table-column label="显示状态" align="center" prop="dispStatus" />
      <el-table-column label="WSW标志" align="center" prop="wswFlag" />
      <el-table-column label="审核标志" align="center" prop="auditFlag" />
      <el-table-column label="审核级别" align="center" prop="auditLevel" />
      <el-table-column label="行审核" align="center" prop="rowAudit" />
      <el-table-column label="审核人代码" align="center" prop="auditorCode" />
      <el-table-column label="审核时间" align="center" prop="auditTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作流ID" align="center" prop="workflowId" />
      <el-table-column label="版本" align="center" prop="version" />
      <el-table-column label="排序" align="center" prop="sorter" />
      <el-table-column label="记录者描述" align="center" prop="recorderDesc" />
      <el-table-column label="历史人员" align="center" prop="historyPerson" />
      <el-table-column label="添加人员" align="center" prop="addPerson" />
      <el-table-column label="添加日期" align="center" prop="addDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.addDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="冻结人代码" align="center" prop="freezerCode" />
      <el-table-column label="冻结人描述" align="center" prop="freezerDesc" />
      <el-table-column label="冻结时间" align="center" prop="freezeTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.freezeTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lims:tests:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lims:tests:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改测试项目对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="testsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="原系统ID" prop="originalId">
          <el-input v-model="form.originalId" placeholder="请输入原系统ID" />
        </el-form-item>
        <el-form-item label="测试代码" prop="testCode">
          <el-input v-model="form.testCode" placeholder="请输入测试代码" />
        </el-form-item>
        <el-form-item label="测试名称" prop="testName">
          <el-input v-model="form.testName" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="GC测试名称" prop="gcTestName">
          <el-input v-model="form.gcTestName" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="原始代码" prop="originalCode">
          <el-input v-model="form.originalCode" placeholder="请输入原始代码" />
        </el-form-item>
        <el-form-item label="领域ID" prop="domainId">
          <el-input v-model="form.domainId" placeholder="请输入领域ID" />
        </el-form-item>
        <el-form-item label="测试分类ID" prop="testCategoryId">
          <el-input v-model="form.testCategoryId" placeholder="请输入测试分类ID" />
        </el-form-item>
        <el-form-item label="测试分类名称" prop="testCateName">
          <el-input v-model="form.testCateName" placeholder="请输入测试分类名称" />
        </el-form-item>
        <el-form-item label="测试分组" prop="testGroup">
          <el-input v-model="form.testGroup" placeholder="请输入测试分组" />
        </el-form-item>
        <el-form-item label="报告中名称" prop="nameInReport">
          <el-input v-model="form.nameInReport" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="拼音简写" prop="spellSimplify">
          <el-input v-model="form.spellSimplify" placeholder="请输入拼音简写" />
        </el-form-item>
        <el-form-item label="报告测试编号" prop="reportTestNo">
          <el-input v-model="form.reportTestNo" placeholder="请输入报告测试编号" />
        </el-form-item>
        <el-form-item label="测试项目" prop="testItems">
          <el-input v-model="form.testItems" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="测试说明" prop="testExplain">
          <el-input v-model="form.testExplain" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="抽样方法" prop="samplingMethod">
          <el-input v-model="form.samplingMethod" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="测试价格" prop="tPrice">
          <el-input v-model="form.tPrice" placeholder="请输入测试价格" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="CMA认证" prop="cma">
          <el-input v-model="form.cma" placeholder="请输入CMA认证" />
        </el-form-item>
        <el-form-item label="CNAS认证" prop="cnas">
          <el-input v-model="form.cnas" placeholder="请输入CNAS认证" />
        </el-form-item>
        <el-form-item label="部门" prop="dept">
          <el-input v-model="form.dept" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="成本中心ID" prop="ccId">
          <el-input v-model="form.ccId" placeholder="请输入成本中心ID" />
        </el-form-item>
        <el-form-item label="提交公司" prop="submitCorp">
          <el-input v-model="form.submitCorp" placeholder="请输入提交公司" />
        </el-form-item>
        <el-form-item label="环境样品保存代码" prop="envSampleSaveCode">
          <el-input v-model="form.envSampleSaveCode" placeholder="请输入环境样品保存代码" />
        </el-form-item>
        <el-form-item label="环境样品保存条件" prop="envSampleSaveCon">
          <el-input v-model="form.envSampleSaveCon" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="环境样品保存日期" prop="envSampleSaveDate">
          <el-input v-model="form.envSampleSaveDate" placeholder="请输入环境样品保存日期" />
        </el-form-item>
        <el-form-item label="冻结标志" prop="freezeFlag">
          <el-input v-model="form.freezeFlag" placeholder="请输入冻结标志" />
        </el-form-item>
        <el-form-item label="WSW标志" prop="wswFlag">
          <el-input v-model="form.wswFlag" placeholder="请输入WSW标志" />
        </el-form-item>
        <el-form-item label="审核标志" prop="auditFlag">
          <el-input v-model="form.auditFlag" placeholder="请输入审核标志" />
        </el-form-item>
        <el-form-item label="审核级别" prop="auditLevel">
          <el-input v-model="form.auditLevel" placeholder="请输入审核级别" />
        </el-form-item>
        <el-form-item label="行审核" prop="rowAudit">
          <el-input v-model="form.rowAudit" placeholder="请输入行审核" />
        </el-form-item>
        <el-form-item label="审核人代码" prop="auditorCode">
          <el-input v-model="form.auditorCode" placeholder="请输入审核人代码" />
        </el-form-item>
        <el-form-item label="审核时间" prop="auditTime">
          <el-date-picker clearable
            v-model="form.auditTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择审核时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工作流ID" prop="workflowId">
          <el-input v-model="form.workflowId" placeholder="请输入工作流ID" />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本" />
        </el-form-item>
        <el-form-item label="排序" prop="sorter">
          <el-input v-model="form.sorter" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="记录者描述" prop="recorderDesc">
          <el-input v-model="form.recorderDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="历史人员" prop="historyPerson">
          <el-input v-model="form.historyPerson" placeholder="请输入历史人员" />
        </el-form-item>
        <el-form-item label="添加人员" prop="addPerson">
          <el-input v-model="form.addPerson" placeholder="请输入添加人员" />
        </el-form-item>
        <el-form-item label="添加日期" prop="addDate">
          <el-date-picker clearable
            v-model="form.addDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择添加日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="冻结人代码" prop="freezerCode">
          <el-input v-model="form.freezerCode" placeholder="请输入冻结人代码" />
        </el-form-item>
        <el-form-item label="冻结人描述" prop="freezerDesc">
          <el-input v-model="form.freezerDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="冻结时间" prop="freezeTime">
          <el-date-picker clearable
            v-model="form.freezeTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择冻结时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Tests">
import { listTests, getTests, delTests, addTests, updateTests } from "@/api/lims/tests"

const { proxy } = getCurrentInstance()

const testsList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    originalId: null,
    testCode: null,
    testName: null,
    gcTestName: null,
    originalCode: null,
    domainId: null,
    testCategoryId: null,
    testCateName: null,
    fullType: null,
    testGroup: null,
    nameInReport: null,
    spellSimplify: null,
    reportTestNo: null,
    testItems: null,
    testExplain: null,
    samplingMethod: null,
    tPrice: null,
    unit: null,
    cma: null,
    cnas: null,
    dept: null,
    ccId: null,
    submitCorp: null,
    envSampleSaveCode: null,
    envSampleSaveCon: null,
    envSampleSaveDate: null,
    status: null,
    freezeFlag: null,
    dispStatus: null,
    wswFlag: null,
    auditFlag: null,
    auditLevel: null,
    rowAudit: null,
    auditorCode: null,
    auditTime: null,
    workflowId: null,
    version: null,
    sorter: null,
    recorderDesc: null,
    historyPerson: null,
    addPerson: null,
    addDate: null,
    freezerCode: null,
    freezerDesc: null,
    freezeTime: null,
  },
  rules: {
    testCode: [
      { required: true, message: "测试代码不能为空", trigger: "blur" }
    ],
    testName: [
      { required: true, message: "测试名称不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询测试项目列表 */
function getList() {
  loading.value = true
  listTests(queryParams.value).then(response => {
    testsList.value = response.rows
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
    testId: null,
    originalId: null,
    testCode: null,
    testName: null,
    gcTestName: null,
    originalCode: null,
    domainId: null,
    testCategoryId: null,
    testCateName: null,
    fullType: null,
    testGroup: null,
    nameInReport: null,
    spellSimplify: null,
    reportTestNo: null,
    testItems: null,
    testExplain: null,
    samplingMethod: null,
    tPrice: null,
    unit: null,
    cma: null,
    cnas: null,
    dept: null,
    ccId: null,
    submitCorp: null,
    envSampleSaveCode: null,
    envSampleSaveCon: null,
    envSampleSaveDate: null,
    status: null,
    freezeFlag: null,
    dispStatus: null,
    wswFlag: null,
    auditFlag: null,
    auditLevel: null,
    rowAudit: null,
    auditorCode: null,
    auditTime: null,
    workflowId: null,
    version: null,
    sorter: null,
    recorderDesc: null,
    historyPerson: null,
    addPerson: null,
    addDate: null,
    freezerCode: null,
    freezerDesc: null,
    freezeTime: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    delFlag: null
  }
  proxy.resetForm("testsRef")
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
  ids.value = selection.map(item => item.testId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加测试项目"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _testId = row.testId || ids.value
  getTests(_testId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改测试项目"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["testsRef"].validate(valid => {
    if (valid) {
      if (form.value.testId != null) {
        updateTests(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addTests(form.value).then(response => {
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
  const _testIds = row.testId || ids.value
  proxy.$modal.confirm('是否确认删除测试项目编号为"' + _testIds + '"的数据项？').then(function() {
    return delTests(_testIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('lims/tests/export', {
    ...queryParams.value
  }, `tests_${new Date().getTime()}.xlsx`)
}

getList()
</script>
