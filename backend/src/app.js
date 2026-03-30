require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/users', require('./routes/user.routes'))
app.use('/api/kategori', require('./routes/kategori.routes'))
app.use('/api/lokasi', require('./routes/lokasi.routes'))
app.use('/api/aset', require('./routes/aset.routes'))
app.use('/api/penyusutan', require('./routes/penyusutan.routes'))
app.use('/api/monitoring', require('./routes/monitoring.routes'))
app.use('/api/dashboard', require('./routes/dashboard.routes'))
app.use('/api/laporan', require('./routes/laporan.routes'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

module.exports = app
