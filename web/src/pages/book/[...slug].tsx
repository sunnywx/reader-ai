import {useRouter} from 'next/router'

export default function BookDetail(){
  const {query}=useRouter()
  const {slug=[]}=query as {slug: string[]}
  const fileName=slug.length > 0 ? slug[slug.length - 1] : ''
  const filePath=slug.join('/')

  return (
    <div>
      book path: {filePath}
    </div>
  )
}