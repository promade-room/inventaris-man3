const db = require('../config/db')

exports.stats = async (req, res) => {
  try {
    // Total aset
    const [totalRows] = await db.query("SELECT COUNT(*) AS total FROM aset WHERE status_aset = 'aktif'")
    const totalAset = totalRows[0].total

    // Total nilai buku
    const [nilaiRows] = await db.query(`
      SELECT COALESCE(SUM(p.nilai_buku), 0) AS total_nilai 
      FROM aset a 
      LEFT JOIN penyusutan p ON a.id = p.id_aset 
      WHERE p.tahun_ke = a.umur_ekonomis AND a.status_aset = 'aktif'
    `)
    // Fallback: if no penyusutan yet, sum harga_perolehan
    let totalNilaiBuku = Number(nilaiRows[0].total_nilai)
    if (totalNilaiBuku === 0) {
      const [hpRows] = await db.query("SELECT COALESCE(SUM(harga_perolehan), 0) AS total FROM aset WHERE status_aset = 'aktif'")
      totalNilaiBuku = Number(hpRows[0].total)
    }

    // Total penyusutan this year (approximate: total akumulasi for latest year)
    const [penRows] = await db.query(`
      SELECT COALESCE(SUM(p.akumulasi_penyusutan), 0) AS total_penyusutan 
      FROM penyusutan p 
      INNER JOIN aset a ON p.id_aset = a.id 
      WHERE a.status_aset = 'aktif'
    `)
    const totalPenyusutan = Number(penRows[0].total_penyusutan)

    // Aset rusak
    const [rusakRows] = await db.query(`
      SELECT COUNT(*) AS total FROM aset a 
      WHERE a.status_aset = 'aktif' AND a.id IN (
        SELECT id_aset FROM monitoring WHERE kondisi IN ('rusak_ringan','rusak_berat')
        GROUP BY id_aset HAVING MAX(tgl_cek)
      )
    `)

    // Kategori chart
    const [kategoriChart] = await db.query(`
      SELECT k.nama_kategori, COUNT(a.id) AS jumlah 
      FROM kategori k 
      LEFT JOIN aset a ON k.id = a.id_kategori AND a.status_aset = 'aktif'
      GROUP BY k.id, k.nama_kategori 
      HAVING jumlah > 0
    `)

    // Recent aset
    const [recentAset] = await db.query(`
      SELECT id, kode_aset, nama_aset, status_aset 
      FROM aset ORDER BY created_at DESC LIMIT 5
    `)

    // Recent monitoring
    const [recentMonitoring] = await db.query(`
      SELECT m.id, m.tgl_cek, m.kondisi, a.nama_aset 
      FROM monitoring m 
      LEFT JOIN aset a ON m.id_aset = a.id 
      ORDER BY m.created_at DESC LIMIT 5
    `)

    res.json({
      success: true,
      data: {
        totalAset,
        totalNilaiBuku,
        totalPenyusutan,
        asetRusak: rusakRows[0].total,
        kategoriChart,
        recentAset,
        recentMonitoring,
        penyusutanChart: [] // can be populated later
      }
    })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
