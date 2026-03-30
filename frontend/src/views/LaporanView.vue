<template>
  <div>
    <h2 class="text-xl font-bold text-horizon-text mb-2">Pusat Laporan</h2>
    <p class="text-sm text-horizon-muted mb-6">Generate dan export laporan inventaris</p>

    <!-- Filter -->
    <div class="bg-horizon-card border border-horizon-border rounded-xl p-5 mb-6">
      <h3 class="text-sm font-medium text-horizon-muted mb-4">Filter Laporan</h3>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs text-horizon-muted mb-1">Jenis Laporan</label>
          <select v-model="jenis" class="w-full px-3 py-2 rounded-lg bg-horizon-bg border border-horizon-border text-horizon-text text-sm">
            <option value="aset">Data Aset</option>
            <option value="penyusutan">Penyusutan</option>
            <option value="monitoring">Monitoring</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-horizon-muted mb-1">Kategori</label>
          <select v-model="filterKategori" class="w-full px-3 py-2 rounded-lg bg-horizon-bg border border-horizon-border text-horizon-text text-sm">
            <option value="">Semua</option>
            <option v-for="k in kategoriList" :key="k.id" :value="k.id">{{ k.nama_kategori }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-horizon-muted mb-1">Periode Awal</label>
          <input v-model="periodeAwal" type="date" class="w-full px-3 py-2 rounded-lg bg-horizon-bg border border-horizon-border text-horizon-text text-sm" />
        </div>
        <div>
          <label class="block text-xs text-horizon-muted mb-1">Periode Akhir</label>
          <input v-model="periodeAkhir" type="date" class="w-full px-3 py-2 rounded-lg bg-horizon-bg border border-horizon-border text-horizon-text text-sm" />
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button @click="loadReport" class="px-4 py-2 rounded-lg bg-horizon-coral text-white text-sm hover:bg-horizon-coral/80">Tampilkan</button>
        <button @click="exportFile('xlsx')" :disabled="!reportData.length" class="px-4 py-2 rounded-lg bg-horizon-teal/10 text-horizon-teal text-sm hover:bg-horizon-teal/20 disabled:opacity-50">📊 Export Excel</button>
        <button @click="exportFile('pdf')" :disabled="!reportData.length" class="px-4 py-2 rounded-lg bg-horizon-amber/10 text-horizon-amber text-sm hover:bg-horizon-amber/20 disabled:opacity-50">📄 Export PDF</button>
      </div>
    </div>

    <!-- Report Preview -->
    <div class="bg-horizon-card border border-horizon-border rounded-xl p-5">
      <h3 class="text-sm font-medium text-horizon-muted mb-4">Preview Laporan {{ jenisLabel }}</h3>
      <div v-if="loading" class="text-horizon-muted text-sm py-4">Memuat...</div>
      <div v-else-if="!reportData.length" class="text-horizon-muted text-sm py-4">Pilih filter dan klik "Tampilkan" untuk melihat laporan</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-horizon-muted border-b border-horizon-border">
              <th v-for="col in reportColumns" :key="col" class="py-2 text-left px-2">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in reportData" :key="i" class="border-b border-horizon-border hover:bg-horizon-bg/50">
              <td v-for="col in reportColumns" :key="col" class="py-2 px-2">{{ row[col] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAlert } from '../../composables/useAlert'
import api from '../../services/api'

const alert = useAlert()
const jenis = ref('aset')
const filterKategori = ref('')
const periodeAwal = ref('')
const periodeAkhir = ref('')
const loading = ref(false)
const reportData = ref([])
const kategoriList = ref([])

const jenisLabel = computed(() => ({ aset: 'Data Aset', penyusutan: 'Penyusutan', monitoring: 'Monitoring' }[jenis.value]))

const reportColumns = computed(() => {
  if (jenis.value === 'aset') return ['Kode', 'Nama Aset', 'Kategori', 'Lokasi', 'Harga', 'Status']
  if (jenis.value === 'penyusutan') return ['Kode', 'Nama Aset', 'Harga Perolehan', 'Penyusutan/Tahun', 'Nilai Buku']
  return ['Nama Aset', 'Kode', 'Tanggal Cek', 'Kondisi', 'Keterangan']
})

async function loadReport() {
  loading.value = true
  try {
    const params = {}
    if (filterKategori.value) params.kategori = filterKategori.value
    if (periodeAwal.value) params.periode_awal = periodeAwal.value
    if (periodeAkhir.value) params.periode_akhir = periodeAkhir.value
    const { data } = await api.get(`/laporan/${jenis.value}`, { params })
    reportData.value = data.data || []
  } catch { alert.error('Gagal', 'Tidak dapat memuat laporan') }
  finally { loading.value = false }
}

async function exportFile(format) {
  try {
    const params = { format }
    if (filterKategori.value) params.kategori = filterKategori.value
    if (periodeAwal.value) params.periode_awal = periodeAwal.value
    if (periodeAkhir.value) params.periode_akhir = periodeAkhir.value
    const res = await api.get(`/export/${jenis.value}`, { params, responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = `laporan-${jenis.value}.${format}`
    link.click()
    window.URL.revokeObjectURL(url)
    alert.success('Berhasil', `Laporan berhasil diexport ke ${format.toUpperCase()}`)
  } catch { alert.error('Gagal', 'Export gagal') }
}

onMounted(async () => {
  try {
    const { data } = await api.get('/kategori')
    kategoriList.value = data.data
  } catch {}
})
</script>
