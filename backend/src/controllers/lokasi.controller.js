const db = require('../config/db')

exports.list = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM lokasi ORDER BY nama_lokasi')
    res.json({ success: true, data: rows })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.create = async (req, res) => {
  try {
    const { nama_lokasi, gedung, keterangan } = req.body
    if (!nama_lokasi) return res.status(400).json({ success: false, message: 'Nama lokasi wajib diisi' })
    const [result] = await db.query('INSERT INTO lokasi (nama_lokasi, gedung, keterangan) VALUES (?, ?, ?)', [nama_lokasi, gedung || null, keterangan || null])
    res.status(201).json({ success: true, data: { id: result.insertId } })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.update = async (req, res) => {
  try {
    const { nama_lokasi, gedung, keterangan } = req.body
    await db.query('UPDATE lokasi SET nama_lokasi = ?, gedung = ?, keterangan = ? WHERE id = ?', [nama_lokasi, gedung, keterangan, req.params.id])
    res.json({ success: true, message: 'Lokasi diperbarui' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM lokasi WHERE id = ?', [req.params.id])
    res.json({ success: true, message: 'Lokasi dihapus' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
