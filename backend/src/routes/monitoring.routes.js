const router = require('express').Router()
const auth = require('../middleware/auth')
const ctrl = require('../controllers/monitoring.controller')

router.use(auth)
router.get('/', ctrl.list)
router.post('/', ctrl.create)
router.delete('/:id', ctrl.remove)

module.exports = router
