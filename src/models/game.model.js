const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const getModel = require("./model_cache");

// we use the key schema in the game schema
const KeySchema = require("./key.model");

// define the game schema
const GameSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "A game needs a name."],
    },
    description: String,
    developer: String,
    publisher: String,
    rating: {
      type: Number,
      required: [true, "A rating is required."],
      validate: {
        validator: (rating) => {
          return 0 <= rating && rating <= 5;
        },
        message: "A rating can only be between 1 or 5 stars.",
      },
    },
    ageCategory: {
      type: String,
      required: [true, "An age category is required"],
      validate: {
        validator: (ageCategory) => {
          return (
            ageCategory == "PEGI18" ||
            ageCategory == "PEGI16" ||
            ageCategory == "PEGI12" ||
            ageCategory == "PEGI7" ||
            ageCategory == "PEGI3"
          );
        },
        message:
          "An age category must be of a correct PEGI rating. For example: 'PEGI18'.",
      },
    },
    keys: [
      {
        type: Schema.Types.ObjectId,
        ref: "key",
        default: [],
      },
    ],
  }
  //   {
  //     // include virtuals when serializing the schema to an object or JSON
  //     toObject: { virtuals: true },
  //     toJSON: { virtuals: true },
  //   }
);

// the rating of the game is a virtual type
// note: use an anonymous function and not a lambda here!
// otherwise 'this' does not refer to the correct object
// GameSchema.virtual("rating").get(function () {
//   // if there are no keys we give back a message
//   if (this.keys.length === 0) {
//     return "no rating";
//   } else {
//     // computes the average rating
//     let sum = 0;
//     for (let key of this.keys) {
//       sum += key.rating;
//     }
//     return sum / this.keys.length;
//   }
// });

// export the game model through a caching function
module.exports = getModel("game", GameSchema);
