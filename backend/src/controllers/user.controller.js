const bcrypt = require('bcryptjs')
const db = require('../config/db')

exports.list = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, nama_lengkap, role, is_active, created_at FROM users ORDER BY id DESC')
    res.json({ success: true, data: rows })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.create = async (req, res) => {
  try {
    const { username, password, nama_lengkap, role } = req.body
    if (!username || !password || !nama_lengkap) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi' })
    }
    const hash = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      'INSERT INTO users (username, password, nama_lengkap, role) VALUES (?, ?, ?, ?)',
      [username, hash, nama_lengkap, role || 'petugas']
    )
    res.status(201).json({ success: true, data: { id: result.insertId } })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.update = async (req, res) => {
  try {
    const { username, password, nama_lengkap, role } = req.body
    let query = 'UPDATE users SET username = ?, nama_lengkap = ?, role = ?'
    let params = [username, nama_lengkap, role]
    if (password) {
      const hash = await bcrypt.hash(password, 10)
      query += ', password = ?'
      params.push(hash)
    }
    query += ' WHERE id = ?'
    params.push(req.params.id)
    await db.query(query, params)
    res.json({ success: true, message: 'Pengguna diperbarui' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.remove = async (req, res) => {
  try {
    await db.query('UPDATE users SET is_active = 0 WHERE id = ?', [req.params.id])
    res.json({ success: true, message: 'Pengguna dinonaktifkan' })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
