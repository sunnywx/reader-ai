export default function Greet({books=[]}) {
  return (
    <div>hello {JSON.stringify(books)}</div>
  )
}

export async function getServerSideProps(ctx) {
  // test ssr bypass cors
  const resp=await fetch(`http://localhost:3001/books`)
  const books=await resp.json()

  console.log('books: ', books)

  const {query}=ctx
  return {
    props: {
      name: query?.name || '',
      books
    }
  }
}