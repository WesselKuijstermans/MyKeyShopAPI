const express = require('express')
const router = express.Router()

const keyController = require('../controllers/key.controller')


// create a new key
router.post('/game/:id/key', keyController.create)


module.exports = router