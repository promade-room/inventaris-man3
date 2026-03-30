const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/db')

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' })
    }
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND is_active = 1', [username])
    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' })
    }
    const user = rows[0]
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' })
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, nama_lengkap: user.nama_lengkap },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )
    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, username: user.username, nama_lengkap: user.nama_lengkap, role: user.role }
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.me = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, nama_lengkap, role FROM users WHERE id = ?', [req.user.id])
    if (!rows.length) return res.status(404).json({ success: false, message: 'User tidak ditemukan' })
    res.json({ success: true, data: rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
