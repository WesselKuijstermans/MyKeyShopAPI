const chai = require('chai')
const expect = chai.expect

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const User = require('./user.model')() // note we need to call the model caching function
const game = require('./game.model')() // note we need to call the model caching function


describe('key schema', function() {
    let user

    beforeEach(async function() {
        user = {
            name: 'Joe'
        }

        const savedUser = await new User(user).save()
        user['id'] = savedUser._id
    })

    describe('unit tests', function() {
        it('should reject a rating of 3.5', async function() {
            const testgame = {
                name: 'Camera X120',
                description: 'A cool camera',
                price: 259,
                keys: [
                    {
                        rating: 3.5,
                        text: 'Pretty average camera',
                        user: user.id
                    }
                ]
            }
    
            await expect(new game(testgame).save()).to.be.rejectedWith(Error)
        })
    
        it('should compute an average rating of a game', async function() {
            const testgame = new game({
                name: 'Camera X120',
                description: 'A cool camera',
                price: 259,
                keys: [{
                    rating: 4,
                    text: 'Pretty average camera',
                    user: user.id
                }, {
                    rating: 3,
                    text: 'Changed my mind for the worse',
                    user: user.id
                }]
            })
    
            await testgame.save()
        
            expect(testgame).to.have.property('rating', 3.5)
        })
    })
})