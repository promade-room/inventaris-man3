CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  role ENUM('admin','petugas','kepsek') DEFAULT 'petugas',
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kategori (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_kategori VARCHAR(100) NOT NULL,
  keterangan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lokasi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_lokasi VARCHAR(100) NOT NULL,
  gedung VARCHAR(100),
  keterangan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS aset (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_aset VARCHAR(50) UNIQUE NOT NULL,
  nama_aset VARCHAR(150) NOT NULL,
  id_kategori INT NOT NULL,
  id_lokasi INT NOT NULL,
  tgl_perolehan DATE NOT NULL,
  harga_perolehan DECIMAL(15,2) NOT NULL,
  nilai_residu DECIMAL(15,2) DEFAULT 0,
  umur_ekonomis INT NOT NULL,
  status_aset ENUM('aktif','dihapus') DEFAULT 'aktif',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_kategori) REFERENCES kategori(id),
  FOREIGN KEY (id_lokasi) REFERENCES lokasi(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS penyusutan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_aset INT NOT NULL,
  tahun_ke INT NOT NULL,
  beban_penyusutan DECIMAL(15,2) NOT NULL,
  akumulasi_penyusutan DECIMAL(15,2) NOT NULL,
  nilai_buku DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_aset) REFERENCES aset(id)
);

CREATE TABLE IF NOT EXISTS monitoring (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_aset INT NOT NULL,
  tgl_cek DATE NOT NULL,
  kondisi ENUM('baik','rusak_ringan','rusak_berat') NOT NULL,
  keterangan TEXT,
  id_user INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_aset) REFERENCES aset(id),
  FOREIGN KEY (id_user) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS laporan_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jenis_laporan ENUM('data_aset','penyusutan','monitoring','aset_rusak') NOT NULL,
  periode_awal DATE,
  periode_akhir DATE,
  format_file VARCHAR(10),
  id_user INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id)
);

-- Default admin (password: admin123)
INSERT IGNORE INTO users (username, password, nama_lengkap, role) VALUES
('admin', '$2a$10$rDkOlaGiGmE6t4P7zR8fHO4YJ3YQZRqKMPZfZ8L3b7CjSOqMGDGmG', 'Administrator', 'admin');
