const {prismaObjectType} = require('nexus-prisma');
import { AuthenticationError, ForbiddenError } from 'apollo-server'
import * as bcrypt from 'bcrypt'

const User = prismaObjectType({
	name: 'User',
	definition(t) {
		t.prismaFields({filter: ['password']});
	}
});

/*
 * should not be used as everything is in the JWT
 */
async function loggedInUser(parent, {data}, ctx, info){
    const user = await ctx.prisma.user({id: ctx.verifiedToken.userId})

	if (!user) {
		throw new AuthenticationError(`Invalid token.`);
	}

    //Autenticated if user excists and is active
	return user
}

async function createAdmin(parent, {data}, ctx, info){
	const users = await ctx.prisma.users();

	users.map(user => {
		if(user.specialPermissions.includes('ADMIN')){
			throw new ForbiddenError(`Can't create a new Administrator using createAdmin`);
		}

		if(user.email ===  data.email){
			throw new ForbiddenError(`Can't create a new Administrator using createAdmin`);
		}
	})

	data.specialPermissions =  { set: ['ADMIN'] };
	data.active = true;
	const password = await bcrypt.hash(data.password, 10);
	const user = await ctx.prisma.createUser({...data, password}, info);
	
	return user;
}

async function createUser(parent, {data}, ctx, info) {
	const existing = await ctx.prisma.user({email: data.email});
	if (existing) {
		throw new ForbiddenError(`User with email "${data.email}" already exists`);
	}

	const password = await bcrypt.hash(data.password, 10);
	const user = await ctx.prisma.createUser({...data, password}, info);
	 
	return user;
}

module.exports = {User, loggedInUser, createUser, createAdmin};
