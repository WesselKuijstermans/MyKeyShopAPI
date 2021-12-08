const User = require('../models/user.model')() // note we need to call the model caching function
const game = require('../models/game.model')() // note we need to call the model caching function

const neo = require('../../neo')
const errors = require('../errors')

async function create(req, res) {
    const user = await User.findOne({name: req.body.user})

    if (!user) {
        res.status(400).end()
        throw errors.EntityNotFoundError(`User with name '${req.body.user}' not found`)
    }

    const key = {
        rating: req.body.rating,
        text: req.body.text,
        user: user._id,
    }

    const game = await game.findById(req.params.id)
    
    // maybe not necessary any more now that we store it in neo?
    // BEWARE: atomicity issues!
    game.keys.push(key)
    await game.save()

    const session = neo.session()

    await session.run(neo.key, {
        userId: user._id.toString(),
        gameId: game._id.toString(),
        rating: key.rating,
    })

    res.status(201).end()
}

module.exports = {
    create,
}