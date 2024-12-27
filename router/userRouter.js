const express = require('express')
const user = require("../controllers/userController")
const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/signup', user.signup)
router.post('/login', user.login)
router.get('/logout', auth, user.logout)

module.exports = router