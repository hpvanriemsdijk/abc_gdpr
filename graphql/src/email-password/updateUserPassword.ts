import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'
import * as bcrypt from 'bcryptjs'
import * as validator from 'validator'

interface User {
  id: string
}

interface EventData {
  id: string
  passwordA: string
  passwordB: string
}

const SALT_ROUNDS = 10

export default async (event: FunctionEvent<EventData>) => {
  console.log(event)

  try {
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    const { id, passwordA, passwordB } = event.data

    // check if user exists
    const userExists: boolean = await getUserById(api, id)
      .then(r => r.User !== null)
    if (!userExists) {
      return { error: 'User does not exist' }
    }    

    if (passwordA != passwordB) {
      return { error: 'Passwords do not match' }
    }

    // create password hash
    const salt = bcrypt.genSaltSync(SALT_ROUNDS)
    const hash = await bcrypt.hash(passwordA, salt)

    // create new user
    const userId = await updatePassword(api, id, hash)

    return { data: { id: userId } }
  } catch (e) {
    console.log(e)
    return { error: 'An unexpected error occured during password change.' }
  }
}

async function getUserById(api: GraphQLClient, id: string): Promise<{ User }> {
  const query = `
    query getUser($id: ID!) {
      User(id: $id) {
        password
      }
    }
  `

  const variables = {
    id,
  }

  return api.request<{ User }>(query, variables)
}

async function updatePassword(api: GraphQLClient, id: ID, password: string): Promise<string> {
  const mutation = `
    mutation updatePassword($id: ID!, $password: String!) {
      updateUser(
        id: $id,
        password: $password
      ) {
        id
      }
    }
  `

  const variables = {
    id,
    password,
  }

  return api.request<{ updateUser: User }>(mutation, variables)
    .then(r => r.updateUser.id)
}
