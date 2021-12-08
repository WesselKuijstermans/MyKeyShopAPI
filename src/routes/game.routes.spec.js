const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const game = require('../models/game.model')() // note we need to call the model caching function

describe('game endpoints', function() {
    describe('integration tests', function() {
        it('(POST /game) should create a game', async function() {
            const testgame = {
                name: 'Camera X120',
                description: 'A cool camera',
                price: 259
            }

            const res = await requester.post('/game').send(testgame)

            expect(res).to.have.status(201)
            expect(res.body).to.have.property('id')
    
            const game = await game.findOne({name: testgame.name})
            expect(game).to.have.property('name', testgame.name)
            expect(game).to.have.property('description', testgame.description)
            expect(game).to.have.property('price', testgame.price)
            expect(game).to.have.property('keys').and.to.be.empty
        })

        it('(POST /game) should create a game with a promise chain', function() {
            const testgame = {
                name: 'Camera X120',
                description: 'A cool camera',
                price: 259
            }

            return requester
                .post('/game')
                .send(testgame)
                .then(res => {
                    expect(res).to.have.status(201)
                    expect(res.body).to.have.property('id')
                    return game.findOne({name: testgame.name})
                })
                .then(game => {
                    expect(game).to.have.property('name', testgame.name)
                    expect(game).to.have.property('description', testgame.description)
                    expect(game).to.have.property('price', testgame.price)
                    expect(game).to.have.property('keys').and.to.be.empty
                })
        })
    
        it('(POST /game) should not create a game with missing name', async function() {
            const testgame = {
                description: 'A cool camera without a name',
                price: 129,
            }
    
            const res = await requester.post('/game').send(testgame)
    
            expect(res).to.have.status(400)
    
            const count = await game.find().countDocuments()
            expect(count).to.equal(0)
        })
    })

    describe('system tests', function() {
        it('should create and retrieve a game', async function() {
            const testgame = {
                name: 'Camera X120',
                description: 'A cool camera',
                price: 259
            }

            const res1 = await requester.post('/game').send(testgame)
            expect(res1).to.have.status(201)
            expect(res1.body).to.have.property('id')

            const id = res1.body.id
            const res2 = await requester.get(`/game/${id}`)
            expect(res2).to.have.status(200)
            expect(res2.body).to.have.property('_id', id)
            expect(res2.body).to.have.property('name', testgame.name)
            expect(res2.body).to.have.property('description', testgame.description)
            expect(res2.body).to.have.property('price', testgame.price)
            expect(res2.body).to.have.property('keys').to.be.empty
        })
    })
})