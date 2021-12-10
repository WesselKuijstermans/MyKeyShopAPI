const mongoose = require("mongoose");
const { toObject } = require("mongoose/lib/utils");
const { virtual } = require("./key.model");
const Schema = mongoose.Schema;
const HardwareSchema = require("./hardware.model");

const getModel = require("./model_cache");
const res = require("express/lib/response");
const Game = require("./game.model");
const hardware = require("./hardware.model")();
const Key = require("./key.model")();

const KeyControllerHelper = require("../controllers/key.controller");
const HardwareControllerHelper = require("../controllers/hardware.controller");


const KeyControllerHelperClass = new KeyControllerHelper(Key);
const HardwareControllerHelperClass = new HardwareControllerHelper(hardware);

const OrderSchema = new Schema({
  // a order needs to have a name
  buyer: {
    type: Schema.Types.ObjectId,
    required: [true, "A buyer needs to be attached to an order."],
    ref: "user",
  },
  products: {
    gamekeys: [
      {
        type: Schema.Types.ObjectId,
        ref: "game",
      },
    ],
    hardware: [
      {
        type: Schema.Types.ObjectId,
        ref: "hardware",
      },
    ],
  },
  totalPrice: {
    type: Number,
    required: [true, "An order needs a price."],
    validate: {
      validator: (price) => price >= 0,
      message: "A price needs to be positive.",
    },
  },
});

OrderSchema.post("validate", function (req, res, next) {
  if (this.products.length == 0) throw "An order needs at least one product";
  next();
});

module.exports = getModel("order", OrderSchema);
