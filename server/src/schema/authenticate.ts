import { inputObjectType, objectType } from 'nexus'
import { AuthenticationError } from 'apollo-server'
import { verify, sign } from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'

const Token = objectType({
	name: 'Token',
	definition(t) {
		t.string("token");
	}
});

interface Token {
	userId: string
}

const LoginInput = inputObjectType({
	name: 'LoginInput',
	definition(t) {
		t.field('email', {
			type: 'String'
		});
		t.field('password', {
			type: 'String'
		});
	}
});

function validateToken(Authorization:String) {
	const APP_SECRET = process.env.APP_SECRET

	try {
		const token = Authorization.replace('Bearer ', '')
		var decoded = verify(token, APP_SECRET);
	} catch(err) {
		return null
	}

	return decoded
}

async function authenticateUser(parent, {data: {email, password}}, ctx, info) {
	const user = await ctx.prisma.user({email}, info);
	if(!user) throw new AuthenticationError('Could not find a match for username and password');
	if(!user.active) throw new AuthenticationError('Could not find a match for username and password');

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) {
		throw new AuthenticationError('Could not find a match for username and password');
	}

  	const token = sign({
		  userId: user.id, 
		  email: user.email,
		  specialPermissions: user.specialPermissions
		}, 
		process.env.APP_SECRET,
		{ expiresIn: '1d' });
	return {token: token};
}

module.exports = {authenticateUser, LoginInput, Token, validateToken};