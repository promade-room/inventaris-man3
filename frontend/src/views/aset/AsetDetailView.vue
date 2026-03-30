<template>
  <div>
    <router-link to="/aset" class="text-horizon-muted hover:text-horizon-text text-sm mb-4 inline-block">← Kembali ke Daftar Aset</router-link>

    <div v-if="loading" class="text-horizon-muted">Memuat...</div>
    <div v-else-if="aset">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-horizon-text">{{ aset.nama_aset }}</h2>
          <p class="text-horizon-muted text-sm">{{ aset.kode_aset }} — {{ aset.nama_kategori }} / {{ aset.nama_lokasi }}</p>
        </div>
        <span class="mt-2 sm:mt-0 text-xs px-3 py-1 rounded-full" :class="aset.status_aset === 'aktif' ? 'bg-horizon-teal/10 text-horizon-teal' : 'bg-horizon-danger/10 text-horizon-danger'">
          {{ aset.status_aset }}
        </span>
      </div>

      <!-- Info Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-horizon-card border border-horizon-border rounded-xl p-4">
          <p class="text-xs text-horizon-muted">Harga Perolehan</p>
          <p class="text-lg font-bold text-horizon-text">{{ formatCurrency(aset.harga_perolehan) }}</p>
        </div>
        <div class="bg-horizon-card border border-horizon-border rounded-xl p-4">
          <p class="text-xs text-horizon-muted">Nilai Residu</p>
          <p class="text-lg font-bold text-horizon-text">{{ formatCurrency(aset.nilai_residu) }}</p>
        </div>
        <div class="bg-horizon-card border border-horizon-border rounded-xl p-4">
          <p class="text-xs text-horizon-muted">Umur Ekonomis</p>
          <p class="text-lg font-bold text-horizon-text">{{ aset.umur_ekonomis }} tahun</p>
        </div>
      </div>

      <!-- Formula Badge -->
      <div class="bg-horizon-card border border-horizon-border rounded-xl p-4 mb-6">
        <p class="text-sm text-horizon-muted flex items-center gap-2 mb-2">
          <span class="text-lg">📐</span>
          <strong class="text-horizon-teal">Metode Garis Lurus (Straight-Line Method)</strong>
        </p>
        <p class="text-sm text-horizon-text">
          ({{ formatCurrency(aset.harga_perolehan) }} − {{ formatCurrency(aset.nilai_residu) }}) ÷ {{ aset.umur_ekonomis }} = <strong>{{ formatCurrency(penyusutanPerTahun) }}/tahun</strong>
        </p>
      </div>

      <!-- Book Value Progress -->
      <div class="bg-horizon-card border border-horizon-border rounded-xl p-5 mb-6">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-horizon-muted">Nilai Buku Saat Ini</span>
          <span class="text-horizon-teal font-bold">{{ formatCurrency(currentBookValue) }}</span>
        </div>
        <div class="w-full bg-horizon-bg rounded-full h-3 mb-2">
          <div class="h-3 rounded-full transition-all" :class="bookValuePercent > 50 ? 'bg-horizon-teal' : bookValuePercent > 25 ? 'bg-horizon-amber' : 'bg-horizon-coral'" :style="{ width: bookValuePercent + '%' }" />
        </div>
        <p class="text-xs text-horizon-muted">{{ bookValuePercent.toFixed(1) }}% dari nilai perolehan</p>
      </div>

      <!-- Chart -->
      <div class="bg-horizon-card border border-horizon-border rounded-xl p-5 mb-6">
        <h3 class="text-sm font-medium text-horizon-muted mb-4">Grafik Penurunan Nilai Buku</h3>
        <div class="h-64">
          <Line v-if="chartData" :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Table Penyusutan -->
      <div class="bg-horizon-card border border-horizon-border rounded-xl p-5">
        <h3 class="text-sm font-medium text-horizon-muted mb-4">Tabel Penyusutan per Tahun</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-horizon-muted border-b border-horizon-border">
                <th class="py-2 text-left">Tahun ke-</th>
                <th class="py-2 text-right">Beban Penyusutan</th>
                <th class="py-2 text-right">Akumulasi</th>
                <th class="py-2 text-right">Nilai Buku</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in penyusutan" :key="p.tahun_ke" class="border-b border-horizon-border hover:bg-horizon-bg/50">
                <td class="py-2">{{ p.tahun_ke }}</td>
                <td class="py-2 text-right">{{ formatCurrency(p.beban_penyusutan) }}</td>
                <td class="py-2 text-right">{{ formatCurrency(p.akumulasi_penyusutan) }}</td>
                <td class="py-2 text-right font-medium text-horizon-teal">{{ formatCurrency(p.nilai_buku) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js'
import api from '../../services/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const route = useRoute()
const loading = ref(true)
const aset = ref(null)
const penyusutan = ref([])

const penyusutanPerTahun = computed(() => {
  if (!aset.value) return 0
  return Math.max(0, (Number(aset.value.harga_perolehan) - Number(aset.value.nilai_residu)) / Number(aset.value.umur_ekonomis))
})

const currentBookValue = computed(() => {
  if (!penyusutan.value.length) return aset.value?.harga_perolehan || 0
  return penyusutan.value[penyusutan.value.length - 1]?.nilai_buku || aset.value?.harga_perolehan
})

const bookValuePercent = computed(() => {
  if (!aset.value) return 0
  return (currentBookValue.value / aset.value.harga_perolehan) * 100
})

const chartData = computed(() => {
  if (!penyusutan.value.length) return null
  return {
    labels: penyusutan.value.map(p => `Tahun ${p.tahun_ke}`),
    datasets: [
      {
        label: 'Nilai Buku',
        data: penyusutan.value.map(p => Number(p.nilai_buku)),
        borderColor: '#59e1c5',
        backgroundColor: 'rgba(89, 225, 197, 0.1)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Akumulasi Penyusutan',
        data: penyusutan.value.map(p => Number(p.akumulasi_penyusutan)),
        borderColor: '#e95678',
        backgroundColor: 'rgba(233, 86, 120, 0.1)',
        fill: true,
        tension: 0.3
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#e0e0f0' } } },
  scales: {
    x: { ticks: { color: '#8b8fa3' }, grid: { color: '#363960' } },
    y: { ticks: { color: '#8b8fa3', callback: v => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(v) }, grid: { color: '#363960' } }
  }
}

function formatCurrency(v) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0)
}

onMounted(async () => {
  try {
    const { data } = await api.get(`/aset/${route.params.id}`)
    aset.value = data.data.aset
    penyusutan.value = data.data.penyusutan || []
  } catch { }
  finally { loading.value = false }
})
</script>
