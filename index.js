import { ApolloServer, AuthenticationError, PubSub } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';
require('dotenv').config()

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const JWT_SECRET = process.env.JWT_SECRET;

const getUser = (token) => {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (err) {
	}
	return ''
}

export const pubsub = new PubSub();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req, connection }) => {
		if(connection) {
			return connection.context;
		} else {
			const token = req.headers.authorization || '';
			const user = getUser(token);
			return { models, user }
		}
	},
})

server
	.listen({ port: process.env.PORT || 4000 })
	.then(({ url, subscriptionsUrl }) => {
		console.log(`🚀 Server ready at ${url}`);
		console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
	})