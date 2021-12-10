const neo = require('../../neo')

const order = require('../models/order.model')()

async function getOrders(query, req, res) {
    const session = neo.session()
    
    const result = await session.run(query, {
        userId: req.params.id,
    })

    // we only expect 1 row with results, containing an array of game ids in the field 'gameIds'
    // see the queries in neo.js for what is returned
    const orderIds = result.records[0].get('orderIds')
    
    session.close()
    
    const orders = await game.find({_id: {$in: orderIds}})
    
    res.status(200).json(orders)
}

async function simple(req, res) {
    await getOrders(neo.recommendSimilar, req, res)
}

async function similar(req, res) {
    await getOrders(neo.recommendSimilarTwo, req, res)
}

async function keyed(req, res) {
    await getOrders(neo.recommendKeyed, req, res)
}

module.exports = {
    simple,
    similar,
    keyed,
}