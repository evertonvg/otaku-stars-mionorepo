import Fastify from 'fastify'
import { prisma } from './lib/prisma'

const app = Fastify()

app.get('/', async () => {
  return { hello: 'world' }
})

app.listen({ port: 3333 }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log('🚀 HTTP server running at http://localhost:3333')
})


app.get('/users', async () => {
  return await prisma.user.findMany()
})
