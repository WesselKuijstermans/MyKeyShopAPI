const chai = require('chai')
const expect = chai.expect

const requester = require('../requester.spec')


describe('user journeys', function() {
    it('create game; create user; user buys game; user leaves key', async function() {
        let res

        const testgame = {
            name: 'Camera X120',
            description: 'A cool camera',
            price: 259
        }
        res = await requester.post('/game').send(testgame)
        expect(res).to.have.status(201)
        testgame.id = res.body.id

        const testUser = {name: 'Joe'}

        res = await requester.post('/user').send(testUser)
        expect(res).to.have.status(201)
        testUser.id = res.body.id

        res = await requester.post(`/game/${testgame.id}/purchase`).send({user: testUser.name})
        expect(res).to.have.status(201)

        const testKey = {
            user: testUser.name,
            rating: 3,
            text: 'Pretty average camera'
        }
        res = await requester.post(`/game/${testgame.id}/key`).send(testKey)
        expect(res).to.have.status(201)

        res = await requester.get(`/game/${testgame.id}`)
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('name', testgame.name)
        expect(res.body).to.have.property('description', testgame.description)
        expect(res.body).to.have.property('price', testgame.price)
        expect(res.body).to.have.property('keys').and.to.have.length(1)
        const gameKey = res.body.keys[0]
        expect(gameKey).to.have.property('rating', testKey.rating)
        expect(gameKey).to.have.property('text', testKey.text)
        expect(gameKey.user.toString()).to.equal(testUser.id)

        res = await requester.get(`/user/${testUser.id}`)
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('name', testUser.name)
        expect(res.body).to.have.property('bought').and.to.be.length(1)
        const userKey = res.body.bought[0]
        expect(userKey).to.have.property('name', testgame.name)
        expect(userKey).to.have.property('description', testgame.description)
        expect(userKey).to.have.property('price', testgame.price)
    })
})