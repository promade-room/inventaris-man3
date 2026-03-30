const router = require('express').Router()
const auth = require('../middleware/auth')
const ctrl = require('../controllers/laporan.controller')
const { exportAset, exportPenyusutan, exportMonitoring } = require('../utils/exportExcel')
const { exportAsetPdf, exportPenyusutanPdf, exportMonitoringPdf } = require('../utils/exportPdf')
const db = require('../config/db')

router.use(auth)

router.get('/aset', ctrl.aset)
router.get('/penyusutan', ctrl.penyusutan)
router.get('/monitoring', ctrl.monitoring)

// Export endpoints
router.get('/export/aset', async (req, res) => {
  try {
    let query = `SELECT a.kode_aset, a.nama_aset, k.nama_kategori, l.nama_lokasi, a.harga_perolehan, a.status_aset
                 FROM aset a LEFT JOIN kategori k ON a.id_kategori = k.id LEFT JOIN lokasi l ON a.id_lokasi = l.id WHERE 1=1`
    const params = []
    if (req.query.kategori) { query += ' AND a.id_kategori = ?'; params.push(req.query.kategori) }
    query += ' ORDER BY a.nama_aset'
    const [rows] = await db.query(query, params)
    if (req.query.format === 'xlsx') return exportAset(res, rows)
    if (req.query.format === 'pdf') return exportAsetPdf(res, rows)
    res.json({ success: true, data: rows })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.get('/export/penyusutan', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.kode_aset, a.nama_aset, a.harga_perolehan,
             ROUND((a.harga_perolehan - a.nilai_residu) / a.umur_ekonomis, 2) AS penyusutan_tahunan,
             COALESCE(p.nilai_buku, a.harga_perolehan) AS nilai_buku
      FROM aset a LEFT JOIN penyusutan p ON a.id = p.id_aset AND p.tahun_ke = a.umur_ekonomis
      WHERE a.status_aset = 'aktif' ORDER BY a.nama_aset
    `)
    if (req.query.format === 'xlsx') return exportPenyusutan(res, rows)
    if (req.query.format === 'pdf') return exportPenyusutanPdf(res, rows)
    res.json({ success: true, data: rows })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.get('/export/monitoring', async (req, res) => {
  try {
    let query = `SELECT a.nama_aset, a.kode_aset, m.tgl_cek, m.kondisi, m.keterangan
                 FROM monitoring m LEFT JOIN aset a ON m.id_aset = a.id WHERE 1=1`
    const params = []
    if (req.query.kondisi) { query += ' AND m.kondisi = ?'; params.push(req.query.kondisi) }
    query += ' ORDER BY m.tgl_cek DESC'
    const [rows] = await db.query(query, params)
    if (req.query.format === 'xlsx') return exportMonitoring(res, rows)
    if (req.query.format === 'pdf') return exportMonitoringPdf(res, rows)
    res.json({ success: true, data: rows })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

module.exports = router
