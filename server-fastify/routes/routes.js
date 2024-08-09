/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fast, options){
  // switch table
  const coll=fast.mongo.db.collection('books')

  // fast.get('/', async (req, reply)=> {
  //   return {hello: 'world'}
  // })

  fast.get('/books', async (req, reply)=> {
    const books=await coll.find().toArray()

    return {books}
  })

  fast.get('/books/:id', {
    schema: {
      // description: 'Get one book',
      // summary: 'GET /books/{id}',
      params: {
        id: { type: 'string', description: 'Book ID' }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            result: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                // Add other book properties here
                title: { type: 'string' },
                author: { type: 'string' },
              }
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
      const result = await coll.findOne({ id: parseInt(req.params.id) });
      if (!result) {
        reply.code(404).send({ error: 'Book not found' });
        return;
      }
      return { result };
    } catch (err) {
      throw Error('Error: ', err)
    }
  })
}

export default routes
