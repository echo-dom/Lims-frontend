import { nextTick } from 'vue'

/**
 * useDialogDragResizable：绑定拖动和全屏切换后的重新绑定逻辑。
 * @param {String} customClass - 用于定位当前弹窗 wrapper 的 class 名，不要带点，如 'draggable-dialog-xxx'。
 * @param {Function} isFullscreenFn - 返回布尔：当前是否全屏，若全屏时禁用拖动。可传 () => isFullscreen.value。
 * @param {Object} options - 可选项：
 *    - restore: { widthRef, topRef }，用于全屏切换回来时恢复原 width/top（字符串 ref）。
 */
export function useDialogDragResizable(customClass, isFullscreenFn, options = {}) {
  // 绑定拖动逻辑：每次弹窗打开或退出全屏后调用
  function bindDrag() {
    // 1. 定位 wrapper DOM
    const wrapper = document.querySelector('.' + customClass)
    if (!wrapper) {
      console.warn(`[useDialogDragResizable] 未找到 class="${customClass}" 的弹窗 wrapper`)
      return
    }
    // 2. 定位 el-dialog 主体和 header
    const dialogEl = wrapper.querySelector('.el-dialog')
    const headerEl = wrapper.querySelector('.el-dialog__header')
    if (!dialogEl || !headerEl) {
      console.warn('[useDialogDragResizable] 未找到 .el-dialog 或 .el-dialog__header，检查 Element Plus 版本和 DOM 结构')
      return
    }

    // 清理旧绑定，防止重复
    headerEl.onmousedown = null
    headerEl.onselectstart = null
    headerEl.style.cursor = 'move'
    headerEl.onselectstart = () => false

    headerEl.onmousedown = e => {
      // 如果全屏，则不允许拖动
      if (typeof isFullscreenFn === 'function' && isFullscreenFn()) {
        return
      }
      e.preventDefault()
      // 记录初始位置
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

        // 边界限制：不让弹窗移出可视区域
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

  // 当弹窗打开或退出全屏时调用，确保 nextTick 后 DOM 已就绪
  function onOpen() {
    nextTick(() => {
      bindDrag()
      // 如果 options.restore 包含 widthRef/topRef，可在此恢复原始尺寸
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
