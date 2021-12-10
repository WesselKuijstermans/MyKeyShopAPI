const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const getModel = require("./model_cache");

// define a schema for keys
const KeySchema = new Schema({
  redeemCode: String,
  redeemed: Boolean,
  price: {
    type: Number,
    required: [true, "A game needs a price."],
    validate: {
      validator: (price) => price >= 0,
      message: "A price needs to be positive.",
    },
  },
  // every key needs a user associated with it
  seller: {
    type: Schema.Types.ObjectId,
    required: [true, "A user needs to be attached to a key."],
    ref: "user",
  },
});

// export the key schema
module.exports = getModel("key", KeySchema);
