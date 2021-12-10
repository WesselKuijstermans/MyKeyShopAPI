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
const { json } = require("express/lib/response");

const KeyControllerHelperClass = new KeyControllerHelper(Key);
const HardwareControllerHelperClass = new HardwareControllerHelper(hardware);

const OrderSchema = new Schema(
  {
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
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

OrderSchema.virtual("TotalPrice").get(function () {
  var totalPrice = 0;
  //   this.products.gamekeys, this.products.hardware);

  if (this.products.gamekeys != undefined) {
    for (let key of this.products.gamekeys) {
      if (key != undefined) {
        const entity = await KeyControllerHelperClass.getOne(key);
        totalPrice += Number(entity.price);
      }
    }
  }
  if (this.products.hardware != undefined) {
    for (let hardware of this.products.hardware) {
      if (hardware != undefined) {
        const entity = await HardwareControllerHelperClass.getOne(hardware);
        totalPrice += Number(entity.price);
      }
    }
  }
  console.log(totalPrice);
  if (totalPrice > 0) {
    return totalPrice;
  } else {
    return res.status(400);
  }
});

OrderSchema.post("validate", function (req, res, next) {
  if (this.products.length == 0) throw "An order needs at least one product";
  next();
});

module.exports = getModel("order", OrderSchema);
