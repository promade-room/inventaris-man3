const db = require('../config/db')

exports.list = async (req, res) => {
  try {
    let query = `SELECT a.*, k.nama_kategori, l.nama_lokasi 
                 FROM aset a 
                 LEFT JOIN kategori k ON a.id_kategori = k.id 
                 LEFT JOIN lokasi l ON a.id_lokasi = l.id 
                 WHERE 1=1`
    const params = []
    if (req.query.kategori) { query += ' AND a.id_kategori = ?'; params.push(req.query.kategori) }
    if (req.query.lokasi) { query += ' AND a.id_lokasi = ?'; params.push(req.query.lokasi) }
    if (req.query.status) { query += ' AND a.status_aset = ?'; params.push(req.query.status) }
    query += ' ORDER BY a.created_at DESC'
    const [rows] = await db.query(query, params)
    res.json({ success: true, data: rows })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.detail = async (req, res) => {
  try {
    const [asetRows] = await db.query(
      `SELECT a.*, k.nama_kategori, l.nama_lokasi 
       FROM aset a 
       LEFT JOIN kategori k ON a.id_kategori = k.id 
       LEFT JOIN lokasi l ON a.id_lokasi = l.id 
       WHERE a.id = ?`, [req.params.id]
    )
    if (!asetRows.length) return res.status(404).json({ success: false, message: 'Aset tidak ditemukan' })
    const [penyusutanRows] = await db.query('SELECT * FROM penyusutan WHERE id_aset = ? ORDER BY tahun_ke', [req.params.id])
    res.json({ success: true, data: { aset: asetRows[0], penyusutan: penyusutanRows } })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.create = async (req, res) => {
  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()
    const { kode_aset, nama_aset, id_kategori, id_lokasi, tgl_perolehan, harga_perolehan, nilai_residu, umur_ekonomis } = req.body
    if (!kode_aset || !nama_aset || !id_kategori || !id_lokasi || !tgl_perolehan || !harga_perolehan || !umur_ekonomis) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi' })
    }

    const [result] = await conn.query(
      `INSERT INTO aset (kode_aset, nama_aset, id_kategori, id_lokasi, tgl_perolehan, harga_perolehan, nilai_residu, umur_ekonomis, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [kode_aset, nama_aset, id_kategori, id_lokasi, tgl_perolehan, harga_perolehan, nilai_residu || 0, umur_ekonomis, req.user.id]
    )

    // Auto-calculate depreciation
    const asetId = result.insertId
    const bebanTahunan = (Number(harga_perolehan) - Number(nilai_residu || 0)) / Number(umur_ekonomis)
    const totalTahun = Math.min(Number(umur_ekonomis), 50) // max 50 years

    for (let t = 1; t <= totalTahun; t++) {
      const akumulasi = bebanTahunan * t
      const nilaiBuku = Number(harga_perolehan) - akumulasi
      await conn.query(
        'INSERT INTO penyusutan (id_aset, tahun_ke, beban_penyusutan, akumulasi_penyusutan, nilai_buku) VALUES (?, ?, ?, ?, ?)',
        [asetId, t, bebanTahunan, akumulasi, Math.max(nilaiBuku, Number(nilai_residu || 0))]
      )
    }

    await conn.commit()
    res.status(201).json({ success: true, data: { id: asetId }, message: 'Aset ditambahkan, penyusutan otomatis dihitung' })
  } catch (err) {
    await conn.rollback()
    res.status(500).json({ success: false, message: err.message })
  } finally {
    conn.release()
  }
}

exports.update = async (req, res) => {
  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()
    const { kode_aset, nama_aset, id_kategori, id_lokasi, tgl_perolehan, harga_perolehan, nilai_residu, umur_ekonomis } = req.body
    const asetId = req.params.id

    await conn.query(
      `UPDATE aset SET kode_aset=?, nama_aset=?, id_kategori=?, id_lokasi=?, tgl_perolehan=?, harga_perolehan=?, nilai_residu=?, umur_ekonomis=? WHERE id=?`,
      [kode_aset, nama_aset, id_kategori, id_lokasi, tgl_perolehan, harga_perolehan, nilai_residu || 0, umur_ekonomis, asetId]
    )

    // Recalculate depreciation
    await conn.query('DELETE FROM penyusutan WHERE id_aset = ?', [asetId])
    const bebanTahunan = (Number(harga_perolehan) - Number(nilai_residu || 0)) / Number(umur_ekonomis)
    for (let t = 1; t <= Number(umur_ekonomis); t++) {
      const akumulasi = bebanTahunan * t
      const nilaiBuku = Number(harga_perolehan) - akumulasi
      await conn.query(
        'INSERT INTO penyusutan (id_aset, tahun_ke, beban_penyusutan, akumulasi_penyusutan, nilai_buku) VALUES (?, ?, ?, ?, ?)',
        [asetId, t, bebanTahunan, akumulasi, Math.max(nilaiBuku, Number(nilai_residu || 0))]
      )
    }

    await conn.commit()
    res.json({ success: true, message: 'Aset diperbarui, penyusutan dihitung ulang' })
  } catch (err) {
    await conn.rollback()
    res.status(500).json({ success: false, message: err.message })
  } finally {
    conn.release()
  }
}

exports.remove = async (req, res) => {
  try {
    await db.query("UPDATE aset SET status_aset = 'dihapus' WHERE id = ?", [req.params.id])
    res.json({ success: true, message: 'Aset dihapus' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
