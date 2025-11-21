<template>
  <el-dialog
    v-model="visible"
    :width="dialogStyle.width"
    :top="dialogStyle.top"
    :fullscreen="isFullscreen"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    :destroy-on-close="true"
    :close-on-press-escape="true"
    class="custom-draggable-dialog"
    v-dialog-drag-resize-fullscreen="!isFullscreen"  <!-- ✅ 控制是否允许拖动 -->
  >
    <template #title>
      <div class="dialog-title-bar">
        <span>{{ title }}</span>
        <div class="dialog-title-actions">
          <el-button
            size="small"
            icon="el-icon-full-screen"
            @click="toggleFullscreen"
            text
          />
          <el-button size="small" icon="el-icon-close" @click="handleClose" text />
        </div>
      </div>
    </template>

    <div class="dialog-content">
      <slot></slot>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '弹窗标题' }
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, val => (visible.value = val))
watch(visible, val => emit('update:modelValue', val))

const isFullscreen = ref(false)
const dialogStyle = ref({
  width: '800px',
  top: '15vh'
})

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  if (!isFullscreen.value) {
    dialogStyle.value.width = '800px'
    dialogStyle.value.top = '15vh'
  }
}

function handleClose() {
  visible.value = false
}

// ✅ ESC 手动监听（可选：如果想更灵活控制）
const handleEscClose = e => {
  if (e.key === 'Escape' && visible.value) {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscClose)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscClose)
})
</script>

<style scoped>
.dialog-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialog-title-actions {
  display: flex;
  gap: 4px;
}
.custom-draggable-dialog >>> .el-dialog {
  resize: both;
  overflow: auto;
}
</style>
