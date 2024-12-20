const express = require('express')
const authorized = require('../controllers/authorizedController')

const router = express.Router()

router.get('/index', authorized.index)
router.get('/logout', authorized.logout)
router.get('/taskComplete', authorized.completeTask)
router.get('/taskDelete', authorized.deleteTask)
router.post('/taskCreate', authorized.createTask)

module.exports = router