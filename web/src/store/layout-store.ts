import { create } from 'zustand'
import {hideSidebarKey} from '@/constant/config'

type State={
  hideSidebar: boolean
  toggleSidebar?: ()=> void 
}

type Actions={
  toggleSidebar: ()=> void
  setSidebarStatus: (open: boolean)=> void
}

const initialState: State={
  hideSidebar: false
}

export const useLayoutStore = create<State & Actions>((set, get) => ({
  ...initialState,
  toggleSidebar: () => set((s) => {
    get().setSidebarStatus(!s.hideSidebar)
    return {hideSidebar: !s.hideSidebar}
  }),
  setSidebarStatus: (open: boolean)=> set(s=> {
    localStorage.setItem(hideSidebarKey, String(open))
    return {hideSidebar: open}
  })
}))