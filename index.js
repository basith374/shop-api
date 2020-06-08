import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';
import cloudinary from 'cloudinary';

cloudinary.config({
	cloud_name: '',
	api_key: '',
	api_secret: ''
});

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: { models },
})

server
	.listen()
	.then(({ url }) => console.log('Server is running on localhost:4000'))