import { prisma } from '../src/generated/prisma-client'

async function main() {
  await prisma.createUser({
    email: 'alice@prisma.io',
    active: true
  })
  await prisma.createUser({
    email: 'bob@prisma.io',
    active: true
  })
}

main().catch(e => console.error(e))
