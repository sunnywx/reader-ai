import {Flex} from '@radix-ui/themes'
import {Search} from './search-bar'
import Link from 'next/link'

export const TopBar=()=> {
  return (
    <Flex className='bg-slate-100 w-full h-16 fixed top-0 z-10 flex items-center justify-between px-4'>
      <Link className='text-lg font-semibold cursor-pointe' href='/'>Reader-AI</Link>
      <Search />
      <Flex>
        user actions
      </Flex>
    </Flex>
  )
}