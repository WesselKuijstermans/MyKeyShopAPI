const express = require("express");
const router = express.Router();
const Key = require("../models/key.model")();

const keyController = require("../controllers/key.controller");
const crudController = require("../controllers/crud");
const keyCrudController = new crudController(Key);

// create a new key
router.post("/game/:id/key", keyCrudController.create);

router.get("/key", keyCrudController.getAll);

module.exports = router;
