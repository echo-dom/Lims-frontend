<template>
  <el-dialog
    ref="dialogRef"
    v-model="visible"
    :width="isFullscreen ? '100%' : width"
    :fullscreen="isFullscreen"
    :top="isFullscreen ? '0px' : top"
    :append-to-body="true"
    :close-on-press-escape="true"
    class="custom-dialog"
  >
    <template #title>
      <div class="dialog-header">
        <span>{{ title }}</span>
        <div>
          <el-button icon="FullScreen" text @click="toggleFullscreen" />
          <el-button icon="Close" text @click="visible = false" />
        </div>
      </div>
    </template>

    <div class="dialog-content">
      <slot />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import useDialogDrag from './useDialogDrag.js' // 自定义 Hook，拖动逻辑抽出

const props = defineProps({
  modelValue: Boolean,
  title: String,
  width: { type: String, default: '800px' },
  top: { type: String, default: '15vh' }
})
const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, val => {
  visible.value = val
  if (val) initDrag()
})
watch(visible, val => emit('update:modelValue', val))

const isFullscreen = ref(false)
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (!isFullscreen.value) initDrag()
}

const dialogRef = ref(null)

function initDrag() {
  nextTick(() => {
    if (dialogRef.value && !isFullscreen.value) {
      const dialogEl = dialogRef.value.$el.querySelector('.el-dialog')
      const headerEl = dialogEl.querySelector('.el-dialog__header')
      useDialogDrag(dialogEl, headerEl)
    }
  })
}
</script>
