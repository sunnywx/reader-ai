import {useRouter} from 'next/router'
import {PdfViewer} from '@/components/pdf-viewer'

const apiPrefix='http://localhost:3001/get-raw-book'

export default function BookDetail(){
  const {query}=useRouter()
  const {slug=[]}=query as {slug: string[]}
  // const fileName=slug.length > 0 ? slug[slug.length - 1] : ''
  const filePath=slug.join('/')

  return (
    <>
      {/* book path: {filePath} */}

      {filePath && <PdfViewer fileUrl={[apiPrefix, filePath].join('/')}/>}
    </>
  )
}