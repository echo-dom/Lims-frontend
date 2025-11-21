<template>
  <div class="table-wrapper">
    <!-- 操作栏 -->
    <div class="toolbar">
      <el-checkbox-group v-model="visibleColumnKeys">
        <el-checkbox
          v-for="item in columnList"
          :key="item.prop"
          :label="item.prop"
        >{{ item.label }}</el-checkbox>
      </el-checkbox-group>

      <div class="toolbar-buttons">
        <el-button
          v-for="(btn, index) in buttons"
          :key="index"
          :type="btn.type || 'primary'"
          @click="btn.onClick"
        >{{ btn.label }}</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="#" width="50" fixed="left" />

      <el-table-column
        v-for="col in filteredColumns"
        :key="col.prop"
        :label="col.label"
        :prop="col.prop"
        :width="col.width"
        :fixed="col.fixed"
      />

      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="table-footer">
      <div class="fixed-right-pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';

// Props
const props = defineProps({
  columns: Array,
  buttons: Array,
  data: Array,
  total: Number,
  pageSize: {
    type: Number,
    default: 10
  }
});

const emit = defineEmits(['refresh', 'add']);

const currentPage = ref(1);

const visibleColumnKeys = ref(props.columns.map(col => col.prop));

const filteredColumns = computed(() => {
  return props.columns.filter(col => visibleColumnKeys.value.includes(col.prop));
});

const tableData = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize;
  return props.data.slice(start, start + props.pageSize);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

const handleEdit = (row) => {
  ElMessage.success(`编辑 ${row.name}`);
};

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除 ${row.name} 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      ElMessage.success(`${row.name} 已删除`);
      emit('refresh');
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};
</script>

<style scoped>
.table-wrapper {
  position: relative;
  padding-bottom: 64px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.table-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  padding: 8px 16px;
  background: #fff;
  border-top: 1px solid #ebeef5;
  text-align: right;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.04);
}

.fixed-right-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
