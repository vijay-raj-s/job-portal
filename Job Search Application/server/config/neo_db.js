const neo4j = require('neo4j-driver');

// Create Driver
const driver = new neo4j.driver("neo4j://localhost:7687", neo4j.auth.basic("neo4j", "password1"));

// Create Driver session
const session = driver.session();

module.exports = {
    driver,
    session
}

