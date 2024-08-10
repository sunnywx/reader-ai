import {Flex} from '@radix-ui/themes'
import {Search} from './search-bar'

export const TopBar=()=> {
  return (
    <Flex className='bg-slate-100 w-full h-16 fixed top-0 z-10 flex items-center justify-between px-4'>
      <Flex className='text-md font-bold cursor-pointer'>Reader-AI</Flex>
      <Search />
      <Flex>
        user actions
      </Flex>
    </Flex>
  )
}