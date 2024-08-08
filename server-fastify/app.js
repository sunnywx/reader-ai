import fastify from 'fastify'
import dotenv from 'dotenv'

dotenv.config()

import routes from './routes/routes.js' // can't omit file ext in node bare import
import mongoConnector from './plugins/mongo-connector.js'

const server=fastify({logger: true})

server.register(mongoConnector)
server.register(routes)

// Run the server
const start = async () => {
  try {
    await server.listen({ port: process.env.PORT || 3001 })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()