require('dotenv').config();
import { ApolloServer } from 'apollo-server'
import { prisma } from './generated/prisma-client'
const { applyMiddleware } = require('graphql-middleware');
const { permissions } = require('./permissions');
const { baseSchema } = require('./schema');
const { validateToken } = require('./schema/authenticate');

interface Token {
  userId: string
}

const schema = applyMiddleware(baseSchema, permissions);

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization || null;
    const verifiedToken = validateToken(token);
  
    // add the autenticatedUser to the context
    return { prisma, verifiedToken };
  }
})

server.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000`),
)
