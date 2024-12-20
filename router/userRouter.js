const express = require('express')
const user = require("../controllers/userController")

const router = express.Router()

router.post('/signup', user.signup)
router.post('/login', user.login)
router.get('/', user.index)

module.exports = router