const neo4j = require('neo4j-driver')

function connect(dbName) {
    this.dbName = dbName
    this.driver = neo4j.driver(
        process.env.NEO4J_URL,
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    )
}

function session() {
    return this.driver.session({
        database: this.dbName,
        defaultAccessMode: neo4j.session.WRITE
    })
}

module.exports = {
    connect,
    session,
    dropAll: 'MATCH (n) DETACH DELETE n',
    purchaseGame: 'MERGE (game:Game {id:$gameId}) MERGE (user:User {id: $userId}) MERGE (user)-[:BOUGHT]->(game)',
    purchaseHardware: 'MERGE (hardware:Hardware {id:$hardwareId}) MERGE (user:User {id: $userId}) MERGE (user)-[:BOUGHT]->(hardware)',
    key: 'MERGE (game:game {id:$gameId}) MERGE (user:User {id:$userId}) MERGE (user)-[:REVIEWED {rating:$rating}]->(game)',
    // recommend games keyers rated with 4 or 5 stars if you bought a game keyed with 4 or 5 stars
    recommendKeyed: 'MATCH (usr:User {id:$userId})-[:BOUGHT]->(:game)<-[key:REVIEWED]-(keyer:User) WHERE key.rating >= 4 WITH DISTINCT keyer, usr MATCH (keyer)-[key:REVIEWED]->(game:game) WHERE key.rating >= 4 AND NOT (usr)-[:BOUGHT]->(game) RETURN collect(DISTINCT game.id) as gameIds',
    // recommend other games of users that have bought the same game as you
    recommendSimilar: 'MATCH (usr:User {id:$userId})-[:BOUGHT*3]-(game:game) WHERE NOT (usr)-[:BOUGHT]->(game) RETURN collect(DISTINCT game.id) as gameIds',
    // recommend other games of users that have bought at least 2 the same games as you
    recommendSimilarTwo: 'MATCH (usr:User {id:$userId})-[:BOUGHT]->(game:game)<-[:BOUGHT]-(other:User) WITH usr, other, count(DISTINCT game) as gameCount WHERE gameCount > 1 MATCH (other)-[:BOUGHT]->(game:game) WHERE NOT (usr)-[:BOUGHT]->(game) RETURN collect(DISTINCT game.id) as gameIds'
}