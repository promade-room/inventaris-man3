<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-horizon-text">Data Aset</h2>
      <button v-if="auth.canWrite" @click="openModal()" class="px-4 py-2 rounded-lg bg-horizon-coral text-white text-sm hover:bg-horizon-coral/80">
        + Tambah Aset
      </button>
    </div>

    <DataTable :columns="columns" :data="items" :loading="loading" search-placeholder="Cari aset...">
      <template #filters>
        <select v-model="filterKategori" @change="fetchItems" class="px-3 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text text-sm">
          <option value="">Semua Kategori</option>
          <option v-for="k in kategoriList" :key="k.id" :value="k.id">{{ k.nama_kategori }}</option>
        </select>
        <select v-model="filterStatus" @change="fetchItems" class="px-3 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text text-sm">
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="dihapus">Dihapus</option>
        </select>
      </template>
      <template #cell-harga_perolehan="{ value }">
        {{ formatCurrency(value) }}
      </template>
      <template #cell-status_aset="{ value }">
        <span class="text-xs px-2 py-1 rounded-full" :class="value === 'aktif' ? 'bg-horizon-teal/10 text-horizon-teal' : 'bg-horizon-danger/10 text-horizon-danger'">
          {{ value }}
        </span>
      </template>
      <template #actions="{ row }">
        <router-link :to="`/aset/${row.id}`" class="text-horizon-blue hover:underline text-sm mr-3">Detail</router-link>
        <button v-if="auth.canWrite" @click="openModal(row)" class="text-horizon-blue hover:underline text-sm mr-3">Edit</button>
        <button v-if="auth.canWrite" @click="handleDelete(row)" class="text-horizon-danger hover:underline text-sm">Hapus</button>
      </template>
    </DataTable>

    <!-- Modal Form Aset -->
    <ModalForm :show="modalShow" :title="editId ? 'Edit Aset' : 'Tambah Aset Baru'" :loading="saving" @close="modalShow = false" @submit="handleSave">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-horizon-muted mb-1">Kode Aset *</label>
          <input v-model="form.kode_aset" type="text" required class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral" />
        </div>
        <div>
          <label class="block text-sm text-horizon-muted mb-1">Nama Aset *</label>
          <input v-model="form.nama_aset" type="text" required class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral" />
        </div>
        <div>
          <label class="block text-sm text-horizon-muted mb-1">Kategori *</label>
          <select v-model="form.id_kategori" required class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral">
            <option value="">Pilih Kategori</option>
            <option v-for="k in kategoriList" :key="k.id" :value="k.id">{{ k.nama_kategori }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-horizon-muted mb-1">Lokasi *</label>
          <select v-model="form.id_lokasi" required class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral">
            <option value="">Pilih Lokasi</option>
            <option v-for="l in lokasiList" :key="l.id" :value="l.id">{{ l.nama_lokasi }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-horizon-muted mb-1">Tanggal Perolehan *</label>
          <input v-model="form.tgl_perolehan" type="date" required class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral" />
        </div>
        <div>
          <label class="block text-sm text-horizon-muted mb-1">Harga Perolehan (Rp) *</label>
          <input v-model.number="form.harga_perolehan" type="number" required min="0" class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral" />
        </div>
        <div>
          <label class="block text-sm text-horizon-muted mb-1">Nilai Residu (Rp) *</label>
          <input v-model.number="form.nilai_residu" type="number" required min="0" class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral" />
        </div>
        <div>
          <label class="block text-sm text-horizon-muted mb-1">Umur Ekonomis (Tahun) *</label>
          <input v-model.number="form.umur_ekonomis" type="number" required min="1" class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral" />
        </div>
      </div>

      <!-- Live Preview Depreciation -->
      <div v-if="previewShow" class="mt-4 p-4 bg-horizon-bg rounded-lg border border-horizon-border">
        <p class="text-sm text-horizon-teal font-medium mb-2">📐 Preview Penyusutan — Metode Garis Lurus</p>
        <p class="text-xs text-horizon-muted mb-3">
          ({{ formatCurrency(form.harga_perolehan) }} − {{ formatCurrency(form.nilai_residu) }}) ÷ {{ form.umur_ekonomis }} tahun = <strong class="text-horizon-text">{{ formatCurrency(previewPenyusutan) }}/tahun</strong>
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead><tr class="text-horizon-muted">
              <th class="py-1 text-left">Tahun ke-</th>
              <th class="py-1 text-right">Beban</th>
              <th class="py-1 text-right">Akumulasi</th>
              <th class="py-1 text-right">Nilai Buku</th>
            </tr></thead>
            <tbody>
              <tr v-for="row in previewTable" :key="row.tahun" class="border-t border-horizon-border">
                <td class="py-1">{{ row.tahun }}</td>
                <td class="py-1 text-right">{{ formatCurrency(row.beban) }}</td>
                <td class="py-1 text-right">{{ formatCurrency(row.akumulasi) }}</td>
                <td class="py-1 text-right text-horizon-teal">{{ formatCurrency(row.nilaiBuku) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ModalForm>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DataTable from '../../components/common/DataTable.vue'
import ModalForm from '../../components/common/ModalForm.vue'
import { useAlert } from '../../composables/useAlert'
import { useAuthStore } from '../../stores/auth'
import api from '../../services/api'

const alert = useAlert()
const auth = useAuthStore()

const columns = [
  { key: 'kode_aset', label: 'Kode' },
  { key: 'nama_aset', label: 'Nama Aset' },
  { key: 'nama_kategori', label: 'Kategori' },
  { key: 'nama_lokasi', label: 'Lokasi' },
  { key: 'harga_perolehan', label: 'Harga' },
  { key: 'status_aset', label: 'Status' },
]

const items = ref([])
const loading = ref(false)
const saving = ref(false)
const modalShow = ref(false)
const editId = ref(null)
const kategoriList = ref([])
const lokasiList = ref([])
const filterKategori = ref('')
const filterStatus = ref('')

const form = ref({
  kode_aset: '', nama_aset: '', id_kategori: '', id_lokasi: '',
  tgl_perolehan: '', harga_perolehan: 0, nilai_residu: 0, umur_ekonomis: 1
})

// Live preview
const previewShow = computed(() => form.value.harga_perolehan > 0 && form.value.umur_ekonomis > 0)
const previewPenyusutan = computed(() =>
  Math.max(0, (Number(form.value.harga_perolehan) - Number(form.value.nilai_residu)) / Number(form.value.umur_ekonomis))
)
const previewTable = computed(() => {
  const rows = []
  const beban = previewPenyusutan.value
  for (let i = 1; i <= Math.min(Number(form.value.umur_ekonomis), 10); i++) {
    rows.push({
      tahun: i,
      beban,
      akumulasi: beban * i,
      nilaiBuku: Number(form.value.harga_perolehan) - (beban * i)
    })
  }
  return rows
})

function formatCurrency(v) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0)
}

async function fetchItems() {
  loading.value = true
  try {
    const params = {}
    if (filterKategori.value) params.kategori = filterKategori.value
    if (filterStatus.value) params.status = filterStatus.value
    const { data } = await api.get('/aset', { params })
    items.value = data.data
  } catch { alert.error('Gagal', 'Tidak dapat memuat data aset') }
  finally { loading.value = false }
}

async function fetchRefs() {
  try {
    const [k, l] = await Promise.all([api.get('/kategori'), api.get('/lokasi')])
    kategoriList.value = k.data.data
    lokasiList.value = l.data.data
  } catch {}
}

function openModal(item = null) {
  editId.value = item?.id || null
  form.value = item ? {
    kode_aset: item.kode_aset, nama_aset: item.nama_aset,
    id_kategori: item.id_kategori, id_lokasi: item.id_lokasi,
    tgl_perolehan: item.tgl_perolehan?.split('T')[0] || '',
    harga_perolehan: item.harga_perolehan, nilai_residu: item.nilai_residu || 0,
    umur_ekonomis: item.umur_ekonomis
  } : {
    kode_aset: '', nama_aset: '', id_kategori: '', id_lokasi: '',
    tgl_perolehan: new Date().toISOString().split('T')[0],
    harga_perolehan: 0, nilai_residu: 0, umur_ekonomis: 5
  }
  modalShow.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editId.value) {
      await api.put(`/aset/${editId.value}`, form.value)
      alert.success('Berhasil', 'Aset diperbarui')
    } else {
      await api.post('/aset', form.value)
      alert.success('Berhasil', 'Aset ditambahkan — penyusutan otomatis dihitung')
    }
    modalShow.value = false
    fetchItems()
  } catch (e) {
    alert.error('Gagal', e.response?.data?.message || 'Terjadi kesalahan')
  } finally { saving.value = false }
}

async function handleDelete(item) {
  const result = await alert.confirm('Hapus Aset?', `Aset "${item.nama_aset}" akan dinonaktifkan.`)
  if (result.isConfirmed) {
    try {
      await api.delete(`/aset/${item.id}`)
      alert.success('Berhasil', 'Aset dihapus')
      fetchItems()
    } catch { alert.error('Gagal', 'Tidak dapat menghapus aset') }
  }
}

onMounted(() => { fetchItems(); fetchRefs() })
</script>
