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
      <el-form-item label="检测项目ID" prop="testsId">
        <el-input
          v-model="queryParams.testsId"
          placeholder="请输入检测项目ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="执行标准ID" prop="sampleProgramsId">
        <el-input
          v-model="queryParams.sampleProgramsId"
          placeholder="请输入执行标准ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目ID" prop="projectId">
        <el-input
          v-model="queryParams.projectId"
          placeholder="请输入项目ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="执行标准代码" prop="spCode">
        <el-input
          v-model="queryParams.spCode"
          placeholder="请输入执行标准代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="测试别名" prop="testAlias">
        <el-input
          v-model="queryParams.testAlias"
          placeholder="请输入测试别名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="测试分类ID" prop="testCateId">
        <el-input
          v-model="queryParams.testCateId"
          placeholder="请输入测试分类ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目代码" prop="programCode">
        <el-input
          v-model="queryParams.programCode"
          placeholder="请输入项目代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数量" prop="qty">
        <el-input
          v-model="queryParams.qty"
          placeholder="请输入数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数量单位" prop="qtyUnits">
        <el-input
          v-model="queryParams.qtyUnits"
          placeholder="请输入数量单位"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input
          v-model="queryParams.price"
          placeholder="请输入价格"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="附加价格" prop="addPrice">
        <el-input
          v-model="queryParams.addPrice"
          placeholder="请输入附加价格"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="价格单位" prop="priceUnits">
        <el-input
          v-model="queryParams.priceUnits"
          placeholder="请输入价格单位"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评估规则" prop="evaluateRule">
        <el-input
          v-model="queryParams.evaluateRule"
          placeholder="请输入评估规则"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="COP编号" prop="copNo">
        <el-input
          v-model="queryParams.copNo"
          placeholder="请输入COP编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="低限A" prop="lowA">
        <el-input
          v-model="queryParams.lowA"
          placeholder="请输入低限A"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="高限A" prop="highA">
        <el-input
          v-model="queryParams.highA"
          placeholder="请输入高限A"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="高限单位" prop="highAUnit">
        <el-input
          v-model="queryParams.highAUnit"
          placeholder="请输入高限单位"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位" prop="units">
        <el-input
          v-model="queryParams.units"
          placeholder="请输入单位"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否退休" prop="isRetire">
        <el-input
          v-model="queryParams.isRetire"
          placeholder="请输入是否退休"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否主项目" prop="isMainPro">
        <el-input
          v-model="queryParams.isMainPro"
          placeholder="请输入是否主项目"
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
      <el-form-item label="默认测试" prop="defaultTest">
        <el-input
          v-model="queryParams.defaultTest"
          placeholder="请输入默认测试"
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
      <el-form-item label="抽样计划" prop="drawPlan">
        <el-input
          v-model="queryParams.drawPlan"
          placeholder="请输入抽样计划"
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
      <el-form-item label="特殊组名称" prop="specialGroupName">
        <el-input
          v-model="queryParams.specialGroupName"
          placeholder="请输入特殊组名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主组汇总" prop="mainGroupZum">
        <el-input
          v-model="queryParams.mainGroupZum"
          placeholder="请输入主组汇总"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组编号" prop="groupNums">
        <el-input
          v-model="queryParams.groupNums"
          placeholder="请输入组编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始使用日期" prop="startUseDate">
        <el-date-picker clearable
          v-model="queryParams.startUseDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择开始使用日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="到期日期" prop="expirationDate">
        <el-date-picker clearable
          v-model="queryParams.expirationDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择到期日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工作流ID" prop="workflowId">
        <el-input
          v-model="queryParams.workflowId"
          placeholder="请输入工作流ID"
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
          v-hasPermi="['lims:sp_tests:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['lims:sp_tests:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['lims:sp_tests:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['lims:sp_tests:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="sp_testsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="spTestsId" />
      <el-table-column label="原系统ID" align="center" prop="originalId" />
      <el-table-column label="检测项目ID" align="center" prop="testsId" />
      <el-table-column label="执行标准ID" align="center" prop="sampleProgramsId" />
      <el-table-column label="项目ID" align="center" prop="projectId" />
      <el-table-column label="执行标准代码" align="center" prop="spCode" />
      <el-table-column label="方案测试名称" align="center" prop="spTestName" />
      <el-table-column label="测试名称" align="center" prop="testName" />
      <el-table-column label="测试别名" align="center" prop="testAlias" />
      <el-table-column label="特殊测试名称" align="center" prop="specialTestName" />
      <el-table-column label="测试分类ID" align="center" prop="testCateId" />
      <el-table-column label="测试类型" align="center" prop="testType" />
      <el-table-column label="方案类型" align="center" prop="profileType" />
      <el-table-column label="项目代码" align="center" prop="programCode" />
      <el-table-column label="数量" align="center" prop="qty" />
      <el-table-column label="数量单位" align="center" prop="qtyUnits" />
      <el-table-column label="价格" align="center" prop="price" />
      <el-table-column label="附加价格" align="center" prop="addPrice" />
      <el-table-column label="价格单位" align="center" prop="priceUnits" />
      <el-table-column label="标准" align="center" prop="criterion" />
      <el-table-column label="测试标准" align="center" prop="testCriterion" />
      <el-table-column label="评估规则" align="center" prop="evaluateRule" />
      <el-table-column label="COP编号" align="center" prop="copNo" />
      <el-table-column label="低限A" align="center" prop="lowA" />
      <el-table-column label="高限A" align="center" prop="highA" />
      <el-table-column label="高限单位" align="center" prop="highAUnit" />
      <el-table-column label="单位" align="center" prop="units" />
      <el-table-column label="文本限制" align="center" prop="charLimits" />
      <el-table-column label="数据参考" align="center" prop="dataReference" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="是否退休" align="center" prop="isRetire" />
      <el-table-column label="是否主项目" align="center" prop="isMainPro" />
      <el-table-column label="冻结标志" align="center" prop="freezeFlag" />
      <el-table-column label="默认测试" align="center" prop="defaultTest" />
      <el-table-column label="审核标志" align="center" prop="auditFlag" />
      <el-table-column label="审核级别" align="center" prop="auditLevel" />
      <el-table-column label="行审核" align="center" prop="rowAudit" />
      <el-table-column label="显示状态" align="center" prop="dispStatus" />
      <el-table-column label="报告类型" align="center" prop="reportType" />
      <el-table-column label="报告备注" align="center" prop="reportRemark" />
      <el-table-column label="抽样计划" align="center" prop="drawPlan" />
      <el-table-column label="部门" align="center" prop="dept" />
      <el-table-column label="成本中心ID" align="center" prop="ccId" />
      <el-table-column label="提交公司" align="center" prop="submitCorp" />
      <el-table-column label="特殊组名称" align="center" prop="specialGroupName" />
      <el-table-column label="主组汇总" align="center" prop="mainGroupZum" />
      <el-table-column label="组编号" align="center" prop="groupNums" />
      <el-table-column label="开始使用日期" align="center" prop="startUseDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startUseDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期日期" align="center" prop="expirationDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.expirationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本" align="center" prop="version" />
      <el-table-column label="方案描述" align="center" prop="profile" />
      <el-table-column label="说明描述" align="center" prop="explainDesc" />
      <el-table-column label="备注说明" align="center" prop="comments" />
      <el-table-column label="规格分析物备注" align="center" prop="specAnalytesComments" />
      <el-table-column label="工作流ID" align="center" prop="workflowId" />
      <el-table-column label="排序" align="center" prop="sorter" />
      <el-table-column label="记录者描述" align="center" prop="recorderDesc" />
      <el-table-column label="审核人代码" align="center" prop="auditorCode" />
      <el-table-column label="审核人描述" align="center" prop="auditorDesc" />
      <el-table-column label="审核时间" align="center" prop="auditTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
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
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lims:sp_tests:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lims:sp_tests:remove']">删除</el-button>
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

    <!-- 添加或修改方案项目对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="sp_testsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="原系统ID" prop="originalId">
          <el-input v-model="form.originalId" placeholder="请输入原系统ID" />
        </el-form-item>
        <el-form-item label="检测项目ID" prop="testsId">
          <el-input v-model="form.testsId" placeholder="请输入检测项目ID" />
        </el-form-item>
        <el-form-item label="执行标准ID" prop="sampleProgramsId">
          <el-input v-model="form.sampleProgramsId" placeholder="请输入执行标准ID" />
        </el-form-item>
        <el-form-item label="项目ID" prop="projectId">
          <el-input v-model="form.projectId" placeholder="请输入项目ID" />
        </el-form-item>
        <el-form-item label="执行标准代码" prop="spCode">
          <el-input v-model="form.spCode" placeholder="请输入执行标准代码" />
        </el-form-item>
        <el-form-item label="方案测试名称" prop="spTestName">
          <el-input v-model="form.spTestName" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="测试名称" prop="testName">
          <el-input v-model="form.testName" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="测试别名" prop="testAlias">
          <el-input v-model="form.testAlias" placeholder="请输入测试别名" />
        </el-form-item>
        <el-form-item label="特殊测试名称" prop="specialTestName">
          <el-input v-model="form.specialTestName" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="测试分类ID" prop="testCateId">
          <el-input v-model="form.testCateId" placeholder="请输入测试分类ID" />
        </el-form-item>
        <el-form-item label="项目代码" prop="programCode">
          <el-input v-model="form.programCode" placeholder="请输入项目代码" />
        </el-form-item>
        <el-form-item label="数量" prop="qty">
          <el-input v-model="form.qty" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="数量单位" prop="qtyUnits">
          <el-input v-model="form.qtyUnits" placeholder="请输入数量单位" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="附加价格" prop="addPrice">
          <el-input v-model="form.addPrice" placeholder="请输入附加价格" />
        </el-form-item>
        <el-form-item label="价格单位" prop="priceUnits">
          <el-input v-model="form.priceUnits" placeholder="请输入价格单位" />
        </el-form-item>
        <el-form-item label="标准" prop="criterion">
          <el-input v-model="form.criterion" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="测试标准" prop="testCriterion">
          <el-input v-model="form.testCriterion" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="评估规则" prop="evaluateRule">
          <el-input v-model="form.evaluateRule" placeholder="请输入评估规则" />
        </el-form-item>
        <el-form-item label="COP编号" prop="copNo">
          <el-input v-model="form.copNo" placeholder="请输入COP编号" />
        </el-form-item>
        <el-form-item label="低限A" prop="lowA">
          <el-input v-model="form.lowA" placeholder="请输入低限A" />
        </el-form-item>
        <el-form-item label="高限A" prop="highA">
          <el-input v-model="form.highA" placeholder="请输入高限A" />
        </el-form-item>
        <el-form-item label="高限单位" prop="highAUnit">
          <el-input v-model="form.highAUnit" placeholder="请输入高限单位" />
        </el-form-item>
        <el-form-item label="单位" prop="units">
          <el-input v-model="form.units" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="文本限制" prop="charLimits">
          <el-input v-model="form.charLimits" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="数据参考" prop="dataReference">
          <el-input v-model="form.dataReference" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否退休" prop="isRetire">
          <el-input v-model="form.isRetire" placeholder="请输入是否退休" />
        </el-form-item>
        <el-form-item label="是否主项目" prop="isMainPro">
          <el-input v-model="form.isMainPro" placeholder="请输入是否主项目" />
        </el-form-item>
        <el-form-item label="冻结标志" prop="freezeFlag">
          <el-input v-model="form.freezeFlag" placeholder="请输入冻结标志" />
        </el-form-item>
        <el-form-item label="默认测试" prop="defaultTest">
          <el-input v-model="form.defaultTest" placeholder="请输入默认测试" />
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
        <el-form-item label="报告备注" prop="reportRemark">
          <el-input v-model="form.reportRemark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="抽样计划" prop="drawPlan">
          <el-input v-model="form.drawPlan" placeholder="请输入抽样计划" />
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
        <el-form-item label="特殊组名称" prop="specialGroupName">
          <el-input v-model="form.specialGroupName" placeholder="请输入特殊组名称" />
        </el-form-item>
        <el-form-item label="主组汇总" prop="mainGroupZum">
          <el-input v-model="form.mainGroupZum" placeholder="请输入主组汇总" />
        </el-form-item>
        <el-form-item label="组编号" prop="groupNums">
          <el-input v-model="form.groupNums" placeholder="请输入组编号" />
        </el-form-item>
        <el-form-item label="开始使用日期" prop="startUseDate">
          <el-date-picker clearable
            v-model="form.startUseDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始使用日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期日期" prop="expirationDate">
          <el-date-picker clearable
            v-model="form.expirationDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择到期日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本" />
        </el-form-item>
        <el-form-item label="方案描述" prop="profile">
          <file-upload v-model="form.profile"/>
        </el-form-item>
        <el-form-item label="说明描述" prop="explainDesc">
          <el-input v-model="form.explainDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注说明" prop="comments">
          <el-input v-model="form.comments" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="规格分析物备注" prop="specAnalytesComments">
          <el-input v-model="form.specAnalytesComments" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="工作流ID" prop="workflowId">
          <el-input v-model="form.workflowId" placeholder="请输入工作流ID" />
        </el-form-item>
        <el-form-item label="排序" prop="sorter">
          <el-input v-model="form.sorter" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="记录者描述" prop="recorderDesc">
          <el-input v-model="form.recorderDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="审核人代码" prop="auditorCode">
          <el-input v-model="form.auditorCode" placeholder="请输入审核人代码" />
        </el-form-item>
        <el-form-item label="审核人描述" prop="auditorDesc">
          <el-input v-model="form.auditorDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="审核时间" prop="auditTime">
          <el-date-picker clearable
            v-model="form.auditTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择审核时间">
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

