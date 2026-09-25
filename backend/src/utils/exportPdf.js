const PDFDocument = require('pdfkit')

function createPdfStream(res, title) {
  const doc = new PDFDocument({ size: 'A4', margin: 40 })
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename=${title}.pdf`)
  doc.pipe(res)
  return doc
}

function drawHeader(doc, title, periodeText) {
  doc.fontSize(16).font('Helvetica-Bold').text('Inventaris MAN 3 Palembang', { align: 'center' })
  doc.moveDown(0.3)
  doc.fontSize(10).font('Helvetica').text(`Laporan: ${title}`, { align: 'center' })
  doc.moveDown(0.2)
  if (periodeText) {
    doc.fontSize(8.5).font('Helvetica-Oblique').text(`Periode: ${periodeText}`, { align: 'center' })
    doc.moveDown(0.2)
  }
  doc.fontSize(8).font('Helvetica').text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, { align: 'center' })
  doc.moveDown(0.5)
  doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke()
  doc.moveDown(0.5)
}

function drawTable(doc, headers, rows, colWidths) {
  const startX = 40
  let y = doc.y
  const rowHeight = 18
  const pageHeight = 800

  // Header
  doc.fontSize(8).font('Helvetica-Bold')
  let x = startX
  headers.forEach((h, i) => {
    doc.text(h, x, y, { width: colWidths[i], continued: false })
    x += colWidths[i]
  })
  y += rowHeight
  doc.moveTo(startX, y - 2).lineTo(startX + colWidths.reduce((a, b) => a + b, 0), y - 2).stroke()

  // Rows
  doc.font('Helvetica').fontSize(7)
  rows.forEach((row, ri) => {
    if (y > pageHeight) {
      doc.addPage()
      y = 40
    }
    x = startX
    const maxH = rowHeight
    row.forEach((cell, ci) => {
      doc.text(String(cell || '-'), x, y, { width: colWidths[ci] })
      x += colWidths[ci]
    })
    y += maxH
  })

  doc.y = y
}

function exportAsetPdf(res, data, periodeText) {
  const doc = createPdfStream(res, 'data-aset')
  drawHeader(doc, 'Data Aset', periodeText)
  const headers = ['No', 'Kode', 'Nama Aset', 'Kategori', 'Lokasi', 'Harga', 'Status']
  const colWidths = [25, 60, 120, 80, 80, 90, 60]
  const rows = data.map((r, i) => [
    i + 1, r.kode_aset, r.nama_aset, r.nama_kategori, r.nama_lokasi,
    formatRp(r.harga_perolehan), r.status_aset
  ])
  drawTable(doc, headers, rows, colWidths)
  doc.end()
}

function exportPenyusutanPdf(res, data, periodeText) {
  const doc = createPdfStream(res, 'laporan-penyusutan')
  drawHeader(doc, 'Laporan Penyusutan Aset', periodeText)
  const headers = ['No', 'Kode', 'Nama Aset', 'Harga Perolehan', 'Penyusutan/Thn', 'Nilai Buku']
  const colWidths = [25, 55, 130, 100, 100, 100]
  const rows = data.map((r, i) => [
    i + 1, r.kode_aset, r.nama_aset,
    formatRp(r.harga_perolehan), formatRp(r.penyusutan_tahunan), formatRp(r.nilai_buku)
  ])
  drawTable(doc, headers, rows, colWidths)
  doc.end()
}

function exportMonitoringPdf(res, data, periodeText) {
  const doc = createPdfStream(res, 'laporan-monitoring')
  drawHeader(doc, 'Laporan Monitoring Aset', periodeText)
  const headers = ['No', 'Nama Aset', 'Kode', 'Tanggal Cek', 'Kondisi', 'Keterangan']
  const colWidths = [25, 120, 60, 80, 80, 140]
  const rows = data.map((r, i) => [
    i + 1, r.nama_aset, r.kode_aset,
    r.tgl_cek ? new Date(r.tgl_cek).toLocaleDateString('id-ID') : '-',
    r.kondisi, r.keterangan
  ])
  drawTable(doc, headers, rows, colWidths)
  doc.end()
}

function formatRp(v) {
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(v || 0)
}

module.exports = { exportAsetPdf, exportPenyusutanPdf, exportMonitoringPdf }
