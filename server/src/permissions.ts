const {allow, deny, shield, rule} = require('graphql-shield');

// Rules
const isAuthenticated = rule()(async (parent, args, ctx, info) => {
    const user = await ctx.prisma.user({id: ctx.verifiedToken.userId})

    //Autenticated if user excists and is active
    return user && user.active ? true : false
})

const isAdmin = rule()(async (parent, args, ctx, info) => {
    return ctx.autenticatedUser.role === 'admin'
})

const permissions = shield({
    Query: {
        '*': isAuthenticated
    },
    Mutation: {
        '*': isAuthenticated,
        authenticateUser: allow,
        createAdmin: allow,
    }
});

module.exports = {
	permissions
};