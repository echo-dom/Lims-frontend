export default function useDialogDrag(dialogEl, headerEl) {
  if (!dialogEl || !headerEl) return

  headerEl.style.cursor = 'move'

  headerEl.onmousedown = e => {
    const disX = e.clientX - dialogEl.offsetLeft
    const disY = e.clientY - dialogEl.offsetTop

    document.onmousemove = e => {
      let left = e.clientX - disX
      let top = e.clientY - disY

      dialogEl.style.margin = 0
      dialogEl.style.left = `${left}px`
      dialogEl.style.top = `${top}px`
      dialogEl.style.position = 'absolute'
    }

    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
}
