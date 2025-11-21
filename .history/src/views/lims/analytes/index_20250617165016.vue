<template>
  <div
    style="height: 250px; box-shadow: var(--el-border-color-light) 0px 0px 10px"
  >
    <el-splitter class="h-[400px]"> <!-- 必须设置高度 -->
  <el-splitter-pane size="40%">
    <div class="p-4 bg-gray-100 h-full">左边</div>
  </el-splitter-pane>
  <el-splitter-pane>
    <div class="p-4 bg-gray-200 h-full">右边</div>
  </el-splitter-pane>
</el-splitter>

  </div>
</template>

<style scoped>
.demo-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.el-splitter__trigger {
  background-color: #dcdfe6 !important; /* Element Plus 默认分割条颜色 */
}

</style>