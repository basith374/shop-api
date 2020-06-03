import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: { models },
})

server
	.listen()
	.then(({ url }) => console.log('Server is running on localhost:4000'))