const express = require("express");
const router = express.Router();

const Game = require("../models/game.model")(); // note we need to call the model caching function

const CrudController = require("../controllers/crud");

const GameCrudController = new CrudController(Game);
const GameController = require("../controllers/game.controller");

// create a game
router.post("/", GameCrudController.create);

// get all games
router.get("/", GameCrudController.getAll);

// get a game
router.get("/:id", GameCrudController.getOne);

// update a game
router.put("/:id", GameCrudController.update);

// remove a game
router.delete("/:id", GameCrudController.delete);

// purchase a game (not entirely restful *blush*)
//router.post('/:id/purchase', GameController.purchase)

module.exports = router;
