import Swal from 'sweetalert2'

export function useAlert() {
  const success = (title, text) =>
    Swal.fire({ icon: 'success', title, text, timer: 2000, showConfirmButton: false })

  const error = (title, text) =>
    Swal.fire({ icon: 'error', title, text })

  const confirm = (title, text) =>
    Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#e95678',
      cancelButtonColor: '#363960'
    })

  const form = (title, html) =>
    Swal.fire({
      title,
      html,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#e95678',
      cancelButtonColor: '#363960',
      preConfirm: () => {
        const inputs = document.querySelectorAll('.swal2-html-container input, .swal2-html-container select, .swal2-html-container textarea')
        const result = {}
        inputs.forEach(el => {
          result[el.name] = el.value
        })
        return result
      }
    })

  return { success, error, confirm, form }
}
