import fs from 'node:fs'
import {join} from 'node:path'
import {readDirectory} from '../utils/book.js'
import {expandPath} from '../utils/index.js'

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
export default async function bookRoutes(fast, options){
  // switch table
  const coll=fast.mongo.db.collection('books')

  fast.get('/books', {
    schema: {
      query: {},
      tags: ['book']
    }
  }, async (req, reply)=> {
    const books=await coll.find().toArray()

    return {books}
  })

  fast.get('/local-books', {
    schema: {
      query: {
        p: {type: 'string', description: 'Directory path'}
      },
      tags: ['book']
    }
  }, async (req, reply)=> {
    const base_dir=expandPath(process.env.LOCAL_BOOK_DIR || '~/books')
    const relative_path=decodeURIComponent(req.query.p || '')

    const dir=join(base_dir, relative_path)

    if(!fs.existsSync(dir)) return {books: []}

    const books=await readDirectory(dir, relative_path)
    return {books}
  })

  fast.get('/books/:id', {
    schema: {
      // description: 'Get one book',
      // summary: 'GET /books/{id}',
      params: {
        id: { type: 'string', description: 'Book ID' }
      },
      tags: ['book'],
      response: {
        200: {
          type: 'object',
          "properties": {
            "result": {
              "oneOf": [
                {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string" },
                    "title": { "type": "string" },
                    "author": { "type": "string" }
                  },
                  "required": ["id", "title"]
                },
                {
                  "type": "null"
                }
              ]
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (req, reply)=> {
    try {
      const result = await coll.findOne({ id: req.params.id });
      console.log('book: ', result)
      // if (!result) {
      //   reply.code(404).send({ error: 'Book not found' });
      //   return;
      // }
      return { result };
    } catch (err) {
      return err
      // throw Error('Error: ', err)
    }
  })
}
