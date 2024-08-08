import fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

const fast=fastify({logger: true})

// Register the swagger plugin
fast.register(swagger, {
  swagger: {
    info: {
      title: 'Test swagger',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0'
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
})

// Register the swagger UI plugin
fast.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
  transformSpecificationClone: true
})

// Define a sample route
fast.get('/', {
  schema: {
    description: 'This is the root route',
    tags: ['root'],
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  return { hello: 'world' }
})

// Run the server
const start = async () => {
  try {
    await fast.listen({ port: process.env.PORT || 3000 })
    // fast.log.info(`server listening on ${fast.server.address().port}`)
  } catch (err) {
    fast.log.error(err)
    process.exit(1)
  }
}
start()