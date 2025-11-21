<template>
  <el-dialog
    v-model="visible"
    :custom-class="dialogClass"
    :width="isFullscreen ? '100%' : widthRef"
    :fullscreen="isFullscreen"
    :top="isFullscreen ? '0px' : topRef"
    append-to-body
    destroy-on-close
    :close-on-press-escape="true"
    @open="handleOpen"
    @close="handleClose"
  >
    <template #title>
      <div class="dialog-header">
        <span>{{ title }}</span>
        <div class="dialog-header-actions">
          <el-button
            size="small"
            :icon="isFullscreen ? 'el-icon-crop' : 'el-icon-full-screen'"
            text
            @click="toggleFullscreen"
          />
          <el-button size="small" icon="el-icon-close" text @click="close" />
        </div>
      </div>
    </template>

    <div class="dialog-content">
      <slot />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDialogDragResizable } from '@/composables/useDialogDragResizable'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '弹窗标题' },
  width: { type: String, default: '800px' },
  top: { type: String, default: '15vh' }
})
const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, val => (visible.value = val))
watch(visible, val => emit('update:modelValue', val))

// 全屏状态
const isFullscreen = ref(false)
// 存储并管理 width/top，以便退出全屏时恢复
const originalWidth = ref(props.width)
const originalTop = ref(props.top)
const widthRef = ref(props.width)
const topRef = ref(props.top)

watch(
  () => props.width,
  val => {
    widthRef.value = val
    originalWidth.value = val
  }
)
watch(
  () => props.top,
  val => {
    topRef.value = val
    originalTop.value = val
  }
)

const uniqueId = generateId()
// dialogClass 用于绑定 custom-class；Vue 绑定时用 v-bind
const dialogClass = `draggable-dialog-${uniqueId}`

function toggleFullscreen() {
  // 进入全屏前记录当前 width/top
  if (!isFullscreen.value) {
    originalWidth.value = widthRef.value
    originalTop.value = topRef.value
  }
  isFullscreen.value = !isFullscreen.value
  // 退出全屏后重新绑定拖动并恢复大小
  if (!isFullscreen.value && visible.value) {
    onOpen()
  }
}

function open() {
  visible.value = true
}
function close() {
  visible.value = false
}

function handleOpen() {
  onOpen()
}

function handleClose() {
  // 如需清理，可在此添加逻辑
}

// 使用 composable，传入 customClass（不带点）、全屏判断、restore refs
const { onOpen } = useDialogDragResizable(
  dialogClass,
  () => isFullscreen.value,
  { restore: { widthRef: originalWidth, topRef: originalTop } }
)
</script>

<style scoped>
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  line-height: 50px;
  padding: 0 12px;
}
.dialog-header-actions {
  display: flex;
  gap: 4px;
}
/* 支持右下角拖拽放大缩小 */
.draggable-dialog >>> .el-dialog {
  resize: both;
  overflow: auto;
}
</style>
