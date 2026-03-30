const db = require('../config/db')

exports.list = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kategori ORDER BY nama_kategori')
    res.json({ success: true, data: rows })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.create = async (req, res) => {
  try {
    const { nama_kategori, keterangan } = req.body
    if (!nama_kategori) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi' })
    const [result] = await db.query('INSERT INTO kategori (nama_kategori, keterangan) VALUES (?, ?)', [nama_kategori, keterangan || null])
    res.status(201).json({ success: true, data: { id: result.insertId } })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.update = async (req, res) => {
  try {
    const { nama_kategori, keterangan } = req.body
    await db.query('UPDATE kategori SET nama_kategori = ?, keterangan = ? WHERE id = ?', [nama_kategori, keterangan, req.params.id])
    res.json({ success: true, message: 'Kategori diperbarui' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM kategori WHERE id = ?', [req.params.id])
    res.json({ success: true, message: 'Kategori dihapus' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
