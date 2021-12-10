const express = require("express");
const router = express.Router();
const User = require("../models/user.model")()

const authController = require("../controllers/authentication.controller");
const authControllerClass = new authController(User);

// registrate a user
router.post("/register", authControllerClass.register);

// log into a user
router.post("/login", authControllerClass.login);

module.exports = router