const db = require('../config/db')

exports.list = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, a.nama_aset, a.kode_aset, u.nama_lengkap AS nama_petugas
      FROM monitoring m
      LEFT JOIN aset a ON m.id_aset = a.id
      LEFT JOIN users u ON m.id_user = u.id
      ORDER BY m.created_at DESC
    `)
    res.json({ success: true, data: rows })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.create = async (req, res) => {
  try {
    const { id_aset, tgl_cek, kondisi, keterangan } = req.body
    if (!id_aset || !tgl_cek || !kondisi) {
      return res.status(400).json({ success: false, message: 'Aset, tanggal cek, dan kondisi wajib diisi' })
    }
    const [result] = await db.query(
      'INSERT INTO monitoring (id_aset, tgl_cek, kondisi, keterangan, id_user) VALUES (?, ?, ?, ?, ?)',
      [id_aset, tgl_cek, kondisi, keterangan || null, req.user.id]
    )
    res.status(201).json({ success: true, data: { id: result.insertId } })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM monitoring WHERE id = ?', [req.params.id])
    res.json({ success: true, message: 'Data monitoring dihapus' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
