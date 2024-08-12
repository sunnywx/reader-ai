import {resolve} from 'node:path'
import fastify from 'fastify'
import dotenv from 'dotenv'
import cors from '@fastify/cors'
import {getCurrentDir} from './utils/index.js'

dotenv.config()

// load plugins
import mongoConnector from './plugins/mongo-connector.js'
import apiDocs from './plugins/api-docs.js'

// load decorators

// load hooks

// load own services
// import bookRoutes from './routes/book.js' // don't omit file ext in node bare import

const server=fastify({logger: true})

server.register(cors, {
  // origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  origin: true
})

server.register(mongoConnector)

// when register api-docs plugin, it will auto load routes
// if disable api-docs, you should uncomment routes
// server.register(routes)

server.register(apiDocs, {
  // routeDir: resolve(getCurrentDir(import.meta.url), 'routes')
})

// Run the server
const start = async () => {
  try {
    await server.listen({ port: process.env.PORT || 3001, host: '0.0.0.0' })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()