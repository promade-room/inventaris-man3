/*
 Navicat Premium Dump SQL

 Source Server         : LOKO Dev OpenClaw
 Source Server Type    : MySQL
 Source Server Version : 80028 (8.0.28)
 Source Host           : 103.127.99.28:3306
 Source Schema         : inventaris_man3

 Target Server Type    : MySQL
 Target Server Version : 80028 (8.0.28)
 File Encoding         : 65001

 Date: 23/06/2026 07:00:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for aset
-- ----------------------------
DROP TABLE IF EXISTS `aset`;
CREATE TABLE `aset`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `kode_aset` varchar(50) NOT NULL,
  `nama_aset` varchar(150) NOT NULL,
  `id_kategori` int NOT NULL,
  `id_lokasi` int NOT NULL,
  `tgl_perolehan` date NOT NULL,
  `harga_perolehan` decimal(15, 2) NOT NULL,
  `nilai_residu` decimal(15, 2) NULL DEFAULT 0.00,
  `umur_ekonomis` int NOT NULL,
  `status_aset` enum('aktif','dihapus') NULL DEFAULT 'aktif',
  `created_by` int NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `kode_aset`(`kode_aset` ASC) USING BTREE,
  INDEX `id_kategori`(`id_kategori` ASC) USING BTREE,
  INDEX `id_lokasi`(`id_lokasi` ASC) USING BTREE,
  INDEX `created_by`(`created_by` ASC) USING BTREE,
  CONSTRAINT `aset_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `aset_ibfk_2` FOREIGN KEY (`id_lokasi`) REFERENCES `lokasi` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `aset_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of aset
-- ----------------------------
INSERT INTO `aset` VALUES (1, 'INV-001', 'Komputer Desktop Intel i5', 1, 5, '2023-01-15', 8500000.00, 850000.00, 5, 'aktif', 1, '2026-03-30 01:24:16', '2026-03-30 01:24:16');
INSERT INTO `aset` VALUES (2, 'INV-002', 'Proyektor Epson EB-X51', 1, 5, '2022-06-20', 6200000.00, 500000.00, 5, 'aktif', 1, '2026-03-30 01:24:16', '2026-03-30 01:24:16');
INSERT INTO `aset` VALUES (3, 'INV-003', 'Meja Siswa Kayu Jati', 2, 1, '2021-03-10', 750000.00, 50000.00, 10, 'aktif', 1, '2026-03-30 01:24:17', '2026-03-30 01:24:17');
INSERT INTO `aset` VALUES (4, 'INV-004', 'Kursi Siswa Plastik', 2, 1, '2021-03-10', 180000.00, 10000.00, 5, 'aktif', 1, '2026-03-30 01:24:17', '2026-03-30 01:24:17');
INSERT INTO `aset` VALUES (5, 'INV-005', 'Sepeda Motor Honda Beat', 3, 12, '2022-08-05', 18500000.00, 2000000.00, 5, 'aktif', 1, '2026-03-30 01:24:17', '2026-03-30 01:24:17');
INSERT INTO `aset` VALUES (6, 'INV-006', 'Printer LaserJet HP', 4, 10, '2023-05-12', 3200000.00, 300000.00, 4, 'aktif', 1, '2026-03-30 01:24:17', '2026-03-30 01:24:17');
INSERT INTO `aset` VALUES (7, 'INV-007', 'Mikroskop Binokuler', 5, 7, '2021-11-20', 4500000.00, 500000.00, 7, 'aktif', 1, '2026-03-30 01:24:18', '2026-03-30 01:24:18');
INSERT INTO `aset` VALUES (8, 'INV-008', 'Bola Voli Mikasa', 6, 9, '2024-01-08', 350000.00, 50000.00, 2, 'aktif', 1, '2026-03-30 01:24:18', '2026-03-30 01:24:18');
INSERT INTO `aset` VALUES (9, 'INV-009', 'AC Split 1.5 PK Daikin', 1, 5, '2022-02-14', 5800000.00, 500000.00, 8, 'aktif', 1, '2026-03-30 01:24:18', '2026-03-30 01:24:18');
INSERT INTO `aset` VALUES (10, 'INV-010', 'Laptop Asus VivoBook', 1, 10, '2023-09-01', 9200000.00, 900000.00, 4, 'aktif', 1, '2026-03-30 01:24:18', '2026-03-30 01:24:18');
INSERT INTO `aset` VALUES (11, 'INV-011', 'Whiteboard 120x90cm', 8, 1, '2020-07-15', 450000.00, 50000.00, 5, 'aktif', 1, '2026-03-30 01:24:18', '2026-03-30 01:24:18');
INSERT INTO `aset` VALUES (12, 'INV-012', 'Speaker Aktif Polytron', 10, 9, '2023-03-22', 1800000.00, 200000.00, 5, 'aktif', 1, '2026-03-30 01:24:19', '2026-03-30 01:24:19');
INSERT INTO `aset` VALUES (13, 'INV-013', 'Rak Buku 5 Susun', 2, 8, '2021-05-30', 650000.00, 50000.00, 10, 'aktif', 1, '2026-03-30 01:24:19', '2026-03-30 01:24:19');
INSERT INTO `aset` VALUES (14, 'INV-014', 'Kompor Gas Rinnai 2 Tungku', 8, 12, '2022-10-11', 850000.00, 100000.00, 5, 'aktif', 1, '2026-03-30 01:24:19', '2026-03-30 01:24:19');
INSERT INTO `aset` VALUES (15, 'INV-015', 'Server Rack Dell PowerEdge', 12, 5, '2024-02-20', 35000000.00, 3500000.00, 5, 'aktif', 1, '2026-03-30 01:24:19', '2026-03-30 01:24:19');

-- ----------------------------
-- Table structure for kategori
-- ----------------------------
DROP TABLE IF EXISTS `kategori`;
CREATE TABLE `kategori`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(100) NOT NULL,
  `keterangan` text NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of kategori
-- ----------------------------
INSERT INTO `kategori` VALUES (1, 'Elektronik', NULL, '2026-03-30 01:24:11');
INSERT INTO `kategori` VALUES (2, 'Mebel', NULL, '2026-03-30 01:24:11');
INSERT INTO `kategori` VALUES (3, 'Kendaraan', NULL, '2026-03-30 01:24:12');
INSERT INTO `kategori` VALUES (4, 'Alat Tulis Kantor', NULL, '2026-03-30 01:24:12');
INSERT INTO `kategori` VALUES (5, 'Peralatan Lab', NULL, '2026-03-30 01:24:12');
INSERT INTO `kategori` VALUES (6, 'Peralatan Olahraga', NULL, '2026-03-30 01:24:12');
INSERT INTO `kategori` VALUES (7, 'Alat Kebersihan', NULL, '2026-03-30 01:24:12');
INSERT INTO `kategori` VALUES (8, 'Peralatan Dapur', NULL, '2026-03-30 01:24:13');
INSERT INTO `kategori` VALUES (9, 'Buku & Perpustakaan', NULL, '2026-03-30 01:24:13');
INSERT INTO `kategori` VALUES (10, 'Audio Visual', NULL, '2026-03-30 01:24:13');
INSERT INTO `kategori` VALUES (11, 'Peralatan Musik', NULL, '2026-03-30 01:24:13');
INSERT INTO `kategori` VALUES (12, 'Infrastruktur IT', NULL, '2026-03-30 01:24:13');

-- ----------------------------
-- Table structure for laporan_log
-- ----------------------------
DROP TABLE IF EXISTS `laporan_log`;
CREATE TABLE `laporan_log`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `jenis_laporan` enum('data_aset','penyusutan','monitoring','aset_rusak') NOT NULL,
  `periode_awal` date NULL DEFAULT NULL,
  `periode_akhir` date NULL DEFAULT NULL,
  `format_file` varchar(10) NULL DEFAULT NULL,
  `id_user` int NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id_user`(`id_user` ASC) USING BTREE,
  CONSTRAINT `laporan_log_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of laporan_log
-- ----------------------------

-- ----------------------------
-- Table structure for lokasi
-- ----------------------------
DROP TABLE IF EXISTS `lokasi`;
CREATE TABLE `lokasi`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_lokasi` varchar(100) NOT NULL,
  `gedung` varchar(100) NULL DEFAULT NULL,
  `keterangan` text NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of lokasi
-- ----------------------------
INSERT INTO `lokasi` VALUES (1, 'Ruang Kelas X-1', 'Gedung A', NULL, '2026-03-30 01:24:14');
INSERT INTO `lokasi` VALUES (2, 'Ruang Kelas X-2', 'Gedung A', NULL, '2026-03-30 01:24:14');
INSERT INTO `lokasi` VALUES (3, 'Ruang Kelas XI-1', 'Gedung A', NULL, '2026-03-30 01:24:14');
INSERT INTO `lokasi` VALUES (4, 'Ruang Kelas XII-1', 'Gedung B', NULL, '2026-03-30 01:24:14');
INSERT INTO `lokasi` VALUES (5, 'Lab Komputer', 'Gedung C', NULL, '2026-03-30 01:24:15');
INSERT INTO `lokasi` VALUES (6, 'Lab Fisika', 'Gedung C', NULL, '2026-03-30 01:24:15');
INSERT INTO `lokasi` VALUES (7, 'Lab Biologi', 'Gedung C', NULL, '2026-03-30 01:24:15');
INSERT INTO `lokasi` VALUES (8, 'Perpustakaan', 'Gedung D', NULL, '2026-03-30 01:24:15');
INSERT INTO `lokasi` VALUES (9, 'Aula Serbaguna', 'Gedung E', NULL, '2026-03-30 01:24:15');
INSERT INTO `lokasi` VALUES (10, 'Ruang Guru', 'Gedung F', NULL, '2026-03-30 01:24:16');
INSERT INTO `lokasi` VALUES (11, 'Masjid', 'Gedung G', NULL, '2026-03-30 01:24:16');
INSERT INTO `lokasi` VALUES (12, 'Gudang Inventaris', 'Gedung H', NULL, '2026-03-30 01:24:16');

-- ----------------------------
-- Table structure for monitoring
-- ----------------------------
DROP TABLE IF EXISTS `monitoring`;
CREATE TABLE `monitoring`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_aset` int NOT NULL,
  `tgl_cek` date NOT NULL,
  `kondisi` enum('baik','rusak_ringan','rusak_berat') NOT NULL,
  `keterangan` text NULL,
  `id_user` int NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id_aset`(`id_aset` ASC) USING BTREE,
  INDEX `id_user`(`id_user` ASC) USING BTREE,
  CONSTRAINT `monitoring_ibfk_1` FOREIGN KEY (`id_aset`) REFERENCES `aset` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `monitoring_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of monitoring
-- ----------------------------
INSERT INTO `monitoring` VALUES (1, 1, '2024-12-15', 'baik', 'Semua komponen berfungsi normal', 1, '2026-03-30 01:24:19');
INSERT INTO `monitoring` VALUES (2, 2, '2024-12-15', 'rusak_ringan', 'Lampu projektor mulai redup, perlu ganti', 1, '2026-03-30 01:24:20');
INSERT INTO `monitoring` VALUES (3, 3, '2025-01-10', 'baik', 'Kondisi baik, tidak ada kerusakan', 1, '2026-03-30 01:24:20');
INSERT INTO `monitoring` VALUES (4, 4, '2025-01-10', 'rusak_ringan', '3 kursi kaki goyang', 1, '2026-03-30 01:24:20');
INSERT INTO `monitoring` VALUES (5, 5, '2025-01-20', 'baik', 'Service rutin, oli diganti', 1, '2026-03-30 01:24:20');
INSERT INTO `monitoring` VALUES (6, 6, '2025-02-05', 'rusak_ringan', 'Tinta hampir habis, perlu refill', 1, '2026-03-30 01:24:20');
INSERT INTO `monitoring` VALUES (7, 7, '2025-02-10', 'baik', 'Lens bersih, mekanisme fokus OK', 1, '2026-03-30 01:24:21');
INSERT INTO `monitoring` VALUES (8, 1, '2025-02-15', 'baik', 'Pengecekan rutin bulanan', 1, '2026-03-30 01:24:21');
INSERT INTO `monitoring` VALUES (9, 9, '2025-02-20', 'rusak_berat', 'Freon habis, kompresor mati', 1, '2026-03-30 01:24:21');
INSERT INTO `monitoring` VALUES (10, 10, '2025-03-01', 'baik', 'Laptop dalam kondisi prima', 1, '2026-03-30 01:24:21');
INSERT INTO `monitoring` VALUES (11, 15, '2025-03-10', 'baik', 'Server running normal, disk 40% used', 1, '2026-03-30 01:24:22');
INSERT INTO `monitoring` VALUES (12, 12, '2025-03-15', 'rusak_ringan', 'Volume kiri lebih kecil dari kanan', 1, '2026-03-30 01:24:22');

-- ----------------------------
-- Table structure for penyusutan
-- ----------------------------
DROP TABLE IF EXISTS `penyusutan`;
CREATE TABLE `penyusutan`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_aset` int NOT NULL,
  `tahun_ke` int NOT NULL,
  `beban_penyusutan` decimal(15, 2) NOT NULL,
  `akumulasi_penyusutan` decimal(15, 2) NOT NULL,
  `nilai_buku` decimal(15, 2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id_aset`(`id_aset` ASC) USING BTREE,
  CONSTRAINT `penyusutan_ibfk_1` FOREIGN KEY (`id_aset`) REFERENCES `aset` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 83 CHARACTER SET = utf8mb4 ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of penyusutan
-- ----------------------------
INSERT INTO `penyusutan` VALUES (1, 1, 1, 1530000.00, 1530000.00, 6970000.00, '2026-03-30 01:24:22');
INSERT INTO `penyusutan` VALUES (2, 1, 2, 1530000.00, 3060000.00, 5440000.00, '2026-03-30 01:24:23');
INSERT INTO `penyusutan` VALUES (3, 1, 3, 1530000.00, 4590000.00, 3910000.00, '2026-03-30 01:24:23');
INSERT INTO `penyusutan` VALUES (4, 1, 4, 1530000.00, 6120000.00, 2380000.00, '2026-03-30 01:24:23');
INSERT INTO `penyusutan` VALUES (5, 1, 5, 1530000.00, 7650000.00, 850000.00, '2026-03-30 01:24:23');
INSERT INTO `penyusutan` VALUES (6, 2, 1, 1140000.00, 1140000.00, 5060000.00, '2026-03-30 01:24:24');
INSERT INTO `penyusutan` VALUES (7, 2, 2, 1140000.00, 2280000.00, 3920000.00, '2026-03-30 01:24:24');
INSERT INTO `penyusutan` VALUES (8, 2, 3, 1140000.00, 3420000.00, 2780000.00, '2026-03-30 01:24:24');
INSERT INTO `penyusutan` VALUES (9, 2, 4, 1140000.00, 4560000.00, 1640000.00, '2026-03-30 01:24:24');
INSERT INTO `penyusutan` VALUES (10, 2, 5, 1140000.00, 5700000.00, 500000.00, '2026-03-30 01:24:24');
INSERT INTO `penyusutan` VALUES (11, 3, 1, 70000.00, 70000.00, 680000.00, '2026-03-30 01:24:25');
INSERT INTO `penyusutan` VALUES (12, 3, 2, 70000.00, 140000.00, 610000.00, '2026-03-30 01:24:25');
INSERT INTO `penyusutan` VALUES (13, 3, 3, 70000.00, 210000.00, 540000.00, '2026-03-30 01:24:25');
INSERT INTO `penyusutan` VALUES (14, 3, 4, 70000.00, 280000.00, 470000.00, '2026-03-30 01:24:26');
INSERT INTO `penyusutan` VALUES (15, 3, 5, 70000.00, 350000.00, 400000.00, '2026-03-30 01:24:26');
INSERT INTO `penyusutan` VALUES (16, 3, 6, 70000.00, 420000.00, 330000.00, '2026-03-30 01:24:26');
INSERT INTO `penyusutan` VALUES (17, 3, 7, 70000.00, 490000.00, 260000.00, '2026-03-30 01:24:26');
INSERT INTO `penyusutan` VALUES (18, 3, 8, 70000.00, 560000.00, 190000.00, '2026-03-30 01:24:26');
INSERT INTO `penyusutan` VALUES (19, 3, 9, 70000.00, 630000.00, 120000.00, '2026-03-30 01:24:27');
INSERT INTO `penyusutan` VALUES (20, 3, 10, 70000.00, 700000.00, 50000.00, '2026-03-30 01:24:27');
INSERT INTO `penyusutan` VALUES (21, 4, 1, 34000.00, 34000.00, 146000.00, '2026-03-30 01:24:27');
INSERT INTO `penyusutan` VALUES (22, 4, 2, 34000.00, 68000.00, 112000.00, '2026-03-30 01:24:27');
INSERT INTO `penyusutan` VALUES (23, 4, 3, 34000.00, 102000.00, 78000.00, '2026-03-30 01:24:28');
INSERT INTO `penyusutan` VALUES (24, 4, 4, 34000.00, 136000.00, 44000.00, '2026-03-30 01:24:28');
INSERT INTO `penyusutan` VALUES (25, 4, 5, 34000.00, 170000.00, 10000.00, '2026-03-30 01:24:28');
INSERT INTO `penyusutan` VALUES (26, 5, 1, 3300000.00, 3300000.00, 15200000.00, '2026-03-30 01:24:28');
INSERT INTO `penyusutan` VALUES (27, 5, 2, 3300000.00, 6600000.00, 11900000.00, '2026-03-30 01:24:29');
INSERT INTO `penyusutan` VALUES (28, 5, 3, 3300000.00, 9900000.00, 8600000.00, '2026-03-30 01:24:29');
INSERT INTO `penyusutan` VALUES (29, 5, 4, 3300000.00, 13200000.00, 5300000.00, '2026-03-30 01:24:29');
INSERT INTO `penyusutan` VALUES (30, 5, 5, 3300000.00, 16500000.00, 2000000.00, '2026-03-30 01:24:29');
INSERT INTO `penyusutan` VALUES (31, 6, 1, 725000.00, 725000.00, 2475000.00, '2026-03-30 01:24:30');
INSERT INTO `penyusutan` VALUES (32, 6, 2, 725000.00, 1450000.00, 1750000.00, '2026-03-30 01:24:30');
INSERT INTO `penyusutan` VALUES (33, 6, 3, 725000.00, 2175000.00, 1025000.00, '2026-03-30 01:24:30');
INSERT INTO `penyusutan` VALUES (34, 6, 4, 725000.00, 2900000.00, 300000.00, '2026-03-30 01:24:30');
INSERT INTO `penyusutan` VALUES (35, 7, 1, 571428.57, 571428.57, 3928571.43, '2026-03-30 01:24:31');
INSERT INTO `penyusutan` VALUES (36, 7, 2, 571428.57, 1142857.14, 3357142.86, '2026-03-30 01:24:31');
INSERT INTO `penyusutan` VALUES (37, 7, 3, 571428.57, 1714285.71, 2785714.29, '2026-03-30 01:24:31');
INSERT INTO `penyusutan` VALUES (38, 7, 4, 571428.57, 2285714.29, 2214285.71, '2026-03-30 01:24:31');
INSERT INTO `penyusutan` VALUES (39, 7, 5, 571428.57, 2857142.86, 1642857.14, '2026-03-30 01:24:32');
INSERT INTO `penyusutan` VALUES (40, 7, 6, 571428.57, 3428571.43, 1071428.57, '2026-03-30 01:24:32');
INSERT INTO `penyusutan` VALUES (41, 7, 7, 571428.57, 4000000.00, 500000.00, '2026-03-30 01:24:32');
INSERT INTO `penyusutan` VALUES (42, 8, 1, 150000.00, 150000.00, 200000.00, '2026-03-30 01:24:32');
INSERT INTO `penyusutan` VALUES (43, 8, 2, 150000.00, 300000.00, 50000.00, '2026-03-30 01:24:33');
INSERT INTO `penyusutan` VALUES (44, 9, 1, 662500.00, 662500.00, 5137500.00, '2026-03-30 01:24:33');
INSERT INTO `penyusutan` VALUES (45, 9, 2, 662500.00, 1325000.00, 4475000.00, '2026-03-30 01:24:33');
INSERT INTO `penyusutan` VALUES (46, 9, 3, 662500.00, 1987500.00, 3812500.00, '2026-03-30 01:24:33');
INSERT INTO `penyusutan` VALUES (47, 9, 4, 662500.00, 2650000.00, 3150000.00, '2026-03-30 01:24:34');
INSERT INTO `penyusutan` VALUES (48, 9, 5, 662500.00, 3312500.00, 2487500.00, '2026-03-30 01:24:34');
INSERT INTO `penyusutan` VALUES (49, 9, 6, 662500.00, 3975000.00, 1825000.00, '2026-03-30 01:24:34');
INSERT INTO `penyusutan` VALUES (50, 9, 7, 662500.00, 4637500.00, 1162500.00, '2026-03-30 01:24:34');
INSERT INTO `penyusutan` VALUES (51, 9, 8, 662500.00, 5300000.00, 500000.00, '2026-03-30 01:24:35');
INSERT INTO `penyusutan` VALUES (52, 10, 1, 2075000.00, 2075000.00, 7125000.00, '2026-03-30 01:24:35');
INSERT INTO `penyusutan` VALUES (53, 10, 2, 2075000.00, 4150000.00, 5050000.00, '2026-03-30 01:24:35');
INSERT INTO `penyusutan` VALUES (54, 10, 3, 2075000.00, 6225000.00, 2975000.00, '2026-03-30 01:24:35');
INSERT INTO `penyusutan` VALUES (55, 10, 4, 2075000.00, 8300000.00, 900000.00, '2026-03-30 01:24:36');
INSERT INTO `penyusutan` VALUES (56, 11, 1, 80000.00, 80000.00, 370000.00, '2026-03-30 01:24:36');
INSERT INTO `penyusutan` VALUES (57, 11, 2, 80000.00, 160000.00, 290000.00, '2026-03-30 01:24:36');
INSERT INTO `penyusutan` VALUES (58, 11, 3, 80000.00, 240000.00, 210000.00, '2026-03-30 01:24:36');
INSERT INTO `penyusutan` VALUES (59, 11, 4, 80000.00, 320000.00, 130000.00, '2026-03-30 01:24:37');
INSERT INTO `penyusutan` VALUES (60, 11, 5, 80000.00, 400000.00, 50000.00, '2026-03-30 01:24:37');
INSERT INTO `penyusutan` VALUES (61, 12, 1, 320000.00, 320000.00, 1480000.00, '2026-03-30 01:24:37');
INSERT INTO `penyusutan` VALUES (62, 12, 2, 320000.00, 640000.00, 1160000.00, '2026-03-30 01:24:37');
INSERT INTO `penyusutan` VALUES (63, 12, 3, 320000.00, 960000.00, 840000.00, '2026-03-30 01:24:38');
INSERT INTO `penyusutan` VALUES (64, 12, 4, 320000.00, 1280000.00, 520000.00, '2026-03-30 01:24:38');
INSERT INTO `penyusutan` VALUES (65, 12, 5, 320000.00, 1600000.00, 200000.00, '2026-03-30 01:24:38');
INSERT INTO `penyusutan` VALUES (66, 13, 1, 60000.00, 60000.00, 590000.00, '2026-03-30 01:24:39');
INSERT INTO `penyusutan` VALUES (67, 13, 2, 60000.00, 120000.00, 530000.00, '2026-03-30 01:24:39');
INSERT INTO `penyusutan` VALUES (68, 13, 3, 60000.00, 180000.00, 470000.00, '2026-03-30 01:24:39');
INSERT INTO `penyusutan` VALUES (69, 13, 4, 60000.00, 240000.00, 410000.00, '2026-03-30 01:24:39');
INSERT INTO `penyusutan` VALUES (70, 13, 5, 60000.00, 300000.00, 350000.00, '2026-03-30 01:24:39');
INSERT INTO `penyusutan` VALUES (71, 13, 6, 60000.00, 360000.00, 290000.00, '2026-03-30 01:24:40');
INSERT INTO `penyusutan` VALUES (72, 13, 7, 60000.00, 420000.00, 230000.00, '2026-03-30 01:24:40');
INSERT INTO `penyusutan` VALUES (73, 14, 1, 150000.00, 150000.00, 700000.00, '2026-03-30 01:25:14');
INSERT INTO `penyusutan` VALUES (74, 14, 2, 150000.00, 300000.00, 550000.00, '2026-03-30 01:25:14');
INSERT INTO `penyusutan` VALUES (75, 14, 3, 150000.00, 450000.00, 400000.00, '2026-03-30 01:25:14');
INSERT INTO `penyusutan` VALUES (76, 14, 4, 150000.00, 600000.00, 250000.00, '2026-03-30 01:25:15');
INSERT INTO `penyusutan` VALUES (77, 14, 5, 150000.00, 750000.00, 100000.00, '2026-03-30 01:25:15');
INSERT INTO `penyusutan` VALUES (78, 15, 1, 6300000.00, 6300000.00, 28700000.00, '2026-03-30 01:25:15');
INSERT INTO `penyusutan` VALUES (79, 15, 2, 6300000.00, 12600000.00, 22400000.00, '2026-03-30 01:25:16');
INSERT INTO `penyusutan` VALUES (80, 15, 3, 6300000.00, 18900000.00, 16100000.00, '2026-03-30 01:25:16');
INSERT INTO `penyusutan` VALUES (81, 15, 4, 6300000.00, 25200000.00, 9800000.00, '2026-03-30 01:25:16');
INSERT INTO `penyusutan` VALUES (82, 15, 5, 6300000.00, 31500000.00, 3500000.00, '2026-03-30 01:25:16');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `role` enum('admin','petugas','kepsek') NULL DEFAULT 'petugas',
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '$2b$10$qBTqC.du2d43fd5TzwtSk.6jGbNnNLVVsWM4ykUECs/TjmrRTrG2C', 'Administrator', 'admin', 1, '2026-03-30 00:41:16', '2026-03-30 01:17:06');
INSERT INTO `users` VALUES (2, 'petugas1', '$2b$10$m.BrpntXPOSd3ZRnwf6WH.eUnPGz.p92dwrIsHshPDbxEsP6qUQeW', 'Ahmad Fauzi', 'petugas', 1, '2026-03-30 01:24:11', '2026-03-30 01:39:27');
INSERT INTO `users` VALUES (3, 'petugas2', '$2b$10$lbT5ciVipeFCh7GuaZCMIOqDl0rnIrTlz0zPscv.FsRjF3.AEHTrq', 'Budi Santoso', 'petugas', 1, '2026-03-30 01:24:11', '2026-03-30 01:39:35');
INSERT INTO `users` VALUES (4, 'kepsek', '$2b$10$DyhqjQLiJbEdnFgDMngdbeG1ybfcp6IB2GvhZwQmaAwLbRz/BNIZW', 'Dra. Hj. Nurlela, M.Pd', 'kepsek', 1, '2026-03-30 01:24:11', '2026-03-30 01:39:50');

SET FOREIGN_KEY_CHECKS = 1;
