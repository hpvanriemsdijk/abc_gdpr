import { makePrismaSchema, prismaObjectType  } from 'nexus-prisma'
import * as path from 'path'
import datamodelInfo from '../generated/nexus-prisma'
import { prisma } from '../generated/prisma-client'
import { arg } from 'nexus'

//Import types
const { authenticateUser, LoginInput, Token } = require('./authenticate');
const { User, loggedInUser, createUser, createAdmin } = require('./user');
const { createOrganizationalUnit, updateOrganizationalUnit, businessRoleByOu } = require('./organizationalUnit');
const { processByOu } = require('./processes');
const { processingActivitiesByOu } = require('./processingActivities');

const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields(['*']),
    t.field('createAdmin', {
			args: {
				data: arg({
					type: 'LoginInput'
				})
			},
			resolve: createAdmin,
			type: 'User'
    });
    t.field('createUser', {
			args: t.prismaType.createUser.args,
			resolve: createUser,
			type: 'User'
		});
		t.field('authenticateUser', {
			args: {
				data: arg({
					type: 'LoginInput'
				})
			},
			resolve: authenticateUser,
			type: 'Token'
    });
    t.field('createOrganizationalUnit', {
			args: t.prismaType.createOrganizationalUnit.args,
			resolve: createOrganizationalUnit,
			type: 'OrganizationalUnit'
    });
    t.field('updateOrganizationalUnit', {
			args: t.prismaType.updateOrganizationalUnit.args,
			resolve: updateOrganizationalUnit,
			type: 'OrganizationalUnit'
		});
  },
})

const Query = prismaObjectType({
  name: 'Query',
  definition(t) {
    // Keep all the queries
    t.prismaFields(['*']),
    t.field('loggedInUser', {
			resolve: loggedInUser,
			type: 'User'
    });
    t.list.field('processByOu', {
      args: t.prismaType.process.args,
			resolve: processByOu,
			type: 'Process'
    });
    t.list.field('processingActivitiesByOu', {
      args: t.prismaType.processingActivity.args,
			resolve: processingActivitiesByOu,
			type: 'ProcessingActivity'
    });
    t.list.field('businessRoleByOu', {
      args: t.prismaType.businessPartner.args,
			resolve: businessRoleByOu,
			type: 'BusinessRole'
		});
  },
})

const baseSchema = makePrismaSchema({
  // Provide all the GraphQL types we've implemented
  types: [Query, Mutation, LoginInput, User, Token],

  // Configure the interface to Prisma
  prisma: {
    datamodelInfo,
    client: prisma,
  },

  // Specify where Nexus should put the generated files
  outputs: {
    schema: path.join(__dirname, '../generated/schema.graphql'),
    typegen: path.join(__dirname, '../generated/nexus.ts'),
  },

  // Configure nullability of input arguments: All arguments are non-nullable by default
  nonNullDefaults: {
    input: false,
    output: false,
  },

  // Configure automatic type resolution for the TS representations of the associated types
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, '../types.ts'),
        alias: 'types',
      },
    ],
    contextType: 'types.Context',
  },
}) 

module.exports = {
	baseSchema
};