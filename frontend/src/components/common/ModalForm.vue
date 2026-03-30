<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60" @click="$emit('close')" />

      <!-- Modal -->
      <div class="relative bg-horizon-surface border border-horizon-border rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-5 border-b border-horizon-border">
          <h3 class="text-lg font-semibold text-horizon-text">{{ title }}</h3>
          <button @click="$emit('close')" class="text-horizon-muted hover:text-horizon-text">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="$emit('submit')">
          <div class="p-5 space-y-4">
            <slot />
          </div>
          <div class="flex justify-end gap-3 p-5 border-t border-horizon-border">
            <button type="button" @click="$emit('close')"
              class="px-4 py-2 rounded-lg bg-horizon-border text-horizon-text text-sm hover:bg-horizon-card transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="loading"
              class="px-4 py-2 rounded-lg bg-horizon-coral text-white text-sm hover:bg-horizon-coral/80 transition-colors disabled:opacity-50">
              {{ loading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  loading: { type: Boolean, default: false }
})
defineEmits(['close', 'submit'])
</script>
