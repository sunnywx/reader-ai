import { TextField } from "@radix-ui/themes";
import { Search as SearchIcon } from "lucide-react";

export const Search = () => {
  return (
    <TextField.Root
      placeholder="Search book"
      className="w-[426px] h-[40px] border-solid border-slate-200 rounded-md"
    >
      <TextField.Slot>
        <SearchIcon size={16} />
      </TextField.Slot>
    </TextField.Root>
  );
};
