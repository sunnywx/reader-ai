import { Flex } from "@radix-ui/themes"
import {TopBar} from './top-bar'
import {Sidebar} from './side-bar'
import { ReactNode } from "react"

export const Layout=({children}: {children: ReactNode})=> {
  return (
    <div className="flex flex-col">
      <TopBar />
      <div className="relative top-16 max-h-[calc(100vh - 64px)] grid grid-cols-[240px_1fr] gap-4">
        <Sidebar />
        {children}
      </div>
    </div>
  )
}