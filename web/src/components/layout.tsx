import {TopBar} from './top-bar'
import {Sidebar} from './side-bar'
import { ReactNode } from "react"
import {useLayoutStore} from '@/store/layout-store'

export const Layout=({children}: {children: ReactNode})=> {
  const {hideSidebar}=useLayoutStore()
  const cls=hideSidebar ? 'grid-cols-[0px_1fr]' : 'grid-cols-[240px_1fr] gap-4'

  return (
    <div className="flex flex-col">
      <TopBar />
      <div className={`relative top-16 max-h-[calc(100vh - 64px)] grid ${cls}`}>
        <Sidebar className={hideSidebar ? '-translate-x-full' : ''} />
        {children}
      </div>
    </div>
  )
}