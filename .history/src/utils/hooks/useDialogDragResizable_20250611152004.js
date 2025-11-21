// src/composables/useDialogDragResizable.js
import { nextTick } from 'vue'

/**
 * useDialogDragResizable：绑定拖动，并在弹窗打开或退出全屏后重新绑定
 * @param {String} customClass - 定位 wrapper 的 class 名（不带点）
 * @param {Function} isFullscreenFn - 返回 boolean：当前是否全屏
 * @param {Object} options - 可选 restore，用于退出全屏后恢复 width/top
 */
export function useDialogDragResizable(customClass, isFullscreenFn, options = {}) {
  function bindDrag() {
    const wrapper = document.querySelector('.' + customClass)
    if (!wrapper) {
      console.warn(`[useDialogDragResizable] 未找到 class="${customClass}" 的弹窗 wrapper`)
      return
    }
    const dialogEl = wrapper.querySelector('.el-dialog')
    const headerEl = wrapper.querySelector('.el-dialog__header')
    if (!dialogEl || !headerEl) {
      console.warn('[useDialogDragResizable] 未找到 .el-dialog 或 .el-dialog__header')
      return
    }

    // 清理旧绑定
    headerEl.onmousedown = null
    headerEl.onselectstart = null
    headerEl.style.cursor = 'move'
    headerEl.onselectstart = () => false

    headerEl.onmousedown = e => {
      if (typeof isFullscreenFn === 'function' && isFullscreenFn()) {
        return
      }
      e.preventDefault()
      const rect = dialogEl.getBoundingClientRect()
      const startX = e.clientX
      const startY = e.clientY
      const initialLeft = rect.left
      const initialTop = rect.top
      const dialogWidth = rect.width
      const dialogHeight = rect.height
      const viewWidth = window.innerWidth
      const viewHeight = window.innerHeight

      function onMouseMove(e) {
        let deltaX = e.clientX - startX
        let deltaY = e.clientY - startY
        let newLeft = initialLeft + deltaX
        let newTop = initialTop + deltaY
        if (newLeft < 0) newLeft = 0
        if (newTop < 0) newTop = 0
        if (newLeft + dialogWidth > viewWidth) newLeft = viewWidth - dialogWidth
        if (newTop + dialogHeight > viewHeight) newTop = viewHeight - dialogHeight

        dialogEl.style.position = 'fixed'
        dialogEl.style.margin = '0'
        dialogEl.style.left = newLeft + 'px'
        dialogEl.style.top = newTop + 'px'
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
  }

  function onOpen() {
    nextTick(() => {
      bindDrag()
      // 退出全屏时恢复 width/top
      if (options.restore && options.restore.widthRef && options.restore.topRef) {
        const cls = '.' + customClass + ' .el-dialog'
        const dialogEl = document.querySelector(cls)
        if (dialogEl) {
          dialogEl.style.width = options.restore.widthRef.value
          dialogEl.style.top = options.restore.topRef.value
        }
      }
    })
  }

  return {
    bindDrag,
    onOpen
  }
}
