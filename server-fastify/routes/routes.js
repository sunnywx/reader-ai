/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fast, options){
  // switch table
  const coll=fast.mongo.db.collection('books')

  fast.get('/', async (req, reply)=> {
    return {hello: 'world'}
  })

  fast.get('/books', async (req, reply)=> {
    const books=await coll.find().toArray()

    return {books}
  })

  fast.get('/books/:id', async (req, reply)=> {
    try{
      const result=await coll.findOne({id: parseInt(req.params.id)})
      return {result}
    } catch(err){
      throw Error('Error: ', err)
    }
  })
}

export default routes
