import { TextField } from "@radix-ui/themes";
import { Search as SearchIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "react-use";
import styles from "./styles.module.scss";
import cs from "clsx";
import { useBookStore } from "@/store/book-store";
import { Book } from "@/types/book";
import { useRouter } from "next/router";

const flatDeep = (books: Book[]): Book[] => {
  let result: Book[] = [];

  const flat = (d: Book[]) => {
    d.forEach((b) => {
      if (Array.isArray(b.files)) {
        flat(b.files);
      } else {
        result.push(b);
      }
    });
  };

  flat(books);

  return result;
};

export const Search = () => {
  const [val, setVal] = useState("");
  const [search, setSearch] = useState("");
  const { books } = useBookStore();
  const [focusMode, setFocusMode] = useState(false);
  const router = useRouter();
  const inputRef=useRef<HTMLInputElement>(null)

  const [, cancel] = useDebounce(
    () => {
      setSearch(val);
    },
    300,
    [val]
  );

  const filterBooks = useMemo(() => {
    return flatDeep(books).filter((v) =>
      v.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, books]);

  // useEffect(() => {
  //   console.log("filter books: ", filterBooks);
  // }, [filterBooks]);

  return (
    <TextField.Root
      placeholder="Search book"
      className={`relative h-[40px] border-solid border-slate-200 rounded-md transition-all `.concat(
        focusMode ? "w-[800px]" : "w-[500px]"
      )}
      value={val}
      onChange={(ev) => {
        setVal(ev.target.value);
      }}
      onFocus={() => setFocusMode(true)}
      onBlur={() => {
        setFocusMode(false);
      }}
      ref={inputRef}
    >
      <TextField.Slot>
        <SearchIcon size={16} />
      </TextField.Slot>

      <ul
        className={cs(
          "absolute top-[42px] w-full bg-slate-100 max-h-[600px] overflow-auto",
          styles.search_result,
          { [styles.show]: focusMode }
        )}
      >
        {filterBooks.length > 0 ? (
          filterBooks.map(({ name, prefix, size, createAt }: Book) => {
            return (
              <li
                className={styles.item}
                key={[prefix, name].join("")}
                onClick={(ev) => {
                  ev.preventDefault();

                  const url = `/book/${prefix}/${name}`;
                  // console.log("open book: ", url);
                  router.push(url, undefined, { shallow: true });

                  // setFocusMode(false)
                  inputRef.current?.blur()
                }}
              >
                {name}
              </li>
            );
          })
        ) : (
          <li className={styles.item}>No result</li>
        )}
      </ul>

      <TextField.Slot>
        <span className="text-xs">{filterBooks.length} books</span>
      </TextField.Slot>
    </TextField.Root>
  );
};
