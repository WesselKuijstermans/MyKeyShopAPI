const express = require('express')
const router = express.Router()

const game = require('../models/game.model')() // note we need to call the model caching function

const CrudController = require('../controllers/crud')

const gameCrudController = new CrudController(game)
const gameController = require('../controllers/game.controller')


// create a game
router.post('/', gameCrudController.create)

// get all games
router.get('/', gameCrudController.getAll)

// get a game
router.get('/:id', gameCrudController.getOne)

// update a game
router.put('/:id', gameCrudController.update)

// remove a game
router.delete('/:id', gameCrudController.delete)

// purchase a game (not entirely restful *blush*)
router.post('/:id/purchase', gameController.purchase)

module.exports = router
