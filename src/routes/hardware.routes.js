const express = require('express')
const router = express.Router()

const Hardware = require('../models/hardware.model')() // note we need to call the model caching function

const CrudController = require('../controllers/crud')

const HardwareCrudController = new CrudController(Hardware)
const HardwareController = require('../controllers/hardware.controller')


// create a hardware
router.post('/', HardwareCrudController.create)

// get all hardwares
router.get('/', HardwareCrudController.getAll)

// get a hardware
router.get('/:id', HardwareCrudController.getOne)

// update a hardware
router.put('/:id', HardwareCrudController.update)

// remove a hardware
router.delete('/:id', HardwareCrudController.delete)

// purchase a hardware (not entirely restful *blush*)
// router.post('/:id/purchase', HardwareController.purchase)

module.exports = router
