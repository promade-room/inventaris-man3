# PRD: Sistem Informasi Inventaris Sarana & Prasarana MAN 3 Palembang

## 1. Ringkasan Proyek

**Nama Proyek:** Inventaris MAN 3 Palembang
**Deskripsi:** Sistem informasi inventaris sarana dan prasarana berbasis web untuk Madrasah Aliyah Negeri 3 Palembang dengan metode penyusutan garis lurus (Straight-Line Method).
**Tujuan:** Digitalisasi pengelolaan aset sekolah yang masih manual, menghitung penyusutan aset secara otomatis, dan menghasilkan laporan inventaris yang akurat.

---

## 2. Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Vue 3 (Composition API, Vite) |
| CSS | TailwindCSS + tema **Horizon** |
| Alert/Modal | SweetAlert2 |
| Backend | Express.js (Node.js) |
| Database | MySQL |
| Auth | JWT (jsonwebtoken + bcrypt) |
| Export | ExcelJS (Excel), PDFKit (PDF) |

---

## 3. Actors (Pengguna)

| Role | Akses |
|------|-------|
| **Admin** | Full akses — kelola pengguna, kategori, lokasi, data aset, penyusutan, monitoring, laporan |
| **Petugas Sarpras** | Kelola data master inventaris, input aset & parameter penyusutan, hitung penyusutan, monitoring, cetak laporan |
| **Kepala Sekolah** | View-only — lihat dashboard, laporan penyusutan, cetak laporan |

---

## 4. Database Schema (MySQL)

### 4.1 `users`
| Field | Type | Note |
|-------|------|------|
| id | INT PK AUTO_INCREMENT | |
| username | VARCHAR(50) UNIQUE | |
| password | VARCHAR(255) | bcrypt hash |
| nama_lengkap | VARCHAR(100) | |
| role | ENUM('admin','petugas','kepsek') | Default: 'petugas' |
| is_active | TINYINT(1) | Default: 1 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

### 4.2 `kategori`
| Field | Type | Note |
|-------|------|------|
| id | INT PK AUTO_INCREMENT | |
| nama_kategori | VARCHAR(100) | Contoh: Elektronik, Mebel, Kendaraan |
| keterangan | TEXT | |
| created_at | TIMESTAMP | |

### 4.3 `lokasi`
| Field | Type | Note |
|-------|------|------|
| id | INT PK AUTO_INCREMENT | |
| nama_lokasi | VARCHAR(100) | Contoh: Lab Komputer, Ruang Kelas X-1 |
| gedung | VARCHAR(100) | |
| keterangan | TEXT | |
| created_at | TIMESTAMP | |

### 4.4 `aset`
| Field | Type | Note |
|-------|------|------|
| id | INT PK AUTO_INCREMENT | |
| kode_aset | VARCHAR(50) UNIQUE | Kode barcode/inventaris |
| nama_aset | VARCHAR(150) | |
| id_kategori | INT FK → kategori.id | |
| id_lokasi | INT FK → lokasi.id | |
| tgl_perolehan | DATE | Tanggal pembelian |
| harga_perolehan | DECIMAL(15,2) | Harga beli (Rupiah) |
| nilai_residu | DECIMAL(15,2) | Nilai sisa akhir masa pakai |
| umur_ekonomis | INT | Masa pakai (tahun) |
| status_aset | ENUM('aktif','dihapus') | Default: 'aktif' |
| created_by | INT FK → users.id | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### 4.5 `penyusutan`
| Field | Type | Note |
|-------|------|------|
| id | INT PK AUTO_INCREMENT | |
| id_aset | INT FK → aset.id | |
| tahun_ke | INT | Tahun penyusutan ke-1, ke-2, dst |
| beban_penyusutan | DECIMAL(15,2) | Penyusutan tahun ini |
| akumulasi_penyusutan | DECIMAL(15,2) | Total penyusutan s/d tahun ini |
| nilai_buku | DECIMAL(15,2) | Harga perolehan - akumulasi |
| created_at | TIMESTAMP | |

### 4.6 `monitoring`
| Field | Type | Note |
|-------|------|------|
| id | INT PK AUTO_INCREMENT | |
| id_aset | INT FK → aset.id | |
| tgl_cek | DATE | |
| kondisi | ENUM('baik','rusak_ringan','rusak_berat') | |
| keterangan | TEXT | Catatan tambahan |
| id_user | INT FK → users.id | Petugas yang mengecek |
| created_at | TIMESTAMP | |

