const router = require('express').Router()
const auth = require('../middleware/auth')
const ctrl = require('../controllers/penyusutan.controller')

router.use(auth)
router.get('/', ctrl.list)
router.get('/:id', ctrl.detail)
router.post('/hitung/:id', ctrl.hitung)

module.exports = router
