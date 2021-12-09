const express = require("express");
const CrudController = require("../controllers/crud");
const Order = require("../models/order.model")();
const router = express.Router();

const orderCrudController = new CrudController(Order);
const orderController = require("../controllers/order.controller");

// maybe better with query params, wink wink, hint hint

router.post("/", orderCrudController.create);

router.get("/", orderCrudController.getAll);

router.get("/:id", orderCrudController.getOne);

module.exports = router;
