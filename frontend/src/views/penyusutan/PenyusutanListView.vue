<template>
  <div>
    <h2 class="text-xl font-bold text-horizon-text mb-2">Data Penyusutan Aset</h2>
    <p class="text-sm text-horizon-muted mb-6">Ringkasan nilai buku seluruh aset — Metode Garis Lurus</p>

    <!-- Formula Badge -->
    <div class="bg-horizon-card border border-horizon-border rounded-xl p-4 mb-6">
      <p class="text-sm text-horizon-muted flex items-center gap-2">
        <span class="text-lg">📐</span>
        <span><strong class="text-horizon-teal">Metode Garis Lurus:</strong> Penyusutan = (Harga Perolehan − Nilai Residu) ÷ Umur Manfaat</span>
      </p>
    </div>

    <DataTable :columns="columns" :data="items" :loading="loading" search-placeholder="Cari aset...">
      <template #cell-harga_perolehan="{ value }">{{ formatCurrency(value) }}</template>
      <template #cell-penyusutan_tahunan="{ value }">{{ formatCurrency(value) }}</template>
      <template #cell-nilai_buku="{ value }">
        <span class="text-horizon-teal font-medium">{{ formatCurrency(value) }}</span>
      </template>
      <template #cell-status="{ row }">
        <span class="text-xs px-2 py-1 rounded-full" :class="row.nilai_buku > row.nilai_residu ? 'bg-horizon-teal/10 text-horizon-teal' : 'bg-horizon-amber/10 text-horizon-amber'">
          {{ row.nilai_buku > row.nilai_residu ? 'Aktif' : 'Fully Depreciated' }}
        </span>
      </template>
      <template #actions="{ row }">
        <router-link :to="`/penyusutan/${row.id_aset}`" class="text-horizon-blue hover:underline text-sm">Detail</router-link>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '../../components/common/DataTable.vue'
import api from '../../services/api'

const columns = [
  { key: 'kode_aset', label: 'Kode' },
  { key: 'nama_aset', label: 'Nama Aset' },
  { key: 'harga_perolehan', label: 'Harga Perolehan' },
  { key: 'penyusutan_tahunan', label: 'Penyusutan/Tahun' },
  { key: 'nilai_buku', label: 'Nilai Buku' },
  { key: 'status', label: 'Status' },
]

const items = ref([])
const loading = ref(false)

function formatCurrency(v) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0)
}

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await api.get('/penyusutan')
    items.value = data.data
  } catch {}
  finally { loading.value = false }
})
</script>
