const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define a schema for keys
const KeySchema = new Schema({
    text: String,

    // a rating can only be a number from 1 to 5, use a
    // validator to make sure
    rating: {
        type: Number,
        required: [true, 'A rating is required.'],
        validate: {
            validator: (rating) => {
                return Number.isInteger(rating) && 0 <= rating && rating <= 5;
            },
            message: 'A rating can only be 1, 2, 3, 4 or 5 stars.'
        }
    },

    // every key needs a user associated with it
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'A user needs to be attached to a key.'],
        ref: 'user'
    }
});

// export the key schema
module.exports = KeySchema;