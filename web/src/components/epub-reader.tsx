import React, { useState } from 'react'
import { ReactReader } from 'react-reader'

export const EpubReader = ({path}: {path: string}) => {
  const [location, setLocation] = useState<string | number>(0)

  return (
    <div style={{ height: '100vh' }}>
      <ReactReader
        url={path}
        location={location}
        locationChanged={(epubcfi: string) => setLocation(epubcfi)}
        showToc
        epubInitOptions={{
          openAs: 'epub',
        }}
        epubOptions={{
          flow: 'scrolled',
          manager: 'continuous',
        }}
      />
    </div>
  )
}