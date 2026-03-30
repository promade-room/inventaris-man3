const db = require('../config/db')

exports.aset = async (req, res) => {
  try {
    let query = `SELECT a.kode_aset, a.nama_aset, k.nama_kategori, l.nama_lokasi, a.harga_perolehan, a.status_aset
                 FROM aset a LEFT JOIN kategori k ON a.id_kategori = k.id LEFT JOIN lokasi l ON a.id_lokasi = l.id WHERE 1=1`
    const params = []
    if (req.query.kategori) { query += ' AND a.id_kategori = ?'; params.push(req.query.kategori) }
    query += ' ORDER BY a.nama_aset'
    const [rows] = await db.query(query, params)
    res.json({ success: true, data: rows })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.penyusutan = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.kode_aset, a.nama_aset, a.harga_perolehan,
             ROUND((a.harga_perolehan - a.nilai_residu) / a.umur_ekonomis, 2) AS penyusutan_tahunan,
             COALESCE(p.nilai_buku, a.harga_perolehan) AS nilai_buku
      FROM aset a
      LEFT JOIN penyusutan p ON a.id = p.id_aset AND p.tahun_ke = a.umur_ekonomis
      WHERE a.status_aset = 'aktif'
      ORDER BY a.nama_aset
    `)
    res.json({ success: true, data: rows })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.monitoring = async (req, res) => {
  try {
    let query = `SELECT a.nama_aset, a.kode_aset, m.tgl_cek, m.kondisi, m.keterangan
                 FROM monitoring m LEFT JOIN aset a ON m.id_aset = a.id WHERE 1=1`
    const params = []
    if (req.query.kondisi) { query += ' AND m.kondisi = ?'; params.push(req.query.kondisi) }
    if (req.query.periode_awal) { query += ' AND m.tgl_cek >= ?'; params.push(req.query.periode_awal) }
    if (req.query.periode_akhir) { query += ' AND m.tgl_cek <= ?'; params.push(req.query.periode_akhir) }
    query += ' ORDER BY m.tgl_cek DESC'
    const [rows] = await db.query(query, params)
    res.json({ success: true, data: rows })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
