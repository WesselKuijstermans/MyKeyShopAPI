const express = require('express')
const router = express.Router()

const orderController = require('../controllers/order.controller')

// maybe better with query params, wink wink, hint hint

router.get('/user/:id/orders/simple', orderController.simple)

router.get('/user/:id/orders/similar', orderController.similar)

router.get('/user/:id/orders/keyed', orderController.keyed)

module.exports = router