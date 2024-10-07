import { useRouter } from "next/router";
import { PdfViewer } from "@/components/pdf-viewer";
import {EpubReader} from '@/components/epub-reader'
import Head from "next/head";
import {proxyUrl} from '@/lib/utils'
import { useMemo } from "react";

export default function BookDetail() {
  const { query } = useRouter();
  const { slug = [] } = query as { slug: string[] };
  // const fileName=slug.length > 0 ? slug[slug.length - 1] : ''
  const filePath = slug.join("/");
  const fullPath=useMemo(()=> {
    return proxyUrl(['book-blob', filePath].join('/'))
  }, [filePath])

  function renderReaders(){
    if(!filePath) return

    if(filePath.endsWith('pdf')){
      return (
        <PdfViewer fileUrl={fullPath} />
      )
    }

    if(filePath.endsWith('epub')){
      return (
        <EpubReader path={fullPath} />
      )
    }
  }

  return (
    <>
      <Head>
        <title>{`Book: ${filePath}`}</title>
      </Head>

      {renderReaders()}
    </>
  );
}
