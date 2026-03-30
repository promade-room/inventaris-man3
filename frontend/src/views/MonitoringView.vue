<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-horizon-text">Monitoring Aset</h2>
      <button v-if="auth.canWrite" @click="openModal()" class="px-4 py-2 rounded-lg bg-horizon-coral text-white text-sm hover:bg-horizon-coral/80">
        + Tambah Monitoring
      </button>
    </div>

    <DataTable :columns="columns" :data="items" :loading="loading" search-placeholder="Cari monitoring...">
      <template #cell-tgl_cek="{ value }">{{ formatDate(value) }}</template>
      <template #cell-kondisi="{ value }">
        <span class="text-xs px-2 py-1 rounded-full" :class="kondisiClass(value)">{{ kondisiLabel(value) }}</span>
      </template>
      <template #cell-keterangan="{ value }">
        <span class="text-horizon-muted">{{ value || '-' }}</span>
      </template>
      <template #actions="{ row }">
        <button v-if="auth.canWrite" @click="handleDelete(row)" class="text-horizon-danger hover:underline text-sm">Hapus</button>
      </template>
    </DataTable>

    <ModalForm :show="modalShow" title="Tambah Data Monitoring" :loading="saving" @close="modalShow = false" @submit="handleSave">
      <div>
        <label class="block text-sm text-horizon-muted mb-1">Aset *</label>
        <select v-model="form.id_aset" required class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral">
          <option value="">Pilih Aset</option>
          <option v-for="a in asetList" :key="a.id" :value="a.id">{{ a.kode_aset }} — {{ a.nama_aset }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-horizon-muted mb-1">Tanggal Cek *</label>
        <input v-model="form.tgl_cek" type="date" required class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral" />
      </div>
      <div>
        <label class="block text-sm text-horizon-muted mb-1">Kondisi *</label>
        <select v-model="form.kondisi" required class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral">
          <option value="baik">Baik</option>
          <option value="rusak_ringan">Rusak Ringan</option>
          <option value="rusak_berat">Rusak Berat</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-horizon-muted mb-1">Keterangan</label>
        <textarea v-model="form.keterangan" rows="3" class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral"></textarea>
      </div>
    </ModalForm>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '../components/common/DataTable.vue'
import ModalForm from '../components/common/ModalForm.vue'
import { useAlert } from '../composables/useAlert'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const alert = useAlert()
const auth = useAuthStore()

const columns = [
  { key: 'nama_aset', label: 'Nama Aset' },
  { key: 'kode_aset', label: 'Kode' },
  { key: 'tgl_cek', label: 'Tanggal Cek' },
  { key: 'kondisi', label: 'Kondisi' },
  { key: 'keterangan', label: 'Keterangan' },
  { key: 'nama_petugas', label: 'Petugas' },
]

const items = ref([])
const asetList = ref([])
const loading = ref(false)
const saving = ref(false)
const modalShow = ref(false)
const form = ref({ id_aset: '', tgl_cek: new Date().toISOString().split('T')[0], kondisi: 'baik', keterangan: '' })

function kondisiClass(k) {
  if (k === 'baik') return 'bg-horizon-teal/10 text-horizon-teal'
  if (k === 'rusak_ringan') return 'bg-horizon-amber/10 text-horizon-amber'
  return 'bg-horizon-danger/10 text-horizon-danger'
}
function kondisiLabel(k) {
  return { baik: 'Baik', rusak_ringan: 'Rusak Ringan', rusak_berat: 'Rusak Berat' }[k] || k
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function fetchItems() {
  loading.value = true
  try {
    const { data } = await api.get('/monitoring')
    items.value = data.data
  } catch { alert.error('Gagal', 'Tidak dapat memuat data monitoring') }
  finally { loading.value = false }
}

async function fetchAset() {
  try {
    const { data } = await api.get('/aset', { params: { status: 'aktif' } })
    asetList.value = data.data
  } catch {}
}

function openModal() {
  form.value = { id_aset: '', tgl_cek: new Date().toISOString().split('T')[0], kondisi: 'baik', keterangan: '' }
  modalShow.value = true
}

async function handleSave() {
  saving.value = true
  try {
    await api.post('/monitoring', form.value)
    alert.success('Berhasil', 'Data monitoring ditambahkan')
    modalShow.value = false
    fetchItems()
  } catch (e) {
    alert.error('Gagal', e.response?.data?.message || 'Terjadi kesalahan')
  } finally { saving.value = false }
}

async function handleDelete(item) {
  const result = await alert.confirm('Hapus Data?', 'Data monitoring akan dihapus.')
  if (result.isConfirmed) {
    try {
      await api.delete(`/monitoring/${item.id}`)
      alert.success('Berhasil', 'Data monitoring dihapus')
      fetchItems()
    } catch { alert.error('Gagal', 'Tidak dapat menghapus data') }
  }
}

onMounted(() => { fetchItems(); fetchAset() })
</script>
