<template>
  <header class="h-16 bg-horizon-surface border-b border-horizon-border flex items-center justify-between px-6">
    <button @click="$emit('toggle-sidebar')" class="lg:hidden text-horizon-muted hover:text-horizon-text">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div class="flex-1" />

    <div class="flex items-center gap-4">
      <div class="text-right">
        <p class="text-sm font-medium text-horizon-text">{{ auth.user?.nama_lengkap }}</p>
        <p class="text-xs text-horizon-muted capitalize">{{ auth.user?.role }}</p>
      </div>
      <button @click="handleLogout" class="px-3 py-1.5 rounded-lg bg-horizon-danger/10 text-horizon-danger text-sm hover:bg-horizon-danger/20 transition-colors">
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

defineEmits(['toggle-sidebar'])
const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
