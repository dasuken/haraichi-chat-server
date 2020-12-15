
const { ApolloServer } = require('apollo-server');
require('dotenv').config();
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const Comment = require('./models/Comment');
const Theme = require('./models/Theme');
const Radio = require('./models/Radio');

mongoose
	.connect(
		process.env.MONGO_URI,
		{ useUnifiedTopology: true },
		{ useNewUrlParser: true },
		{ useFindAndModify: false }
	)
	.then((_) => console.log('DB CONNECTED'))
	.catch((err) => console.log(err));

const server = new ApolloServer({
  cors: true,
	typeDefs,
	resolvers,
	formatError: (error) => ({
		name: error.name,
		message: error.message.replace('Context creation failed:', '')
	}),
	context: async ({ req }) => {
		return { Comment, Theme, Radio };
	}
});


server.listen(process.env.PORT || 4000).then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
