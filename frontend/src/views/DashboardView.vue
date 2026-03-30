<template>
  <div>
    <h2 class="text-xl font-bold text-horizon-text mb-6">Dashboard</h2>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SummaryCard label="Total Aset" :value="stats.totalAset" icon="🏢" color="coral" />
      <SummaryCard label="Total Nilai Buku" :value="stats.totalNilaiBuku" icon="💰" color="teal" format="currency" />
      <SummaryCard label="Penyusutan Tahun Ini" :value="stats.totalPenyusutan" icon="📉" color="amber" format="currency" />
      <SummaryCard label="Aset Rusak" :value="stats.asetRusak" icon="🔧" color="purple" />
    </div>

    <!-- Formula Badge -->
    <div class="bg-horizon-card border border-horizon-border rounded-xl p-4 mb-6">
      <p class="text-sm text-horizon-muted flex items-center gap-2">
        <span class="text-lg">📐</span>
        <span><strong class="text-horizon-teal">Metode Garis Lurus:</strong> Penyusutan Tahunan = (Harga Perolehan − Nilai Residu) ÷ Umur Manfaat</span>
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Chart: Aset per Kategori -->
      <div class="bg-horizon-card border border-horizon-border rounded-xl p-5">
        <h3 class="text-sm font-medium text-horizon-muted mb-4">Aset per Kategori</h3>
        <div class="h-64 flex items-center justify-center">
          <Pie v-if="kategoriChartData" :data="kategoriChartData" :options="pieOptions" />
          <p v-else class="text-horizon-muted text-sm">Belum ada data</p>
        </div>
      </div>

      <!-- Chart: Penyusutan per Tahun -->
      <div class="bg-horizon-card border border-horizon-border rounded-xl p-5">
        <h3 class="text-sm font-medium text-horizon-muted mb-4">Tren Penyusutan per Tahun</h3>
        <div class="h-64 flex items-center justify-center">
          <Bar v-if="penyusutanChartData" :data="penyusutanChartData" :options="barOptions" />
          <p v-else class="text-horizon-muted text-sm">Belum ada data</p>
        </div>
      </div>
    </div>

    <!-- Recent -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-horizon-card border border-horizon-border rounded-xl p-5">
        <h3 class="text-sm font-medium text-horizon-muted mb-4">Aset Terbaru</h3>
        <div v-if="recentAset.length === 0" class="text-horizon-muted text-sm">Belum ada data</div>
        <ul v-else class="space-y-3">
          <li v-for="a in recentAset" :key="a.id" class="flex items-center justify-between py-2 border-b border-horizon-border last:border-0">
            <div>
              <p class="text-sm text-horizon-text">{{ a.nama_aset }}</p>
              <p class="text-xs text-horizon-muted">{{ a.kode_aset }}</p>
            </div>
            <span class="text-xs px-2 py-1 rounded-full" :class="a.status_aset === 'aktif' ? 'bg-horizon-teal/10 text-horizon-teal' : 'bg-horizon-danger/10 text-horizon-danger'">
              {{ a.status_aset }}
            </span>
          </li>
        </ul>
      </div>
      <div class="bg-horizon-card border border-horizon-border rounded-xl p-5">
        <h3 class="text-sm font-medium text-horizon-muted mb-4">Monitoring Terbaru</h3>
        <div v-if="recentMonitoring.length === 0" class="text-horizon-muted text-sm">Belum ada data</div>
        <ul v-else class="space-y-3">
          <li v-for="m in recentMonitoring" :key="m.id" class="flex items-center justify-between py-2 border-b border-horizon-border last:border-0">
            <div>
              <p class="text-sm text-horizon-text">{{ m.nama_aset }}</p>
              <p class="text-xs text-horizon-muted">{{ formatDate(m.tgl_cek) }}</p>
            </div>
            <span class="text-xs px-2 py-1 rounded-full" :class="kondisiClass(m.kondisi)">
              {{ m.kondisi }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Pie, Bar } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import SummaryCard from '../components/common/SummaryCard.vue'
import api from '../services/api'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const stats = ref({ totalAset: 0, totalNilaiBuku: 0, totalPenyusutan: 0, asetRusak: 0 })
const recentAset = ref([])
const recentMonitoring = ref([])
const kategoriChartData = ref(null)
const penyusutanChartData = ref(null)

const pieOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#e0e0f0' } } } }
const barOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#e0e0f0' } } }, scales: { x: { ticks: { color: '#8b8fa3' } }, y: { ticks: { color: '#8b8fa3' } } } }

function kondisiClass(k) {
  if (k === 'baik') return 'bg-horizon-teal/10 text-horizon-teal'
  if (k === 'rusak_ringan') return 'bg-horizon-amber/10 text-horizon-amber'
  return 'bg-horizon-danger/10 text-horizon-danger'
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  try {
    const { data } = await api.get('/dashboard/stats')
    const d = data.data
    stats.value = {
      totalAset: d.totalAset || 0,
      totalNilaiBuku: d.totalNilaiBuku || 0,
      totalPenyusutan: d.totalPenyusutan || 0,
      asetRusak: d.asetRusak || 0
    }
    recentAset.value = d.recentAset || []
    recentMonitoring.value = d.recentMonitoring || []

    if (d.kategoriChart?.length) {
      kategoriChartData.value = {
        labels: d.kategoriChart.map(k => k.nama_kategori),
        datasets: [{ data: d.kategoriChart.map(k => k.jumlah), backgroundColor: ['#e95678', '#59e1c5', '#f09f4a', '#b8a5f7', '#6cb6ff', '#e0e0f0'] }]
      }
    }
    if (d.penyusutanChart?.length) {
      penyusutanChartData.value = {
        labels: d.penyusutanChart.map(p => `Tahun ${p.tahun}`),
        datasets: [{ label: 'Total Penyusutan', data: d.penyusutanChart.map(p => p.total), backgroundColor: '#e95678' }]
      }
    }
  } catch (e) {
    console.error('Dashboard load error:', e)
  }
})
</script>
