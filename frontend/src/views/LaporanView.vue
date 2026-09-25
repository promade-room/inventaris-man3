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
        <div v-if="jenis === 'aset'">
          <label class="block text-xs text-horizon-muted mb-1">Kategori</label>
          <select v-model="filterKategori" class="w-full px-3 py-2 rounded-lg bg-horizon-bg border border-horizon-border text-horizon-text text-sm">
            <option value="">Semua</option>
            <option v-for="k in kategoriList" :key="k.id" :value="k.id">{{ k.nama_kategori }}</option>
          </select>
        </div>
        <div v-else-if="jenis === 'monitoring'">
          <label class="block text-xs text-horizon-muted mb-1">Kondisi</label>
          <select v-model="filterKondisi" class="w-full px-3 py-2 rounded-lg bg-horizon-bg border border-horizon-border text-horizon-text text-sm">
            <option value="">Semua Kondisi</option>
            <option value="baik">Baik</option>
            <option value="rusak_ringan">Rusak Ringan</option>
            <option value="rusak_berat">Rusak Berat</option>
          </select>
        </div>
        <div v-else>
          <label class="block text-xs text-horizon-muted mb-1">Keterangan Filter</label>
          <div class="px-3 py-2 rounded-lg bg-horizon-bg/50 border border-horizon-border text-horizon-muted text-sm">
            Semua Aset Aktif
          </div>
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
        <button @click="exportFile('xlsx')" class="px-4 py-2 rounded-lg bg-horizon-teal/10 text-horizon-teal text-sm hover:bg-horizon-teal/20">📊 Export Excel</button>
        <button @click="exportFile('pdf')" class="px-4 py-2 rounded-lg bg-horizon-amber/10 text-horizon-amber text-sm hover:bg-horizon-amber/20">📄 Export PDF</button>
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
              <th v-for="col in columns" :key="col.key" class="py-2 text-left px-2">{{ col.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in reportData" :key="i" class="border-b border-horizon-border hover:bg-horizon-bg/50">
              <td v-for="col in columns" :key="col.key" class="py-2 px-2">
                <template v-if="col.format === 'currency'">{{ formatCurrency(row[col.key]) }}</template>
                <template v-else-if="col.format === 'date'">{{ formatDate(row[col.key]) }}</template>
                <template v-else>{{ row[col.key] }}</template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAlert } from '../composables/useAlert'
import api from '../services/api'

const alert = useAlert()
const jenis = ref('aset')
const filterKategori = ref('')
const filterKondisi = ref('')
const periodeAwal = ref('')
const periodeAkhir = ref('')
const loading = ref(false)
const reportData = ref([])
const kategoriList = ref([])

// Otomatis kosongkan data lama dan muat data baru saat jenis laporan diubah
watch(jenis, () => {
  reportData.value = []
  filterKategori.value = ''
  filterKondisi.value = ''
  loadReport()
})

const jenisLabel = computed(() => ({ aset: 'Data Aset', penyusutan: 'Penyusutan', monitoring: 'Monitoring' }[jenis.value]))

const columnMap = {
  aset: [
    { key: 'kode_aset', label: 'Kode' },
    { key: 'nama_aset', label: 'Nama Aset' },
    { key: 'nama_kategori', label: 'Kategori' },
    { key: 'nama_lokasi', label: 'Lokasi' },
    { key: 'harga_perolehan', label: 'Harga Perolehan', format: 'currency' },
    { key: 'status_aset', label: 'Status' },
  ],
  penyusutan: [
    { key: 'kode_aset', label: 'Kode' },
    { key: 'nama_aset', label: 'Nama Aset' },
    { key: 'harga_perolehan', label: 'Harga Perolehan', format: 'currency' },
    { key: 'penyusutan_tahunan', label: 'Penyusutan/Tahun', format: 'currency' },
    { key: 'nilai_buku', label: 'Nilai Buku', format: 'currency' },
  ],
  monitoring: [
    { key: 'nama_aset', label: 'Nama Aset' },
    { key: 'kode_aset', label: 'Kode' },
    { key: 'tgl_cek', label: 'Tanggal Cek', format: 'date' },
    { key: 'kondisi', label: 'Kondisi' },
    { key: 'keterangan', label: 'Keterangan' },
  ]
}

const columns = computed(() => columnMap[jenis.value] || [])

function formatCurrency(v) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0)
}

function formatDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function loadReport() {
  loading.value = true
  reportData.value = []
  try {
    const params = {}
    if (jenis.value === 'aset' && filterKategori.value) params.kategori = filterKategori.value
    if (jenis.value === 'monitoring' && filterKondisi.value) params.kondisi = filterKondisi.value
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
    if (jenis.value === 'aset' && filterKategori.value) params.kategori = filterKategori.value
    if (jenis.value === 'monitoring' && filterKondisi.value) params.kondisi = filterKondisi.value
    if (periodeAwal.value) params.periode_awal = periodeAwal.value
    if (periodeAkhir.value) params.periode_akhir = periodeAkhir.value
    const res = await api.get(`/laporan/export/${jenis.value}`, { params, responseType: 'blob' })
    const mimeType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const url = window.URL.createObjectURL(new Blob([res.data], { type: mimeType }))
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
  loadReport()
})
</script>
