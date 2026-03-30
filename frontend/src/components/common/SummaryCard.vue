<template>
  <div class="bg-horizon-card border border-horizon-border rounded-xl p-5">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-horizon-muted">{{ label }}</p>
        <p class="text-2xl font-bold text-horizon-text mt-1">{{ formattedValue }}</p>
        <p v-if="subtitle" class="text-xs text-horizon-muted mt-1">{{ subtitle }}</p>
      </div>
      <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-2xl', colorClass]">
        {{ icon }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: [Number, String],
  icon: String,
  color: { type: String, default: 'coral' },
  subtitle: String,
  format: { type: String, default: 'number' } // number | currency
})

const formattedValue = computed(() => {
  if (props.format === 'currency') {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(props.value || 0)
  }
  return new Intl.NumberFormat('id-ID').format(props.value || 0)
})

const colorClass = computed(() => {
  const map = {
    coral: 'bg-horizon-coral/10',
    teal: 'bg-horizon-teal/10',
    amber: 'bg-horizon-amber/10',
    purple: 'bg-horizon-purple/10',
    blue: 'bg-horizon-blue/10',
  }
  return map[props.color] || map.coral
})
</script>
