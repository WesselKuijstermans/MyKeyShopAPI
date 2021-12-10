const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const getModel = require("./model_cache");

const UserSchema = new Schema({
  // a user needs to have a name
  name: {
    type: String,
    required: [true, "A user needs to have a name."],
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    unique: [true, "A user needs to have a unique name"],
    required: true,
    validate: {
      validator: (email) => {
        const regex =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email.match(regex);
      },
    },
  },
  password: {
    type: String,
    required: [true],
  },
});

module.exports = getModel("User", UserSchema);
