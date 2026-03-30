<template>
  <div>
    <!-- Search & Filter bar -->
    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <input
        v-model="search"
        type="text"
        :placeholder="searchPlaceholder"
        class="flex-1 px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text placeholder-horizon-muted focus:outline-none focus:border-horizon-coral text-sm"
        @input="$emit('search', search)"
      />
      <slot name="filters" />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-lg border border-horizon-border">
      <table class="w-full text-sm">
        <thead class="bg-horizon-card">
          <tr>
            <th v-for="col in columns" :key="col.key"
                class="px-4 py-3 text-left text-horizon-muted font-medium cursor-pointer hover:text-horizon-text"
                @click="sortBy(col.key)">
              {{ col.label }}
              <span v-if="sortKey === col.key" class="ml-1">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th v-if="$slots.actions" class="px-4 py-3 text-right text-horizon-muted font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length + 1" class="px-4 py-8 text-center text-horizon-muted">
              <div class="animate-pulse">Memuat data...</div>
            </td>
          </tr>
          <tr v-else-if="paginatedData.length === 0">
            <td :colspan="columns.length + 1" class="px-4 py-8 text-center text-horizon-muted">
              Tidak ada data
            </td>
          </tr>
          <tr v-else v-for="(row, i) in paginatedData" :key="row.id || i"
              class="border-t border-horizon-border hover:bg-horizon-card/50 transition-colors">
            <td v-for="col in columns" :key="col.key" class="px-4 py-3 text-horizon-text">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="px-4 py-3 text-right">
              <slot name="actions" :row="row" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-4">
      <p class="text-sm text-horizon-muted">Menampilkan {{ startIdx + 1 }}-{{ Math.min(endIdx, sortedData.length) }} dari {{ sortedData.length }}</p>
      <div class="flex gap-1">
        <button v-for="p in totalPages" :key="p"
                @click="currentPage = p"
                :class="['px-3 py-1 rounded text-sm', currentPage === p ? 'bg-horizon-coral text-white' : 'bg-horizon-card text-horizon-muted hover:bg-horizon-border']">
          {{ p }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  perPage: { type: Number, default: 15 },
  searchPlaceholder: { type: String, default: 'Cari...' }
})

defineEmits(['search'])

const search = ref('')
const sortKey = ref('')
const sortDir = ref('asc')
const currentPage = ref(1)

function sortBy(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

const filteredData = computed(() => {
  if (!search.value) return props.data
  const q = search.value.toLowerCase()
  return props.data.filter(row =>
    Object.values(row).some(v => String(v).toLowerCase().includes(q))
  )
})

const sortedData = computed(() => {
  if (!sortKey.value) return filteredData.value
  return [...filteredData.value].sort((a, b) => {
    const av = a[sortKey.value], bv = b[sortKey.value]
    const cmp = av > bv ? 1 : av < bv ? -1 : 0
    return sortDir.value === 'asc' ? cmp : -cmp
  })
})

const totalPages = computed(() => Math.ceil(sortedData.value.length / props.perPage))
const startIdx = computed(() => (currentPage.value - 1) * props.perPage)
const endIdx = computed(() => startIdx.value + props.perPage)
const paginatedData = computed(() => sortedData.value.slice(startIdx.value, endIdx.value))
</script>
