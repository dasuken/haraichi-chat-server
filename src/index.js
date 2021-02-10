
const { ApolloServer } = require('apollo-server');
require('dotenv').config();
const typeDefs 	= require( './graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

// models
const Comment = require('./models/Comment');
const Theme 	= require('./models/Theme');
const Radio 	= require('./models/Radio');
const Response = require('./models/Response');

// mongo connection
const serve = require('./connection.js')
serve()

// apollo serve
const server = new ApolloServer({
  cors: true,
	typeDefs,
	resolvers,
	formatError: (error) => ({
		name: error.name,
		message: error.message.replace('Context creation failed:', '')
	}),
	context: async ({ req }) => {
		return { Comment, Theme, Radio, Response};
	}
});

// express serve
server.listen(process.env.PORT || 4000).then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
