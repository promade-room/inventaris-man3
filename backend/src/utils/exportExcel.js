const ExcelJS = require('exceljs')

async function exportAset(res, data) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Data Aset')

  sheet.columns = [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Kode Aset', key: 'kode_aset', width: 15 },
    { header: 'Nama Aset', key: 'nama_aset', width: 30 },
    { header: 'Kategori', key: 'nama_kategori', width: 20 },
    { header: 'Lokasi', key: 'nama_lokasi', width: 20 },
    { header: 'Harga Perolehan', key: 'harga_perolehan', width: 20 },
    { header: 'Status', key: 'status_aset', width: 12 },
  ]

  sheet.getRow(1).font = { bold: true }
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE95678' } }
  sheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true }

  data.forEach((row, i) => {
    sheet.addRow({ no: i + 1, ...row })
  })

  sheet.getColumn('harga_perolehan').numFmt = '#,##0'

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', 'attachment; filename=laporan-aset.xlsx')
  await workbook.xlsx.write(res)
}

async function exportPenyusutan(res, data) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Laporan Penyusutan')

  sheet.columns = [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Kode Aset', key: 'kode_aset', width: 15 },
    { header: 'Nama Aset', key: 'nama_aset', width: 30 },
    { header: 'Harga Perolehan', key: 'harga_perolehan', width: 20 },
    { header: 'Penyusutan/Tahun', key: 'penyusutan_tahunan', width: 20 },
    { header: 'Nilai Buku', key: 'nilai_buku', width: 20 },
  ]

  sheet.getRow(1).font = { bold: true }
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF59E1C5' } }

  data.forEach((row, i) => {
    sheet.addRow({ no: i + 1, ...row })
  })

  ;['harga_perolehan', 'penyusutan_tahunan', 'nilai_buku'].forEach(col => {
    sheet.getColumn(col).numFmt = '#,##0'
  })

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', 'attachment; filename=laporan-penyusutan.xlsx')
  await workbook.xlsx.write(res)
}

async function exportMonitoring(res, data) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Laporan Monitoring')

  sheet.columns = [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Nama Aset', key: 'nama_aset', width: 30 },
    { header: 'Kode Aset', key: 'kode_aset', width: 15 },
    { header: 'Tanggal Cek', key: 'tgl_cek', width: 15 },
    { header: 'Kondisi', key: 'kondisi', width: 15 },
    { header: 'Keterangan', key: 'keterangan', width: 30 },
  ]

  sheet.getRow(1).font = { bold: true }
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF09F4A' } }

  data.forEach((row, i) => {
    sheet.addRow({ no: i + 1, ...row, tgl_cek: row.tgl_cek ? new Date(row.tgl_cek).toLocaleDateString('id-ID') : '' })
  })

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', 'attachment; filename=laporan-monitoring.xlsx')
  await workbook.xlsx.write(res)
}

module.exports = { exportAset, exportPenyusutan, exportMonitoring }
