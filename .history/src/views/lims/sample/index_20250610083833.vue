<template>
  <CustomTable
    :title="用户列表"
    :columnList="columns"
    :getDataApi="getUserList"
    :buttonActions="actions"
    @action="handleAction"
  />
</template>

<script setup>
// 列定义示例
const columns = ref([
  { prop: 'id', label: 'ID', width: 80, fixed: 'left' },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'phone', label: '手机号' },
  { prop: 'createTime', label: '创建时间', type: 'date' }
]);

// 按钮配置示例
const actions = ref([
  { text: '新增用户', command: 'add-user' },
  { text: '导出Excel', command: 'export-excel' }
]);

// 操作处理
const handleAction = (command) => {
  if (command === 'add-user') {
    // 处理新增用户逻辑
  }
};
</script>