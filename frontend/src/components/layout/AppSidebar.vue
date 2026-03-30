<template>
  <aside :class="[collapsed ? 'w-16' : 'w-64', 'bg-horizon-surface border-r border-horizon-border flex flex-col transition-all duration-300']">
    <!-- Logo -->
    <div class="h-16 flex items-center px-4 border-b border-horizon-border">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-horizon-coral flex items-center justify-center text-white font-bold text-sm">📦</div>
        <span v-if="!collapsed" class="font-bold text-horizon-text whitespace-nowrap">Inventaris MAN 3</span>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 py-4 overflow-y-auto">
      <ul class="space-y-1 px-2">
        <li v-for="item in navItems" :key="item.path">
          <!-- Group -->
          <div v-if="item.children">
            <button
              v-if="!collapsed"
              @click="item.open = !item.open"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-horizon-muted hover:bg-horizon-card hover:text-horizon-text transition-colors text-sm"
            >
              <span class="flex items-center gap-3">
                <span class="text-lg">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </span>
              <svg :class="['w-4 h-4 transition-transform', item.open && 'rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul v-if="item.open && !collapsed" class="mt-1 ml-8 space-y-1">
              <li v-for="child in item.children" :key="child.path">
                <router-link
                  :to="child.path"
                  class="block px-3 py-2 rounded-lg text-sm text-horizon-muted hover:bg-horizon-card hover:text-horizon-text transition-colors"
                  active-class="!bg-horizon-coral/10 !text-horizon-coral"
                >
                  {{ child.label }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Single -->
          <router-link
            v-else
            :to="item.path"
            :class="['flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-horizon-muted hover:bg-horizon-card hover:text-horizon-text transition-colors', collapsed && 'justify-center']"
            active-class="!bg-horizon-coral/10 !text-horizon-coral"
          >
            <span class="text-lg">{{ item.icon }}</span>
            <span v-if="!collapsed">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Collapse toggle -->
    <button @click="$emit('toggle')" class="p-3 border-t border-horizon-border text-horizon-muted hover:text-horizon-text transition-colors">
      <svg :class="['w-5 h-5 mx-auto transition-transform', collapsed && 'rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
    </button>
  </aside>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '../../stores/auth'

defineProps({ collapsed: Boolean })
defineEmits(['toggle'])

const auth = useAuthStore()

const navItems = reactive([
  { icon: '📊', label: 'Dashboard', path: '/' },
  ...(auth.isAdmin ? [{
    icon: '📁', label: 'Master Data', open: false,
    children: [
      { label: 'Kategori', path: '/master/kategori' },
      { label: 'Lokasi', path: '/master/lokasi' },
      { label: 'Pengguna', path: '/master/pengguna' },
    ]
  }] : []),
  { icon: '🏢', label: 'Data Aset', path: '/aset' },
  { icon: '📉', label: 'Penyusutan', path: '/penyusutan' },
  { icon: '🔍', label: 'Monitoring', path: '/monitoring' },
  { icon: '📄', label: 'Laporan', path: '/laporan' },
])
</script>
