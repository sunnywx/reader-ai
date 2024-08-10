// user related routes
export default async function userRoutes(fast, options){
  fast.get('/users', {
    schema: {
      query: {},
      tags: ['user']
    }
  }, async (req, reply)=> {
    const users=[
      {id: 'id-1', name: 'sunny'}
    ]

    return {users}
  })
}