const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const getModel = require("./model_cache");

const OrderSchema = new Schema({
  // a order needs to have a name
  buyer: {
    type: Schema.Types.ObjectId,
    required: [true, "A buyer needs to be attached to an order."],
    ref: "user",
  },
  products: [
    {
      games: {
        type: Schema.Types.ObjectId,
        ref: "game",
      },
      hardware: {
        type: Schema.Types.ObjectId,
        ref: "hardware",
      },
    },
  ],
  totalPrice: {
    type: Number,
    validate: {
      validator: (val) => val > 0,
      message: "An order needs to have a price",
    },
  },
});

OrderSchema.post("validate", function (req, res, next) {
  if (this.products.length == 0) throw "An order needs at least one product";
  next();
});

module.exports = getModel("order", OrderSchema);
