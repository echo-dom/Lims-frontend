<template>
  <div class="h-screen p-4">
    <el-splitter direction="horizontal" class="h-full border rounded shadow">
      <el-splitter-pane size="40%">
        <div class="h-full p-4 bg-blue-100">左边内容</div>
      </el-splitter-pane>
      <el-splitter-pane>
        <div class="h-full p-4 bg-green-100">右边内容</div>
      </el-splitter-pane>
    </el-splitter>
  </div>
</template>

<script setup>
// import { ElSplitter, ElSplitterPane } from 'element-plus'
</script>
