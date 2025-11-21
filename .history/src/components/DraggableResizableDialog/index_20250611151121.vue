<template>
  <el-dialog
    ref="dialogRef"
    v-model="visible"
    :width="isFullscreen ? '100%' : width"
    :fullscreen="isFullscreen"
    :top="isFullscreen ? '0px' : top"
    :append-to-body="true"
    :close-on-press-escape="true"
    :destroy-on-close="true"
    class="custom-draggable-dialog"
  >
    <!-- 自定义标题栏：保持默认 el-dialog__header 结构 -->
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
          <el-button size="small" icon="el-icon-close" text @click="visible = false" />
        </div>
      </div>
    </template>

    <div class="dialog-content">
      <!-- 弹窗主体内容通过 slot 传入 -->
      <slot />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import useDialogDrag from '@/utils/useDialogDrag' // 拖动逻辑封装

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '弹窗标题' },
  width: { type: String, default: '800px' },
  top: { type: String, default: '15vh' }
})
const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, val => {
  visible.value = val
  if (val) {
    // 弹窗打开后，在下一个 DOM 更新周期执行拖动初始化
    nextTick(() => {
      initDrag()
    })
  }
})
watch(visible, val => emit('update:modelValue', val))

const isFullscreen = ref(false)
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  // 全屏切换后，若退出全屏，需重新初始化拖动；若进入全屏，可不绑定拖动
  nextTick(() => {
    if (!isFullscreen.value && visible.value) {
      initDrag()
    }
  })
}

const dialogRef = ref(null)

function initDrag() {
  // 如果全屏则不绑定拖动
  if (isFullscreen.value) {
    return
  }
  // dialogRef.value 是组件实例，通过 $el 拿到根 DOM（el-dialog__wrapper）
  const comp = dialogRef.value
  if (!comp || !comp.$el) {
    return
  }
  // 在 el-dialog__wrapper 下查找 el-dialog 与 el-dialog__header
  const wrapperEl = comp.$el
  const dialogEl = wrapperEl.querySelector('.el-dialog')
  const headerEl = wrapperEl.querySelector('.el-dialog__header')
  if (dialogEl && headerEl) {
    useDialogDrag(dialogEl, headerEl)
  }
}

onBeforeUnmount(() => {
  // 如果需要，可在销毁时移除事件监听；useDialogDrag 绑定事件在 mouseup 后自动清理 document.onmousemove/onmouseup
})
</script>

<style scoped>
/* 确保自定义标题栏高度与 el-dialog__header 结构兼容 */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 固定高度，确保拖动区域一致；可根据实际 UI 调整 */
  height: 50px;
  line-height: 50px;
  padding: 0 12px;
}
/* 操作按钮区域 */
.dialog-header-actions {
  display: flex;
  gap: 4px;
}
/* 使 el-dialog 支持右下角拖拽放大缩小 */
.custom-draggable-dialog >>> .el-dialog {
  resize: both;
  overflow: auto;
}
</style>
