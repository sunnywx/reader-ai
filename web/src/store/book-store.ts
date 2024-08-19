import { create } from 'zustand'
import {Book} from '@/types/book'

export type State={
  books: Book[]
  allBooks: Book[]
  onlineBooks?: Book[]
  onlineMode?: boolean
}

export type Actions={
  setBooks: (books: Book[])=> void,
  setAllBooks: (books: Book[])=> void
  setOnlineMode?: (online: boolean)=> void
}

const initialState: State = {
  books: [],
  allBooks: [],
  onlineMode: false,
  onlineBooks: [],
}

export const useBookStore = create<State & Actions>((set) => ({
  ...initialState,
  setBooks: (books: Book[])=> set({books}),
  setAllBooks: (allBooks: Book[])=> set({allBooks}),
  setOnlineBooks: (books: Book[])=> set({onlineBooks: books}),
  setOnlineMode: (online: boolean)=> set({onlineMode: online})
}))