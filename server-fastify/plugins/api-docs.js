import { resolve } from "node:path";
import {existsSync} from 'node:fs'
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Autoload from "@fastify/autoload";
import fp from 'fastify-plugin'
import {getDirFromRoot} from '../utils/index.js'

const port=process.env.PORT || 3001

/**
 * generate swagger ui
 * @param {*} inst  fastify instance
 * @param {*} options
 */
async function generateApiDocs(fast, options) {
  // Register the swagger plugin
  fast.register(swagger, {
    swagger: {
      info: {
        title: "Api docs",
        description: "Reader-ai swagger API",
        version: "0.1.0",
      },
      servers: [
        {
          url: `http://localhost:${port}`,
          description: 'Development server'
        }
      ],
      // host: "localhost:3001",
      tags: [
        { name: 'book', description: 'Book related endpoints' },
        { name: 'user', description: 'User related endpoints' },
        { name: 'ai', description: 'AI related endpoints' }
      ],
      schemes: ["http", "https"],
      consumes: ["application/json"],
      produces: ["application/json"],
      externalDocs: {
        url: 'https://swagger.io/docs',
        description: 'swagger docs'
      }
    },
  });

  // Register the swagger UI plugin
  fast.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  // autoload routes dir
  const routeDir=options.routeDir || getDirFromRoot('routes')

  if(existsSync(routeDir)){
    fast.register(Autoload, {
      dir: routeDir,
    });
  } else {
    console.warn(`routes dir: ${routeDir} not exists, skip autoload routes`)
  }
  
}

export default fp(generateApiDocs);
