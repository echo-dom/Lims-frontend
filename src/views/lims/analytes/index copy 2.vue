<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属检测项目ID" prop="testsid">
        <el-input
          v-model="queryParams.testsid"
          placeholder="请输入所属检测项目ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序号" prop="sorter">
        <el-input
          v-model="queryParams.sorter"
          placeholder="请输入排序号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分析项目名称" prop="analyte">
        <el-input
          v-model="queryParams.analyte"
          placeholder="请输入分析项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="别名" prop="sinonym">
        <el-input
          v-model="queryParams.sinonym"
          placeholder="请输入别名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修约" prop="picture">
        <el-input
          v-model="queryParams.picture"
          placeholder="请输入修约"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计量单位" prop="units">
        <el-input
          v-model="queryParams.units"
          placeholder="请输入计量单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="重复数" prop="repnum">
        <el-input
          v-model="queryParams.repnum"
          placeholder="请输入重复数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分析项类型：0=数字型，1=字符型，2=通用函数" prop="analyteype">
        <el-input
          v-model="queryParams.analyteype"
          placeholder="请输入分析项类型：0=数字型，1=字符型，2=通用函数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="报告显示" prop="displayflag">
        <el-input
          v-model="queryParams.displayflag"
          placeholder="请输入报告显示"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否科学计数" prop="scientflag">
        <el-input
          v-model="queryParams.scientflag"
          placeholder="请输入是否科学计数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="低限" prop="low">
        <el-input
          v-model="queryParams.low"
          placeholder="请输入低限"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="高限" prop="high">
        <el-input
          v-model="queryParams.high"
          placeholder="请输入高限"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否称重" prop="isweight">
        <el-input
          v-model="queryParams.isweight"
          placeholder="请输入是否称重"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公式名称" prop="calcname">
        <el-input
          v-model="queryParams.calcname"
          placeholder="请输入公式名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检测项目编码" prop="testcode">
        <el-input
          v-model="queryParams.testcode"
          placeholder="请输入检测项目编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检出限单位" prop="lowUnit">
        <el-input
          v-model="queryParams.lowUnit"
          placeholder="请输入检出限单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="定量限" prop="quantificationLimit">
        <el-input
          v-model="queryParams.quantificationLimit"
          placeholder="请输入定量限"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="定量限单位" prop="qltUnit">
        <el-input
          v-model="queryParams.qltUnit"
          placeholder="请输入定量限单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="纠正因子系数" prop="correctionfactor">
        <el-input
          v-model="queryParams.correctionfactor"
          placeholder="请输入纠正因子系数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="稀释倍数" prop="dilutionrate">
        <el-input
          v-model="queryParams.dilutionrate"
          placeholder="请输入稀释倍数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="定容体积" prop="volume">
        <el-input
          v-model="queryParams.volume"
          placeholder="请输入定容体积"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="方法中规定的检出限说明" prop="validlimitrem">
        <el-input
          v-model="queryParams.validlimitrem"
          placeholder="请输入方法中规定的检出限说明"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="检验方法" prop="method">
        <el-input
          v-model="queryParams.method"
          placeholder="请输入检验方法"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分析项目英文名" prop="analyteEn">
        <el-input
          v-model="queryParams.analyteEn"
          placeholder="请输入分析项目英文名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分析项目别名英文名" prop="sinonymEn">
        <el-input
          v-model="queryParams.sinonymEn"
          placeholder="请输入分析项目别名英文名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分析项目编码" prop="analytescode">
        <el-input
          v-model="queryParams.analytescode"
          placeholder="请输入分析项目编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="指标" prop="zb">
        <el-input
          v-model="queryParams.zb"
          placeholder="请输入指标"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否科学计数" prop="scientific">
        <el-input
          v-model="queryParams.scientific"
          placeholder="请输入是否科学计数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="未检出标志" prop="ltdflag">
        <el-input
          v-model="queryParams.ltdflag"
          placeholder="请输入未检出标志"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="未检出标志字符串" prop="ltdflagc">
        <el-input
          v-model="queryParams.ltdflagc"
          placeholder="请输入未检出标志字符串"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否现场采集" prop="isscene">
        <el-input
          v-model="queryParams.isscene"
          placeholder="请输入是否现场采集"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="未检出备注" prop="notdetectedremark">
        <el-input
          v-model="queryParams.notdetectedremark"
          placeholder="请输入未检出备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否公式显示" prop="isformula">
        <el-input
          v-model="queryParams.isformula"
          placeholder="请输入是否公式显示"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="不在原始记录中显示" prop="orinodisplayflag">
        <el-input
          v-model="queryParams.orinodisplayflag"
          placeholder="请输入不在原始记录中显示"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['lims:analytes:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['lims:analytes:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['lims:analytes:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['lims:analytes:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="analytesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="分析项ID，主键" align="center" prop="analytesid" />
      <el-table-column label="所属检测项目ID" align="center" prop="testsid" />
      <el-table-column label="排序号" align="center" prop="sorter" />
      <el-table-column label="分析项目名称" align="center" prop="analyte" />
      <el-table-column label="别名" align="center" prop="sinonym" />
      <el-table-column label="修约" align="center" prop="picture" />
      <el-table-column label="计量单位" align="center" prop="units" />
      <el-table-column label="重复数" align="center" prop="repnum" />
      <el-table-column label="分析项类型：0=数字型，1=字符型，2=通用函数" align="center" prop="analyteype" />
      <el-table-column label="报告显示" align="center" prop="displayflag" />
      <el-table-column label="是否科学计数" align="center" prop="scientflag" />
      <el-table-column label="低限" align="center" prop="low" />
      <el-table-column label="高限" align="center" prop="high" />
      <el-table-column label="版本" align="center" prop="version" />
      <el-table-column label="是否称重" align="center" prop="isweight" />
      <el-table-column label="公式名称" align="center" prop="calcname" />
      <el-table-column label="检测项目编码" align="center" prop="testcode" />
      <el-table-column label="检出限单位" align="center" prop="lowUnit" />
      <el-table-column label="定量限" align="center" prop="quantificationLimit" />
      <el-table-column label="定量限单位" align="center" prop="qltUnit" />
      <el-table-column label="纠正因子系数" align="center" prop="correctionfactor" />
      <el-table-column label="稀释倍数" align="center" prop="dilutionrate" />
      <el-table-column label="定容体积" align="center" prop="volume" />
      <el-table-column label="方法中规定的检出限说明" align="center" prop="validlimitrem" />
      <el-table-column label="检验方法" align="center" prop="method" />
      <el-table-column label="类型" align="center" prop="analtype" />
      <el-table-column label="分析项备注" align="center" prop="analyteremark" />
      <el-table-column label="分析项目英文名" align="center" prop="analyteEn" />
      <el-table-column label="分析项目别名英文名" align="center" prop="sinonymEn" />
      <el-table-column label="分析项目编码" align="center" prop="analytescode" />
      <el-table-column label="公式文本" align="center" prop="formulatext" />
      <el-table-column label="指标" align="center" prop="zb" />
      <el-table-column label="数据转换格式" align="center" prop="datareference" />
      <el-table-column label="是否科学计数" align="center" prop="scientific" />
      <el-table-column label="未检出标志" align="center" prop="ltdflag" />
      <el-table-column label="未检出标志字符串" align="center" prop="ltdflagc" />
      <el-table-column label="是否现场采集" align="center" prop="isscene" />
      <el-table-column label="未检出备注" align="center" prop="notdetectedremark" />
      <el-table-column label="方法备注" align="center" prop="testremark" />
      <el-table-column label="是否公式显示" align="center" prop="isformula" />
      <el-table-column label="报告备注" align="center" prop="reportremark" />
      <el-table-column label="判定规则" align="center" prop="decisionrules" />
      <el-table-column label="不在原始记录中显示" align="center" prop="orinodisplayflag" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['lims:analytes:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['lims:analytes:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改分析项目定义对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属检测项目ID" prop="testsid">
          <el-input v-model="form.testsid" placeholder="请输入所属检测项目ID" />
        </el-form-item>
        <el-form-item label="排序号" prop="sorter">
          <el-input v-model="form.sorter" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="分析项目名称" prop="analyte">
          <el-input v-model="form.analyte" placeholder="请输入分析项目名称" />
        </el-form-item>
        <el-form-item label="别名" prop="sinonym">
          <el-input v-model="form.sinonym" placeholder="请输入别名" />
        </el-form-item>
        <el-form-item label="修约" prop="picture">
          <el-input v-model="form.picture" placeholder="请输入修约" />
        </el-form-item>
        <el-form-item label="计量单位" prop="units">
          <el-input v-model="form.units" placeholder="请输入计量单位" />
        </el-form-item>
        <el-form-item label="重复数" prop="repnum">
          <el-input v-model="form.repnum" placeholder="请输入重复数" />
        </el-form-item>
        <el-form-item label="分析项类型：0=数字型，1=字符型，2=通用函数" prop="analyteype">
          <el-input v-model="form.analyteype" placeholder="请输入分析项类型：0=数字型，1=字符型，2=通用函数" />
        </el-form-item>
        <el-form-item label="报告显示" prop="displayflag">
          <el-input v-model="form.displayflag" placeholder="请输入报告显示" />
        </el-form-item>
        <el-form-item label="是否科学计数" prop="scientflag">
          <el-input v-model="form.scientflag" placeholder="请输入是否科学计数" />
        </el-form-item>
        <el-form-item label="低限" prop="low">
          <el-input v-model="form.low" placeholder="请输入低限" />
        </el-form-item>
        <el-form-item label="高限" prop="high">
          <el-input v-model="form.high" placeholder="请输入高限" />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本" />
        </el-form-item>
        <el-form-item label="是否称重" prop="isweight">
          <el-input v-model="form.isweight" placeholder="请输入是否称重" />
        </el-form-item>
        <el-form-item label="公式名称" prop="calcname">
          <el-input v-model="form.calcname" placeholder="请输入公式名称" />
        </el-form-item>
        <el-form-item label="检测项目编码" prop="testcode">
          <el-input v-model="form.testcode" placeholder="请输入检测项目编码" />
        </el-form-item>
        <el-form-item label="检出限单位" prop="lowUnit">
          <el-input v-model="form.lowUnit" placeholder="请输入检出限单位" />
        </el-form-item>
        <el-form-item label="定量限" prop="quantificationLimit">
          <el-input v-model="form.quantificationLimit" placeholder="请输入定量限" />
        </el-form-item>
        <el-form-item label="定量限单位" prop="qltUnit">
          <el-input v-model="form.qltUnit" placeholder="请输入定量限单位" />
        </el-form-item>
        <el-form-item label="纠正因子系数" prop="correctionfactor">
          <el-input v-model="form.correctionfactor" placeholder="请输入纠正因子系数" />
        </el-form-item>
        <el-form-item label="稀释倍数" prop="dilutionrate">
          <el-input v-model="form.dilutionrate" placeholder="请输入稀释倍数" />
        </el-form-item>
        <el-form-item label="定容体积" prop="volume">
          <el-input v-model="form.volume" placeholder="请输入定容体积" />
        </el-form-item>
        <el-form-item label="方法中规定的检出限说明" prop="validlimitrem">
          <el-input v-model="form.validlimitrem" placeholder="请输入方法中规定的检出限说明" />
        </el-form-item>
        <el-form-item label="检验方法" prop="method">
          <el-input v-model="form.method" placeholder="请输入检验方法" />
        </el-form-item>
        <el-form-item label="分析项备注" prop="analyteremark">
          <el-input v-model="form.analyteremark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="分析项目英文名" prop="analyteEn">
          <el-input v-model="form.analyteEn" placeholder="请输入分析项目英文名" />
        </el-form-item>
        <el-form-item label="分析项目别名英文名" prop="sinonymEn">
          <el-input v-model="form.sinonymEn" placeholder="请输入分析项目别名英文名" />
        </el-form-item>
        <el-form-item label="分析项目编码" prop="analytescode">
          <el-input v-model="form.analytescode" placeholder="请输入分析项目编码" />
        </el-form-item>
        <el-form-item label="公式文本" prop="formulatext">
          <el-input v-model="form.formulatext" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="指标" prop="zb">
          <el-input v-model="form.zb" placeholder="请输入指标" />
        </el-form-item>
        <el-form-item label="数据转换格式" prop="datareference">
          <el-input v-model="form.datareference" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否科学计数" prop="scientific">
          <el-input v-model="form.scientific" placeholder="请输入是否科学计数" />
        </el-form-item>
        <el-form-item label="未检出标志" prop="ltdflag">
          <el-input v-model="form.ltdflag" placeholder="请输入未检出标志" />
        </el-form-item>
        <el-form-item label="未检出标志字符串" prop="ltdflagc">
          <el-input v-model="form.ltdflagc" placeholder="请输入未检出标志字符串" />
        </el-form-item>
        <el-form-item label="是否现场采集" prop="isscene">
          <el-input v-model="form.isscene" placeholder="请输入是否现场采集" />
        </el-form-item>
        <el-form-item label="未检出备注" prop="notdetectedremark">
          <el-input v-model="form.notdetectedremark" placeholder="请输入未检出备注" />
        </el-form-item>
        <el-form-item label="方法备注" prop="testremark">
          <el-input v-model="form.testremark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否公式显示" prop="isformula">
          <el-input v-model="form.isformula" placeholder="请输入是否公式显示" />
        </el-form-item>
        <el-form-item label="报告备注" prop="reportremark">
          <el-input v-model="form.reportremark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="判定规则" prop="decisionrules">
          <el-input v-model="form.decisionrules" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="不在原始记录中显示" prop="orinodisplayflag">
          <el-input v-model="form.orinodisplayflag" placeholder="请输入不在原始记录中显示" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAnalytes, getAnalytes, delAnalytes, addAnalytes, updateAnalytes } from "@/api/lims/analytes"

export default {
  name: "Analytes",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 分析项目定义表格数据
      analytesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        testsid: null,
        sorter: null,
        analyte: null,
        sinonym: null,
        picture: null,
        units: null,
        repnum: null,
        analyteype: null,
        displayflag: null,
        scientflag: null,
        low: null,
        high: null,
        version: null,
        isweight: null,
        calcname: null,
        testcode: null,
        lowUnit: null,
        quantificationLimit: null,
        qltUnit: null,
        correctionfactor: null,
        dilutionrate: null,
        volume: null,
        validlimitrem: null,
        method: null,
        analtype: null,
        analyteremark: null,
        analyteEn: null,
        sinonymEn: null,
        analytescode: null,
        formulatext: null,
        zb: null,
        datareference: null,
        scientific: null,
        ltdflag: null,
        ltdflagc: null,
        isscene: null,
        notdetectedremark: null,
        testremark: null,
        isformula: null,
        reportremark: null,
        decisionrules: null,
        orinodisplayflag: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询分析项目定义列表 */
    getList() {
      this.loading = true
      listAnalytes(this.queryParams).then(response => {
        this.analytesList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        analytesid: null,
        testsid: null,
        sorter: null,
        analyte: null,
        sinonym: null,
        picture: null,
        units: null,
        repnum: null,
        analyteype: null,
        displayflag: null,
        scientflag: null,
        low: null,
        high: null,
        version: null,
        isweight: null,
        calcname: null,
        testcode: null,
        lowUnit: null,
        quantificationLimit: null,
        qltUnit: null,
        correctionfactor: null,
        dilutionrate: null,
        volume: null,
        validlimitrem: null,
        method: null,
        analtype: null,
        analyteremark: null,
        analyteEn: null,
        sinonymEn: null,
        analytescode: null,
        formulatext: null,
        zb: null,
        datareference: null,
        scientific: null,
        ltdflag: null,
        ltdflagc: null,
        isscene: null,
        notdetectedremark: null,
        testremark: null,
        isformula: null,
        reportremark: null,
        decisionrules: null,
        orinodisplayflag: null
      }
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.analytesid)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加分析项目定义"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const analytesid = row.analytesid || this.ids
      getAnalytes(analytesid).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改分析项目定义"
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.analytesid != null) {
            updateAnalytes(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addAnalytes(this.form).then(response => {
              this.$modal.msgSuccess("新增成功")
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const analytesids = row.analytesid || this.ids
      this.$modal.confirm('是否确认删除分析项目定义编号为"' + analytesids + '"的数据项？').then(function() {
        return delAnalytes(analytesids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('lims/analytes/export', {
        ...this.queryParams
      }, `analytes_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
