<template>
  <div
    :class="[
      'flex items-center justify-center transition-colors relative z-50',
      mode === 'horizontal' ? 'w-full h-2 cursor-row-resize hover:bg-blue-200' : 'h-full w-2 cursor-col-resize hover:bg-blue-200',
      { 'bg-blue-200': isDragging }
    ]"
    :style="{ transform: mode === 'horizontal' ? `translateY(${dragOffset}px)` : `translateX(${dragOffset}px)` }"
    @mousedown="startDragging"
  >
    <div 
      :class="[
        'rounded-full transition-colors bg-gray-400',
        mode === 'horizontal' ? 'w-10 h-1' : 'h-10 w-1',
        { 'bg-blue-500': isDragging }
      ]"
    ></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'DraggableDivider',
  props: {
    mode: {
      type: String,
      default: 'horizontal', // 'horizontal' | 'vertical'
      validator: (value) => ['horizontal', 'vertical'].includes(value)
    },
    initialPosition: {
      type: Number,
      default: 50 // 初始位置百分比
    },
    minPosition: {
      type: Number,
      default: 20 // 最小位置百分比
    },
    maxPosition: {
      type: Number,
      default: 80 // 最大位置百分比
    }
  },
  emits: ['position-change'],
  setup(props, { emit }) {
    const isDragging = ref(false)
    const startPosition = ref(0)
    const startPositionPercentage = ref(0)
    const currentPosition = ref(props.initialPosition)
    const dragOffset = ref(0)

    const startDragging = (e) => {
      isDragging.value = true
      startPosition.value = props.mode === 'horizontal' ? e.clientY : e.clientX
      startPositionPercentage.value = props.initialPosition
      dragOffset.value = 0
      document.body.style.userSelect = 'none'
      document.body.style.cursor = props.mode === 'horizontal' ? 'row-resize' : 'col-resize'
      e.preventDefault()
    }

    const handleMouseMove = (e) => {
      if (!isDragging.value) return
      
      const currentMousePosition = props.mode === 'horizontal' ? e.clientY : e.clientX
      const delta = currentMousePosition - startPosition.value
      
      // 计算新的位置（基于鼠标移动距离和屏幕尺寸的比例）
      const screenSize = props.mode === 'horizontal' ? window.innerHeight : window.innerWidth
      const deltaPercentage = (delta / screenSize) * 100
      
      let newPosition = startPositionPercentage.value + deltaPercentage
      newPosition = Math.max(props.minPosition, Math.min(props.maxPosition, newPosition))
      
      // 反向计算受限后的像素偏移量，用于视觉移动
      const clampedDeltaPercentage = newPosition - startPositionPercentage.value
      const clampedDeltaPixels = (clampedDeltaPercentage / 100) * screenSize
      
      dragOffset.value = clampedDeltaPixels
      currentPosition.value = newPosition
    }

    const handleMouseUp = () => {
      if (isDragging.value) {
        emit('position-change', currentPosition.value)
      }
      isDragging.value = false
      dragOffset.value = 0
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    onMounted(() => {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    })

    onUnmounted(() => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      // 清理样式
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    })

    return {
      isDragging,
      startDragging,
      dragOffset
    }
  }
}
</script>

<style scoped>
/* Styles moved to template classes */
</style>