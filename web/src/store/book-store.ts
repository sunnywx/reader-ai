import { create } from 'zustand'
import {Book} from '@/types/book'

export type State={
  books: Book[]
  setBooks: (books: Book[])=> void
}

const initialState={
  books: []
}

export const useBookStore = create<State>((set) => ({
  ...initialState,
  setBooks: (books: Book[])=> set({books})
}))