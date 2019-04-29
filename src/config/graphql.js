const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('../graphql');
const resolvers = require('../resolver');


const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = graphqlHTTP({
  graphiql: true,
  schema,
});
