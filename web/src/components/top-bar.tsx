import { Flex, Tooltip } from "@radix-ui/themes";
import { Search } from "./search-bar";
import Link from "next/link";
import { AlignJustify } from "lucide-react";
import {useLayoutStore} from '@/store/layout-store'

export const TopBar = () => {
  const store=useLayoutStore()

  return (
    <Flex className="bg-slate-100 w-full h-16 fixed top-0 z-10 flex items-center justify-between px-4">
      <div className="inline-flex items-center">
        <Tooltip content="Toggle side bar">
          <AlignJustify
            size={18}
            className="text-sm font-thin text-slate-400 cursor-pointer hover:bg-slate-200 rounded-full mr-2"
            onClick={store.toggleSidebar}
          />
        </Tooltip>

        <Link className="text-lg font-semibold cursor-pointe" href="/">
          Study-AI
        </Link>
      </div>

      <Search />
      <Flex>user actions</Flex>
    </Flex>
  );
};
