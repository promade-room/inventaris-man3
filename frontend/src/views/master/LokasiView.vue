<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-horizon-text">Data Lokasi</h2>
      <button @click="openModal()" class="px-4 py-2 rounded-lg bg-horizon-coral text-white text-sm hover:bg-horizon-coral/80">
        + Tambah Lokasi
      </button>
    </div>

    <DataTable :columns="columns" :data="items" :loading="loading" search-placeholder="Cari lokasi...">
      <template #cell-gedung="{ value }">
        <span class="text-horizon-muted">{{ value || '-' }}</span>
      </template>
      <template #cell-keterangan="{ value }">
        <span class="text-horizon-muted">{{ value || '-' }}</span>
      </template>
      <template #actions="{ row }">
        <button @click="openModal(row)" class="text-horizon-blue hover:underline text-sm mr-3">Edit</button>
        <button @click="handleDelete(row)" class="text-horizon-danger hover:underline text-sm">Hapus</button>
      </template>
    </DataTable>

    <ModalForm :show="modalShow" :title="editId ? 'Edit Lokasi' : 'Tambah Lokasi'" :loading="saving" @close="modalShow = false" @submit="handleSave">
      <div>
        <label class="block text-sm text-horizon-muted mb-1">Nama Lokasi *</label>
        <input v-model="form.nama_lokasi" type="text" required class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral" />
      </div>
      <div>
        <label class="block text-sm text-horizon-muted mb-1">Gedung</label>
        <input v-model="form.gedung" type="text" class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral" />
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
import DataTable from '../../components/common/DataTable.vue'
import ModalForm from '../../components/common/ModalForm.vue'
import { useAlert } from '../../composables/useAlert'
import api from '../../services/api'

const alert = useAlert()
const columns = [
  { key: 'nama_lokasi', label: 'Nama Lokasi' },
  { key: 'gedung', label: 'Gedung' },
  { key: 'keterangan', label: 'Keterangan' },
]

const items = ref([])
const loading = ref(false)
const saving = ref(false)
const modalShow = ref(false)
const editId = ref(null)
const form = ref({ nama_lokasi: '', gedung: '', keterangan: '' })

async function fetchItems() {
  loading.value = true
  try {
    const { data } = await api.get('/lokasi')
    items.value = data.data
  } catch { alert.error('Gagal', 'Tidak dapat memuat data lokasi') }
  finally { loading.value = false }
}

function openModal(item = null) {
  editId.value = item?.id || null
  form.value = item ? { nama_lokasi: item.nama_lokasi, gedung: item.gedung || '', keterangan: item.keterangan || '' } : { nama_lokasi: '', gedung: '', keterangan: '' }
  modalShow.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editId.value) {
      await api.put(`/lokasi/${editId.value}`, form.value)
      alert.success('Berhasil', 'Lokasi diperbarui')
    } else {
      await api.post('/lokasi', form.value)
      alert.success('Berhasil', 'Lokasi ditambahkan')
    }
    modalShow.value = false
    fetchItems()
  } catch (e) {
    alert.error('Gagal', e.response?.data?.message || 'Terjadi kesalahan')
  } finally { saving.value = false }
}

async function handleDelete(item) {
  const result = await alert.confirm('Hapus Lokasi?', `Lokasi "${item.nama_lokasi}" akan dihapus.`)
  if (result.isConfirmed) {
    try {
      await api.delete(`/lokasi/${item.id}`)
      alert.success('Berhasil', 'Lokasi dihapus')
      fetchItems()
    } catch { alert.error('Gagal', 'Tidak dapat menghapus lokasi') }
  }
}

onMounted(fetchItems)
</script>
