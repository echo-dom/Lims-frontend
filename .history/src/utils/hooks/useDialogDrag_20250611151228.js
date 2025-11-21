export default function useDialogDrag(dialogEl, headerEl) {
  if (!dialogEl || !headerEl) return

  // 首先清理可能遗留的 onmousedown（防止重复绑定）
  headerEl.onmousedown = null

  // 设置光标与防止选中文本
  headerEl.style.cursor = 'move'
  headerEl.onselectstart = () => false

  headerEl.onmousedown = e => {
    e.preventDefault()
    // 获取初始位置
    // 使用 getBoundingClientRect 得到初始 left/top 相对于视口
    const rect = dialogEl.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const initialLeft = rect.left
    const initialTop = rect.top
    const dialogWidth = rect.width
    const dialogHeight = rect.height
    const viewWidth = window.innerWidth
    const viewHeight = window.innerHeight

    // 绑定移动事件
    function onMouseMove(e) {
      // 计算偏移
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      let newLeft = initialLeft + deltaX
      let newTop = initialTop + deltaY

      // 边界限制：不让弹窗移出可视区
      if (newLeft < 0) newLeft = 0
      if (newTop < 0) newTop = 0
      if (newLeft + dialogWidth > viewWidth) newLeft = viewWidth - dialogWidth
      if (newTop + dialogHeight > viewHeight) newTop = viewHeight - dialogHeight

      // 应用位置
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
