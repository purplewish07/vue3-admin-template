<template>
  <component :is="type" v-bind="linkProps()">
    <slot />
  </component>
</template>

<script setup>
import { isExternal as utilsIsExternal } from '@/utils/validate'
import { computed } from 'vue'

const props = defineProps({
  to: {
    type: String,
    required: true
  }
})

// 是否外部鏈接
const isExternal = computed(() => utilsIsExternal(props.to))

// 標籤類型
const type = computed(() => (isExternal.value ? 'a' : 'router-link'))

// 標籤屬性
const linkProps = () => {
  if (isExternal.value) {
    return {
      href: props.to,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return {
    to: props.to
  }
}
</script>
