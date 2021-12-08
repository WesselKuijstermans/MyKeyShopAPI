const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const getModel = require('./model_cache')

// we use the key schema in the game schema
const KeySchema = require('./key.schema');

// define the game schema
const GameSchema = new Schema({
    title: {
        type: String,
        required: [true, 'A game needs a name.']
    },
    description: String,
    price: {
        type: Number,
        required: [true, 'A game needs a price.'],
        validate: {
            validator: (price) => price >= 0,
            message: 'A price needs to be positive.'
        }
    },
    keys: {
        type: [KeySchema],
        default: []
    }
}, {
    // include virtuals when serializing the schema to an object or JSON
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
});

// the rating of the game is a virtual type
// note: use an anonymous function and not a lambda here!
// otherwise 'this' does not refer to the correct object
GameSchema.virtual('rating').get(function () {
    // if there are no keys we give back a message
    if(this.keys.length === 0) {
        return "no rating"
    } else {
        // computes the average rating
        let sum = 0
        for(let key of this.keys) {
            sum += key.rating
        }
        return sum / this.keys.length
    }
})

// export the game model through a caching function
module.exports = getModel('game', GameSchema)