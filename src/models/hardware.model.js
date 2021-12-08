const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const getModel = require('./model_cache')

// define the hardware schema
const HardwareSchema = new Schema({
    title: {
        type: String,
        required: [true, 'A piece of hardware needs a name.']
    },
    description: String,
    price: {
        type: Number,
        required: [true, 'A piece of hardware needs a price.'],
        validate: {
            validator: (price) => price >= 0,
            message: 'A price needs to be positive.'
        }
    },
}, {
    // include virtuals when serializing the schema to an object or JSON
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
});

// export the hardware model through a caching function
module.exports = getModel('hardware', HardwareSchema)