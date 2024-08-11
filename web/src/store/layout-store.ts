import { create } from 'zustand'

type State={
  hideSidebar: boolean
  toggleSidebar?: ()=> void 
}

const initialState: State={
  hideSidebar: false
}

export const useLayoutStore = create<State>((set) => ({
  ...initialState,
  toggleSidebar: () => set((state) => ({ hideSidebar: !state.hideSidebar })),
}))