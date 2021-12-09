const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const getModel = require("./model_cache");

const UserSchema = new Schema({
  // a user needs to have a name
  name: {
    firstname: {
      type: String,
      required: [true, "A user needs to have a first name."],
    },
    lastname: {
      type: String,
      required: [true, "A user needs to have a last name."],
    },
  },
  email: {
    type: String,
    required: [true, "A user needs to have an Email adress"],
    unique: [true, "A user needs to have a unique Email adress"],
    validate: {
      validator: (email) => {
        const regex =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email.match(regex);
      },
    },
  },
  gender: {
    type: String,
    required: [true, "A user needs to have a gender"],
    validate: {
      validator: (gender) => {
        return gender == "Male" || gender == "Female";
      },
    },
  },
});



// mongoose plugin to always populate fields
// UserSchema.plugin(require('mongoose-autopopulate'));

// when a user is deleted all their keys need to be deleted
// note: use an anonymous function and not a fat arrow function here!
// otherwise 'this' does not refer to the correct object
// use 'next' to indicate that mongoose can go to the next middleware

// UserSchema.pre('remove', function (next) {
//     // include the game model here to avoid cyclic inclusion
//     const game = mongoose.model('game')

//     // don't iterate here! we want to use mongo operators!
//     // this makes sure the code executes inside mongo
//     game.updateMany({}, { $pull: { 'keys': { 'user': this._id } } })
//         .then(() => next())
// })

// export the user model through a caching function
module.exports = getModel("User", UserSchema);
