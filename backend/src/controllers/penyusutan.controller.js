const db = require('../config/db')

// List all asets with current depreciation summary
exports.list = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.id AS id_aset,
        a.kode_aset,
        a.nama_aset,
        a.harga_perolehan,
        a.nilai_residu,
        a.umur_ekonomis,
        ROUND((a.harga_perolehan - a.nilai_residu) / a.umur_ekonomis, 2) AS penyusutan_tahunan,
        COALESCE(p.nilai_buku, a.harga_perolehan) AS nilai_buku
      FROM aset a
      LEFT JOIN (
        SELECT id_aset, nilai_buku
        FROM penyusutan p1
        WHERE p1.tahun_ke = (
          SELECT MAX(p2.tahun_ke) FROM penyusutan p2 WHERE p2.id_aset = p1.id_aset
        )
      ) p ON a.id = p.id_aset
      WHERE a.status_aset = 'aktif'
      ORDER BY a.nama_aset
    `)
    res.json({ success: true, data: rows })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// Detail penyusutan for specific aset
exports.detail = async (req, res) => {
  try {
    const [asetRows] = await db.query('SELECT * FROM aset WHERE id = ?', [req.params.id])
    if (!asetRows.length) return res.status(404).json({ success: false, message: 'Aset tidak ditemukan' })
    const [penyusutanRows] = await db.query('SELECT * FROM penyusutan WHERE id_aset = ? ORDER BY tahun_ke', [req.params.id])
    res.json({ success: true, data: { aset: asetRows[0], penyusutan: penyusutanRows } })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// Hitung ulang penyusutan (manual trigger)
exports.hitung = async (req, res) => {
  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()
    const asetId = req.params.id
    const [asetRows] = await conn.query('SELECT * FROM aset WHERE id = ?', [asetId])
    if (!asetRows.length) return res.status(404).json({ success: false, message: 'Aset tidak ditemukan' })

    const aset = asetRows[0]
    await conn.query('DELETE FROM penyusutan WHERE id_aset = ?', [asetId])

    const bebanTahunan = (Number(aset.harga_perolehan) - Number(aset.nilai_residu)) / Number(aset.umur_ekonomis)
    for (let t = 1; t <= Number(aset.umur_ekonomis); t++) {
      const akumulasi = bebanTahunan * t
      const nilaiBuku = Number(aset.harga_perolehan) - akumulasi
      await conn.query(
        'INSERT INTO penyusutan (id_aset, tahun_ke, beban_penyusutan, akumulasi_penyusutan, nilai_buku) VALUES (?, ?, ?, ?, ?)',
        [asetId, t, bebanTahunan, akumulasi, Math.max(nilaiBuku, Number(aset.nilai_residu))]
      )
    }

    await conn.commit()
    res.json({ success: true, message: 'Penyusutan berhasil dihitung ulang' })
  } catch (err) {
    await conn.rollback()
    res.status(500).json({ success: false, message: err.message })
  } finally {
    conn.release()
  }
}
