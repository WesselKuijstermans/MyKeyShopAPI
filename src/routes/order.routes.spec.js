const chai = require('chai')
const expect = chai.expect

const game = require('../models/game.model')()

const requester = require('../../requester.spec')

const neo = require('../../neo')

function createQueries(id1, id2, id3, id4, id5) {
    return [
        `CREATE (:User {id:"user1"})-[:BOUGHT]->(:game {id:"${id1.toString()}"})`,
        `CREATE (:User {id:"user2"})-[:BOUGHT]->(:game {id:"${id2.toString()}"})`,
        `MATCH (u:User {id:"user1"}) MATCH (p:game {id:"${id2.toString()}"}) CREATE (u)-[:BOUGHT]->(p)`,
        `MATCH (u:User {id:"user2"}) MATCH (p:game {id:"${id1.toString()}"}) CREATE (u)-[:BOUGHT]->(p)`,
        `MATCH (u:User {id:"user2"}) MERGE (p:game {id:"${id3.toString()}"}) CREATE (u)-[:BOUGHT]->(p)`,
        `CREATE (:User {id:"user3"})-[:REVIEWED {rating:4}]->(:game {id:"${id4.toString()}"})`,
        `CREATE (:game {id:"${id5.toString()}"})`,
        `MATCH (u:User {id:"user3"}) MATCH (p:game {id:"${id5.toString()}"}) CREATE (u)-[:REVIEWED {rating:3}]->(p)`,
        `MATCH (u:User {id:"user3"}) MATCH (p:game {id:"${id2.toString()}"}) CREATE (u)-[:REVIEWED {rating: 5}]->(p)`,
        `MATCH (u:User {id:"user3"}) MATCH (p:game {id:"${id2.toString()}"}) CREATE (u)-[:BOUGHT]->(p)`,
        `MATCH (u:User {id:"user3"}) MATCH (p:game {id:"${id4.toString()}"}) CREATE (u)-[:BOUGHT]->(p)`,
        `MATCH (u:User {id:"user3"}) MATCH (p:game {id:"${id5.toString()}"}) CREATE (u)-[:BOUGHT]->(p)`,
    ]
}

describe('order routes', () => {
    describe('integration tests', () => {
        beforeEach(async function() {
            const prod1 = new game({
                name: "game 1",
                price: 1,
            })
            const prod2 = new game({
                name: "game 2",
                price: 2,
            })
            const prod3 = new game({
                name: "game 3",
                price: 3,
            })
            const prod4 = new game({
                name: "game 4",
                price: 4,
            })
            const prod5 = new game({
                name: "game 5",
                price: 5,
            })

            await Promise.all([prod1.save(), prod2.save(), prod3.save(), prod4.save(), prod5.save()])

            const session = neo.session()

            for (let query of createQueries(prod1._id, prod2._id, prod3._id, prod4._id, prod5._id)) {
                await session.run(query)
            }

            session.close()
        })

        it('gives simple orders', async function() {
            const res = await requester.get('/user/user1/orders/simple')

            expect(res.body).to.have.length(3)
            const names = res.body.map(game => game.name)
            expect(names).to.have.members(['game 3', 'game 4', 'game 5'])
        })

        it('gives similarity orders', async function() {
            const res = await requester.get('/user/user1/orders/similar')

            expect(res.body).to.have.length(1)
            const names = res.body.map(game => game.name)
            expect(names).to.have.members(['game 3'])
        })

        it('gives keyed orders', async function() {
            const res = await requester.get('/user/user1/orders/keyed')

            expect(res.body).to.have.length(1)
            const names = res.body.map(game => game.name)
            expect(names).to.have.members(['game 4'])
        })
    })
})