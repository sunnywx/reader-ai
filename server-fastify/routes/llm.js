// LLM/AI related route
export default async function aiRoutes(fast, options){
  fast.get('/llms', {
    schema: {
      query: {},
      tags: ['ai']
    }
  }, async (req, reply)=> {
    const llms=[
      {id: 'id-1', name: 'gpt-3.5-turbo'},
      {id: 'id-2', name: 'gpt-4'},
      {id: 'id-3', name: 'claude-3.5-sonnet'},
    ]

    return {llms}
  })
}