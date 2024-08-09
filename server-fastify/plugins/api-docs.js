import { resolve } from "node:path";
import {existsSync} from 'node:fs'
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Autoload from "@fastify/autoload";
import fp from 'fastify-plugin'
import {getDirFromRoot} from '../utils/index.js'

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
        title: "api docs",
        description: "Testing the Fastify swagger API",
        version: "0.1.0",
      },
      host: "localhost:3001",
      schemes: ["http", "https"],
      consumes: ["application/json"],
      produces: ["application/json"],
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