<script setup name="Sp_tests">
import { listSp_tests, getSp_tests, delSp_tests, addSp_tests, updateSp_tests } from "@/api/lims/sp_tests"

const { proxy } = getCurrentInstance()

const sp_testsList = ref([])
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
    testsId: null,
    sampleProgramsId: null,
    projectId: null,
    spCode: null,
    spTestName: null,
    testName: null,
    testAlias: null,
    specialTestName: null,
    testCateId: null,
    testType: null,
    profileType: null,
    programCode: null,
    qty: null,
    qtyUnits: null,
    price: null,
    addPrice: null,
    priceUnits: null,
    criterion: null,
    testCriterion: null,
    evaluateRule: null,
    copNo: null,
    lowA: null,
    highA: null,
    highAUnit: null,
    units: null,
    charLimits: null,
    dataReference: null,
    status: null,
    isRetire: null,
    isMainPro: null,
    freezeFlag: null,
    defaultTest: null,
    auditFlag: null,
    auditLevel: null,
    rowAudit: null,
    dispStatus: null,
    reportType: null,
    reportRemark: null,
    drawPlan: null,
    dept: null,
    ccId: null,
    submitCorp: null,
    specialGroupName: null,
    mainGroupZum: null,
    groupNums: null,
    startUseDate: null,
    expirationDate: null,
    version: null,
    profile: null,
    explainDesc: null,
    comments: null,
    specAnalytesComments: null,
    workflowId: null,
    sorter: null,
    recorderDesc: null,
    auditorCode: null,
    auditorDesc: null,
    auditTime: null,
    freezerCode: null,
    freezerDesc: null,
    freezeTime: null,
  },
  rules: {
    spCode: [
      { required: true, message: "执行标准代码不能为空", trigger: "blur" }
    ],
    spTestName: [
      { required: true, message: "方案测试名称不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询方案项目列表 */
function getList() {
  loading.value = true
  listSp_tests(queryParams.value).then(response => {
    sp_testsList.value = response.rows
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
    spTestsId: null,
    originalId: null,
    testsId: null,
    sampleProgramsId: null,
    projectId: null,
    spCode: null,
    spTestName: null,
    testName: null,
    testAlias: null,
    specialTestName: null,
    testCateId: null,
    testType: null,
    profileType: null,
    programCode: null,
    qty: null,
    qtyUnits: null,
    price: null,
    addPrice: null,
    priceUnits: null,
    criterion: null,
    testCriterion: null,
    evaluateRule: null,
    copNo: null,
    lowA: null,
    highA: null,
    highAUnit: null,
    units: null,
    charLimits: null,
    dataReference: null,
    status: null,
    isRetire: null,
    isMainPro: null,
    freezeFlag: null,
    defaultTest: null,
    auditFlag: null,
    auditLevel: null,
    rowAudit: null,
    dispStatus: null,
    reportType: null,
    reportRemark: null,
    drawPlan: null,
    dept: null,
    ccId: null,
    submitCorp: null,
    specialGroupName: null,
    mainGroupZum: null,
    groupNums: null,
    startUseDate: null,
    expirationDate: null,
    version: null,
    profile: null,
    explainDesc: null,
    comments: null,
    specAnalytesComments: null,
    workflowId: null,
    sorter: null,
    recorderDesc: null,
    auditorCode: null,
    auditorDesc: null,
    auditTime: null,
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
  proxy.resetForm("sp_testsRef")
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
  ids.value = selection.map(item => item.spTestsId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加方案项目"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _spTestsId = row.spTestsId || ids.value
  getSp_tests(_spTestsId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改方案项目"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sp_testsRef"].validate(valid => {
    if (valid) {
      if (form.value.spTestsId != null) {
        updateSp_tests(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addSp_tests(form.value).then(response => {
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
  const _spTestsIds = row.spTestsId || ids.value
  proxy.$modal.confirm('是否确认删除方案项目编号为"' + _spTestsIds + '"的数据项？').then(function() {
    return delSp_tests(_spTestsIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('lims/sp_tests/export', {
    ...queryParams.value
  }, `sp_tests_${new Date().getTime()}.xlsx`)
}

getList()
</script>
