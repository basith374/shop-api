import { ApolloServer, AuthenticationError } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';

cloudinary.config({
	cloud_name: '',
	api_key: '',
	api_secret: ''
});

export const JWT_SECRET = '';

const getUser = (token) => {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch(err) {
	}
	return ''
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		let ctx = { models }
		if(req.body.operationName !== 'LoginMutation') {
			const token = req.headers.authorization || '';
			ctx.user = token ? getUser(token) : '';
			if (!ctx.user) throw new AuthenticationError('you must be logged in')
		}
		return ctx
	},
})

server
	.listen({ port: process.env.PORT || 4000 })
	.then(({ url }) => console.log('Server is running on localhost:4000'))