<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-horizon-text">Data Pengguna</h2>
      <button @click="openModal()" class="px-4 py-2 rounded-lg bg-horizon-coral text-white text-sm hover:bg-horizon-coral/80">
        + Tambah Pengguna
      </button>
    </div>

    <DataTable :columns="columns" :data="items" :loading="loading" search-placeholder="Cari pengguna...">
      <template #cell-role="{ value }">
        <span class="text-xs px-2 py-1 rounded-full" :class="roleClass(value)">{{ roleLabel(value) }}</span>
      </template>
      <template #cell-is_active="{ value }">
        <span class="text-xs px-2 py-1 rounded-full" :class="value ? 'bg-horizon-teal/10 text-horizon-teal' : 'bg-horizon-danger/10 text-horizon-danger'">
          {{ value ? 'Aktif' : 'Nonaktif' }}
        </span>
      </template>
      <template #actions="{ row }">
        <button @click="openModal(row)" class="text-horizon-blue hover:underline text-sm mr-3">Edit</button>
        <button @click="handleDelete(row)" class="text-horizon-danger hover:underline text-sm">Hapus</button>
      </template>
    </DataTable>

    <ModalForm :show="modalShow" :title="editId ? 'Edit Pengguna' : 'Tambah Pengguna'" :loading="saving" @close="modalShow = false" @submit="handleSave">
      <div>
        <label class="block text-sm text-horizon-muted mb-1">Username *</label>
        <input v-model="form.username" type="text" required class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral" />
      </div>
      <div>
        <label class="block text-sm text-horizon-muted mb-1">{{ editId ? 'Password (kosongkan jika tidak diubah)' : 'Password *' }}</label>
        <input v-model="form.password" type="password" :required="!editId" class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral" />
      </div>
      <div>
        <label class="block text-sm text-horizon-muted mb-1">Nama Lengkap *</label>
        <input v-model="form.nama_lengkap" type="text" required class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral" />
      </div>
      <div>
        <label class="block text-sm text-horizon-muted mb-1">Role *</label>
        <select v-model="form.role" required class="w-full px-4 py-2 rounded-lg bg-horizon-card border border-horizon-border text-horizon-text focus:outline-none focus:border-horizon-coral">
          <option value="admin">Admin</option>
          <option value="petugas">Petugas Sarpras</option>
          <option value="kepsek">Kepala Sekolah</option>
        </select>
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
  { key: 'username', label: 'Username' },
  { key: 'nama_lengkap', label: 'Nama Lengkap' },
  { key: 'role', label: 'Role' },
  { key: 'is_active', label: 'Status' },
]

const items = ref([])
const loading = ref(false)
const saving = ref(false)
const modalShow = ref(false)
const editId = ref(null)
const form = ref({ username: '', password: '', nama_lengkap: '', role: 'petugas' })

function roleClass(r) {
  if (r === 'admin') return 'bg-horizon-coral/10 text-horizon-coral'
  if (r === 'petugas') return 'bg-horizon-teal/10 text-horizon-teal'
  return 'bg-horizon-purple/10 text-horizon-purple'
}
function roleLabel(r) {
  return { admin: 'Admin', petugas: 'Petugas', kepsek: 'Kepala Sekolah' }[r] || r
}

async function fetchItems() {
  loading.value = true
  try {
    const { data } = await api.get('/users')
    items.value = data.data
  } catch { alert.error('Gagal', 'Tidak dapat memuat data pengguna') }
  finally { loading.value = false }
}

function openModal(item = null) {
  editId.value = item?.id || null
  form.value = item ? { username: item.username, password: '', nama_lengkap: item.nama_lengkap, role: item.role } : { username: '', password: '', nama_lengkap: '', role: 'petugas' }
  modalShow.value = true
}

async function handleSave() {
  saving.value = true
  try {
    const payload = { ...form.value }
    if (editId.value && !payload.password) delete payload.password
    if (editId.value) {
      await api.put(`/users/${editId.value}`, payload)
      alert.success('Berhasil', 'Pengguna diperbarui')
    } else {
      await api.post('/users', payload)
      alert.success('Berhasil', 'Pengguna ditambahkan')
    }
    modalShow.value = false
    fetchItems()
  } catch (e) {
    alert.error('Gagal', e.response?.data?.message || 'Terjadi kesalahan')
  } finally { saving.value = false }
}

async function handleDelete(item) {
  const result = await alert.confirm('Hapus Pengguna?', `Pengguna "${item.nama_lengkap}" akan dinonaktifkan.`)
  if (result.isConfirmed) {
    try {
      await api.delete(`/users/${item.id}`)
      alert.success('Berhasil', 'Pengguna dihapus')
      fetchItems()
    } catch { alert.error('Gagal', 'Tidak dapat menghapus pengguna') }
  }
}

onMounted(fetchItems)
</script>