### 4.7 `laporan_log`
| Field | Type | Note |
|-------|------|------|
| id | INT PK AUTO_INCREMENT | |
| jenis_laporan | ENUM('data_aset','penyusutan','monitoring','aset_rusak') | |
| periode_awal | DATE | |
| periode_akhir | DATE | |
| format_file | VARCHAR(10) | pdf / xlsx |
| id_user | INT FK → users.id | |
| created_at | TIMESTAMP | |

---

## 5. Rumus Penyusutan (Metode Garis Lurus)

```
Penyusutan Tahunan = (Harga Perolehan - Nilai Residu) / Umur Ekonomis

Akumulasi Penyusutan(n) = Penyusutan Tahunan × n

Nilai Buku(n) = Harga Perolehan - Akumulasi Penyusutan(n)
```

**Contoh:**
- Harga Perolehan: Rp 15.000.000
- Nilai Residu: Rp 1.500.000
- Umur Ekonomis: 5 tahun
- Penyusutan/Tahun: (15.000.000 - 1.500.000) / 5 = **Rp 2.700.000**

| Tahun ke- | Beban | Akumulasi | Nilai Buku |
|-----------|-------|-----------|------------|
| 1 | 2.700.000 | 2.700.000 | 12.300.000 |
| 2 | 2.700.000 | 5.400.000 | 9.600.000 |
| 3 | 2.700.000 | 8.100.000 | 6.900.000 |
| 4 | 2.700.000 | 10.800.000 | 4.200.000 |
| 5 | 2.700.000 | 13.500.000 | 1.500.000 |

---

## 6. API Endpoints

### 6.1 Auth
```
POST   /api/auth/login          → Login, return JWT
POST   /api/auth/logout         → Logout (client-side hapus token)
GET    /api/auth/me             → Get current user profile
```

### 6.2 Users (Admin only)
```
GET    /api/users               → List semua pengguna
POST   /api/users               → Tambah pengguna
PUT    /api/users/:id           → Edit pengguna
DELETE /api/users/:id           → Hapus / nonaktifkan pengguna
```

### 6.3 Kategori
```
GET    /api/kategori             → List kategori
POST   /api/kategori             → Tambah kategori (admin)
PUT    /api/kategori/:id         → Edit kategori (admin)
DELETE /api/kategori/:id         → Hapus kategori (admin)
```

### 6.4 Lokasi
```
GET    /api/lokasi               → List lokasi
POST   /api/lokasi               → Tambah lokasi (admin)
PUT    /api/lokasi/:id           → Edit lokasi (admin)
DELETE /api/lokasi/:id           → Hapus lokasi (admin)
```

### 6.5 Aset
```
GET    /api/aset                 → List aset (filter: kategori, lokasi, status, search)
GET    /api/aset/:id             → Detail aset + data penyusutan
POST   /api/aset                 → Tambah aset (admin/petugas)
PUT    /api/aset/:id             → Edit aset (admin/petugas)
DELETE /api/aset/:id             → Soft delete (set status = 'dihapus')
```

### 6.6 Penyusutan
```
POST   /api/penyusutan/hitung/:id_aset  → Hitung & simpan penyusutan untuk aset
GET    /api/penyusutan/:id_aset          → List penyusutan per aset
GET    /api/penyusutan                   → List semua penyusutan (tabel ringkasan)
```

### 6.7 Monitoring
```
GET    /api/monitoring           → List semua data monitoring
GET    /api/monitoring/:id_aset  → Riwayat monitoring per aset
POST   /api/monitoring           → Input data monitoring (admin/petugas)
```

### 6.8 Dashboard
```
GET    /api/dashboard/stats      → Total aset, nilai total, aset per kondisi, aset per kategori
GET    /api/dashboard/chart      → Data chart (penyusutan per tahun, aset per kategori, dll)
```

### 6.9 Laporan & Export
```
GET    /api/laporan/aset         → Laporan data aset (filter: kategori, lokasi, periode)
GET    /api/laporan/penyusutan   → Laporan penyusutan (filter: periode)
GET    /api/laporan/monitoring   → Laporan monitoring (filter: kondisi, periode)
GET    /api/export/aset?format=xlsx|pdf  → Export data aset
GET    /api/export/penyusutan?format=xlsx|pdf → Export laporan penyusutan
```

