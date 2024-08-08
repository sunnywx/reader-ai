export default function Greet(props) {
  return (
    <div>hello {props.name}</div>
  )
}

export async function getServerSideProps({params, query}) {
  console.log('server props: ', params, query)

  return {
    props: {
      name: query?.name || ''
    }
  }
}