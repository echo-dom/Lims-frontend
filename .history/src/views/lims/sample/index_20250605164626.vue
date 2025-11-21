<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-form :model="queryParams" inline>
      <el-form-item label="样品编号">
        <el-input v-model="queryParams.sampleNo" placeholder="请输入样品编号" />
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input v-model="queryParams.productName" placeholder="请输入产品名称" />
      </el-form-item>
      <el-form-item label="到期时间">
        <el-date-picker
          v-model="queryParams.expireRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 留样列表 -->
    <el-table :data="retainList" v-loading="loading" border>
      <el-table-column label="样品编号" prop="sampleNo" width="150" />
      <el-table-column label="产品名称" prop="productName" />
      <el-table-column label="生产批号" prop="batchNo" width="120" />
      <el-table-column label="留样位置" prop="locationCode" width="120">
        <template #default="{ row }">
          <el-tag>{{ row.locationCode }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="入库时间" prop="storeTime" width="180" />
      <el-table-column label="到期时间" prop="expireTime" width="180">
        <template #default="{ row }">
          <span :class="{ 'expire-soon': isExpireSoon(row.expireTime) }">
            {{ row.expireTime }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="环境监测" width="120">
        <template #default="{ row }">
          <div>温度: {{ row.temperature }}℃</div>
          <div>湿度: {{ row.humidity }}%</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleDetail(row)">详情</el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="handleDestroy(row)"
            :disabled="!canDestroy(row)"
          >
            销毁
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination 
      v-show="total > 0" 
      :total="total" 
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 销毁对话框 -->
    <DestroyDialog ref="destroyDialog" @success="getList" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { getRetainList } from '@/api/lims/retain'
import DestroyDialog from './DestroyDialog.vue'

const queryParams = reactive({
  sampleNo: '',
  productName: '',
  expireRange: [],
  pageNum: 1,
  pageSize: 10
})

const retainList = ref([])
const total = ref(0)
const loading = ref(false)

// 获取留样列表
const getList = async () => {
  loading.value = true
  try {
    const res = await getRetainList(queryParams)
    retainList.value = res.rows
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 判断是否即将到期（3天内）
const isExpireSoon = (expireTime) => {
  const expireDate = new Date(expireTime)
  const now = new Date()
  const diffDays = Math.ceil((expireDate - now) / (1000 * 60 * 60 * 24))
  return diffDays <= 3 && diffDays >= 0
}

// 是否可以销毁（已到期）
const canDestroy = (row) => {
  const expireDate = new Date(row.expireTime)
  const now = new Date()
  return now >= expireDate
}
</script>

<style scoped>
.expire-soon {
  color: #e6a23c;
  font-weight: bold;
}
</style>