---

## 7. Frontend Pages & Routes

| # | Path | Page | Akses |
|---|------|------|-------|
| 1 | `/login` | Login Page | Public |
| 2 | `/` | Dashboard | All authenticated |
| 3 | `/master/kategori` | Kelola Kategori | Admin |
| 4 | `/master/lokasi` | Kelola Lokasi | Admin |
| 5 | `/master/pengguna` | Kelola Pengguna | Admin |
| 6 | `/aset` | Data Aset (CRUD + list) | Admin, Petugas |
| 7 | `/aset/:id` | Detail Aset | Admin, Petugas |
| 8 | `/penyusutan` | Tabel Penyusutan Semua Aset | Admin, Petugas, Kepsek |
| 9 | `/penyusutan/:id` | Detail Penyusutan per Aset | Admin, Petugas |
| 10 | `/monitoring` | Monitoring Aset | Admin, Petugas |
| 11 | `/laporan` | Pusat Laporan & Export | All authenticated |

---

## 8. UI/UX Requirements

### 8.1 Tema & Desain
- Gunakan **TailwindCSS** dengan tema **Horizon** (warm palette — coral, teal, cream, dark navy)
- Dark mode support (opsional, bisa phase 2)
- Responsive (mobile-friendly untuk cek aset via HP)

### 8.2 Komponen Umum
- **Sidebar navigasi** — collapsible, icon + label
- **Data Table** — sortable, searchable, paginated (bisa pakai Vue TanStack Table)
- **SweetAlert2** untuk:
  - Konfirmasi hapus data
  - Success/error notification setiap CRUD
  - Form dialog sederhana (jika perlu)
- **Modal form** untuk tambah/edit data (kategori, lokasi, aset, monitoring)
- **Loading skeleton** saat fetch data
- **Toast notification** untuk feedback cepat

### 8.3 Dashboard
- **Summary cards:** Total Aset, Total Nilai Aset, Aset Baik, Aset Rusak
- **Chart:** Aset per Kategori (Pie/Donut), Penyusutan per Tahun (Bar/Line)
- **Recent activity:** 5 monitoring terbaru, 5 aset terbaru

### 8.4 Form Aset (Input)
Field yang perlu diinput:
1. Kode Aset (auto-generate atau manual)
2. Nama Aset
3. Kategori (dropdown)
4. Lokasi (dropdown)
5. Tanggal Perolehan (date picker)
6. Harga Perolehan (currency input)
7. Nilai Residu (currency input)
8. Umur Ekonomis (number input, tahun)

→ Setelah submit, sistem otomatis menghitung penyusutan & simpan ke tabel `penyusutan`.

### 8.5 Export
- **Excel:** Data aset, laporan penyusutan (dengan styling header, format Rupiah)
- **PDF:** Laporan inventaris untuk cetak/arsip

### 8.6 Fitur Unggulan: Metode Garis Lurus (Highlight Strategy)

Fitur penyusutan garis lurus adalah **core differentiator** sistem ini. Berikut cara menonjolkannya:

#### A. Live Preview saat Input Aset
Saat user mengisi form aset (harga_perolehan, nilai_residu, umur_ekonomis), sistem menampilkan **preview real-time** di samping form:
- Rumus yang dipakai dengan value yang diinput
- Tabel preview penyusutan per tahun (tahun ke-, beban, akumulasi, nilai buku)
- Chart mini penurunan nilai buku
- Ini memperkuat pemahaman user terhadap metode sebelum data disimpan

#### B. Halaman Detail Penyusutan per Aset
- Tampilkan rumus lengkap dengan angka aktual aset tersebut
- Chart line: penurunan nilai buku dari tahun ke-1 sampai akhir umur ekonomis
- Highlight nilai buku saat ini dengan badge warna
- Progress bar sisa persentase nilai aset (ekonomis)
- Perbandingan: harga perolehan vs nilai buku saat ini

#### C. Dashboard Widget Khusus Penyusutan
- Card: "Total Nilai Buku Aset" (real-time aggregation)
- Card: "Total Penyusutan Tahun Ini"
- Chart ringkasan: tren penyusutan semua aset per tahun

#### D. Formula Badge
Di setiap halaman terkait penyusutan, tampilkan badge/tooltip:
```
📐 Metode Garis Lurus: (Harga Perolehan − Nilai Residu) ÷ Umur Manfaat
```

