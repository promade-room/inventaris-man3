import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    component: () => import('../components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: () => import('../views/DashboardView.vue') },
      { path: 'master/kategori', name: 'Kategori', component: () => import('../views/master/KategoriView.vue') },
      { path: 'master/lokasi', name: 'Lokasi', component: () => import('../views/master/LokasiView.vue') },
      { path: 'master/pengguna', name: 'Pengguna', component: () => import('../views/master/PenggunaView.vue') },
      { path: 'aset', name: 'AsetList', component: () => import('../views/aset/AsetListView.vue') },
      { path: 'aset/:id', name: 'AsetDetail', component: () => import('../views/aset/AsetDetailView.vue'), props: true },
      { path: 'penyusutan', name: 'PenyusutanList', component: () => import('../views/penyusutan/PenyusutanListView.vue') },
      { path: 'penyusutan/:id', name: 'PenyusutanDetail', component: () => import('../views/penyusutan/PenyusutanDetailView.vue'), props: true },
      { path: 'monitoring', name: 'Monitoring', component: () => import('../views/MonitoringView.vue') },
      { path: 'laporan', name: 'Laporan', component: () => import('../views/LaporanView.vue') },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.guest && token) {
    next('/')
  } else {
    next()
  }
})

export default router
