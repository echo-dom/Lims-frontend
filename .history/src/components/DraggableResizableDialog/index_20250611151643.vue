<template>
  <el-dialog
    v-model="visible"
    custom-class="draggable-dialog-{{ uniqueId }}"  <!-- 唯一 class -->
    :width="isFullscreen ? '100%' : width"
    :fullscreen="isFullscreen"
    :top="isFullscreen ? '0px' : top"
    :append-to-body="true"
    :destroy-on-close="true"
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

// 生成简单唯一 ID，可根据需求用更复杂方案
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

// 全屏控制
const isFullscreen = ref(false)
function toggleFullscreen() {
  // 切换前可记录原始 width/top
  if (!isFullscreen.value) {
    originalWidth.value = widthRef.value
    originalTop.value = topRef.value
  }
  isFullscreen.value = !isFullscreen.value
  // 退出全屏后需要重新绑定拖动，使 header onmousedown 生效
  if (!isFullscreen.value && visible.value) {
    onOpen()  // 调用绑定
  }
}

// 存储原始 width/top，用于恢复
const originalWidth = ref(props.width)
const originalTop = ref(props.top)
// reactive refs for width/top, 用于 composable restore
const widthRef = ref(props.width)
const topRef = ref(props.top)

watch(
  () => props.width,
  val => {
    widthRef.value = val
  }
)
watch(
  () => props.top,
  val => {
    topRef.value = val
  }
)

function open() {
  visible.value = true
}
function close() {
  visible.value = false
}

// 唯一 class 名称，确保每个弹窗实例定位正确
const uniqueId = generateId()

// 使用 composable：传入 customClass（不带点）、全屏判断、restore refs
const customClass = `draggable-dialog-${uniqueId}`
const { onOpen } = useDialogDragResizable(customClass, () => isFullscreen.value, {
  restore: { widthRef: originalWidth, topRef: originalTop }
})

// 绑定弹窗打开事件
function handleOpen() {
  // 弹窗打开，首次绑定拖动
  onOpen()
}

// handleClose 可做清理
function handleClose() {
  // 若需要清除某些状态可在此处理
}
</script>

<style scoped>
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 固定高度，确保拖动区域 */
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
