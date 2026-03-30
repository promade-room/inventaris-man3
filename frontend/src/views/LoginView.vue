<template>
  <div class="min-h-screen flex items-center justify-center bg-horizon-bg px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-horizon-coral flex items-center justify-center text-3xl mx-auto mb-4">📦</div>
        <h1 class="text-2xl font-bold text-horizon-text">Inventaris MAN 3</h1>
        <p class="text-horizon-muted mt-1">Sistem Informasi Inventaris Sarana & Prasarana</p>
      </div>

      <div class="bg-horizon-surface border border-horizon-border rounded-xl p-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm text-horizon-muted mb-1">Username</label>
            <input v-model="username" type="text" required
              class="w-full px-4 py-2.5 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text placeholder-horizon-muted focus:outline-none focus:border-horizon-coral"
              placeholder="Masukkan username" />
          </div>
          <div>
            <label class="block text-sm text-horizon-muted mb-1">Password</label>
            <input v-model="password" type="password" required
              class="w-full px-4 py-2.5 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text placeholder-horizon-muted focus:outline-none focus:border-horizon-coral"
              placeholder="Masukkan password" />
          </div>
          <p v-if="error" class="text-horizon-danger text-sm">{{ error }}</p>
          <button type="submit" :disabled="loading"
            class="w-full py-2.5 rounded-lg bg-horizon-coral text-white font-medium hover:bg-horizon-coral/80 transition-colors disabled:opacity-50">
            {{ loading ? 'Masuk...' : 'Masuk' }}
          </button>
        </form>
      </div>

      <p class="text-center text-xs text-horizon-muted mt-6">Metode Garis Lurus — MAN 3 Palembang</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>
