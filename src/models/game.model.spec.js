const chai = require('chai')
const expect = chai.expect

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const game = require('./game.model')() // note we need to call the model caching function


describe('game model', function() {
    describe('unit tests', function() {
        it('should reject a negative price', async function() {
            const testgame = {
                name: 'Camera X120',
                description: 'A cool camera',
                price: -129
            }
    
            // use validate and not save to make it a real unit test (we don't require a db this way)
            await expect(new game(testgame).validate()).to.be.rejectedWith(Error)
        })
    
        it('should reject a missing price', async function() {
            const testgame = {
                name: 'Camera X120',
                description: 'A cool camera'
            }
    
            await expect(new game(testgame).validate()).to.be.rejectedWith(Error)
        })
    })
})