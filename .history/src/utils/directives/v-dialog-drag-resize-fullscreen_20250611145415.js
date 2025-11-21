export default {
  mounted(el, binding) {
    const headerEl = el.querySelector('.el-dialog__header')
    const dialogEl = el.querySelector('.el-dialog')

    if (!headerEl || !dialogEl) return

    headerEl.style.cursor = binding.value === false ? 'default' : 'move'

    let startX = 0, startY = 0, startLeft = 0, startTop = 0
    let isDragging = false

    headerEl.onmousedown = e => {
      if (binding.value === false) return // 🔒 禁止拖动

      isDragging = true
      startX = e.clientX
      startY = e.clientY
      startLeft = dialogEl.offsetLeft
      startTop = dialogEl.offsetTop

      document.onmousemove = e => {
        if (!isDragging) return
        dialogEl.style.margin = 0
        dialogEl.style.left = `${startLeft + e.clientX - startX}px`
        dialogEl.style.top = `${startTop + e.clientY - startY}px`
        dialogEl.style.position = 'absolute'
      }

      document.onmouseup = () => {
        isDragging = false
        document.onmousemove = null
        document.onmouseup = null
      }
    }

    headerEl.onselectstart = () => false
  },
  updated(el, binding) {
    const headerEl = el.querySelector('.el-dialog__header')
    if (headerEl) {
      headerEl.style.cursor = binding.value === false ? 'default' : 'move'
    }
  }
}
