const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const User = require('../models/user.model')() // note we need to call the model caching function
const game = require('../models/game.model')() // note we need to call the model caching function

describe('key endpoints', function() {
    describe('integration tests', function() {
        let testUser
        let testgame
    
        beforeEach(async function() {
            testUser = await new User({
                name: 'Joe'
            }).save()
    
            testgame = await new game({
                name: 'Camera X120',
                description: 'A cool camera',
                price: 259
            }).save()
        })
    
        it('(POST /key) should create a new key', async function() {
            const testKey = {
                rating: 3,
                text: 'Pretty average camera',
                user: testUser.name
            }

            const res = await requester.post(`/game/${testgame.id}/key`).send(testKey)
    
            expect(res).to.have.status(201)
    
            const game = await game.findById(testgame.id)
            expect(game).to.have.property('name', testgame.name)
            expect(game).to.have.property('rating', testKey.rating)
            expect(game).to.have.property('keys').of.length(1)
            const key = game.keys[0]
            expect(key).to.have.property('rating', testKey.rating)
            expect(key).to.have.property('text', testKey.text)
            expect(key).to.have.property('user')
            expect(key.user.toString()).to.equal(testUser.id.toString())
        })
    
        it('(POST /key) should not create a key with a negative rating', async function() {
            const testKey = {
                rating: -3,
                text: 'Pretty average camera',
                user: testUser.name
            }
    
            const res = await requester.post(`/game/${testgame.id}/key`).send(testKey)
    
            expect(res).to.have.status(400)
    
            const game = await game.findById(testgame.id)
            expect(game).to.have.property('name', testgame.name)
            expect(game).to.have.property('keys').and.to.be.empty
        })
    
        it('(DELETE /user/:id) should remove all keys when deleting a user', async function() {
            const testKey = {
                rating: -3,
                text: 'Pretty average camera',
                user: testUser.id
            }
    
            await game.updateOne({name: testgame.name}, {
                $push: {
                    keys: testKey
                }
            })
            const gameBefore = await game.findById(testgame.id)
            expect(gameBefore).to.have.property('keys').of.length(1)
    
            const res = await requester.delete(`/user/${testUser.id}`)
            expect(res).to.have.status(204)
    
            const gameAfter = await game.findById(testgame.id)
            expect(gameAfter).to.have.property('keys').to.be.empty
        })
    })

    describe('system tests', function() {
        // there is currently not a system test that tests only on key endpoints...
    })
})