#### E. Laporan Penyusutan Detail
- Step-by-step perhitungan yang bisa dilampirkan sebagai buktin akuntansi
- Menampilkan: Harga Perolehan → Nilai Residu → Umur Manfaat → Penyusutan/Tahun
- Tabel lengkap per tahun + chart visual

---

## 9. Auth & Middleware

- JWT-based authentication
- Password di-hash pakai bcrypt (salt rounds: 10)
- Middleware `auth` → cek token valid
- Middleware `role(...roles)` → restrict by role
- Token expired: 8 jam

---

## 10. Folder Structure

```
inventaris-man3/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MySQL connection pool
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT verification
│   │   │   └── role.js            # Role-based access
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── kategori.routes.js
│   │   │   ├── lokasi.routes.js
│   │   │   ├── aset.routes.js
│   │   │   ├── penyusutan.routes.js
│   │   │   ├── monitoring.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   └── laporan.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── kategori.controller.js
│   │   │   ├── lokasi.controller.js
│   │   │   ├── aset.controller.js
│   │   │   ├── penyusutan.controller.js
│   │   │   ├── monitoring.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   └── laporan.controller.js
│   │   ├── services/
│   │   │   └── penyusutan.service.js  # Rumus garis lurus
│   │   ├── utils/
│   │   │   ├── exportExcel.js
│   │   │   └── exportPdf.js
│   │   └── app.js                 # Express setup
│   ├── database/
│   │   └── migration.sql          # Schema SQL
│   ├── .env
│   ├── package.json
│   └── server.js                  # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppSidebar.vue
│   │   │   │   ├── AppHeader.vue
│   │   │   │   └── AppLayout.vue
│   │   │   ├── common/
│   │   │   │   ├── DataTable.vue
│   │   │   │   ├── ModalForm.vue
│   │   │   │   ├── SummaryCard.vue
│   │   │   │   └── LoadingSkeleton.vue
│   │   │   └── charts/
│   │   │       ├── PieChart.vue
│   │   │       └── BarChart.vue
│   │   ├── views/
│   │   │   ├── LoginView.vue
│   │   │   ├── DashboardView.vue
│   │   │   ├── master/
│   │   │   │   ├── KategoriView.vue
│   │   │   │   ├── LokasiView.vue
│   │   │   │   └── PenggunaView.vue
│   │   │   ├── aset/
│   │   │   │   ├── AsetListView.vue
│   │   │   │   └── AsetDetailView.vue
│   │   │   ├── penyusutan/
│   │   │   │   ├── PenyusutanListView.vue
│   │   │   │   └── PenyusutanDetailView.vue
│   │   │   ├── MonitoringView.vue
│   │   │   └── LaporanView.vue
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── stores/
│   │   │   ├── auth.js            # Pinia store
│   │   │   └── aset.js
│   │   ├── services/
│   │   │   └── api.js             # Axios instance
│   │   ├── composables/
│   │   │   ├── useAlert.js        # SweetAlert2 wrapper
│   │   │   └── useTable.js        # Table logic
│   │   ├── App.vue
│   │   └── main.js
│   ├── public/
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── PRD.md                          # ← This file
└── README.md
```

---

## 11. Development Milestones

| Phase | Scope | Estimasi |
|-------|-------|----------|
| **Phase 1** | Setup project, DB schema, Auth (login/register), Dashboard shell | 1-2 hari |
| **Phase 2** | Master Data (Kategori, Lokasi, Pengguna) CRUD | 1 hari |
| **Phase 3** | Aset CRUD + input form + auto penyusutan calculation | 2 hari |
| **Phase 4** | Penyusutan view, Monitoring CRUD | 1-2 hari |
| **Phase 5** | Laporan & Export (Excel/PDF) | 1-2 hari |
| **Phase 6** | Dashboard charts, polish UI, bugfix, testing | 1-2 hari |

**Total estimasi: ~8-11 hari**

---

## 12. Non-Functional Requirements

- **Security:** SQL injection prevention (parameterized queries / ORM), XSS protection, CORS config
- **Performance:** Pagination pada semua list (max 25 data/page), indexed FK columns
- **Validation:** Backend validation (Joi/Zod) + frontend validation
- **Error Handling:** Consistent error response format `{ success, message, data }`
- **Logging:** Morgan untuk HTTP logging, error logging ke console/file
- **Environment:** `.env` untuk DB credentials, JWT secret, port config
