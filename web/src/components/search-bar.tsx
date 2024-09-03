import { TextField, Tooltip, Badge, Switch, Spinner } from "@radix-ui/themes";
import { Search as SearchIcon, ExternalLink, CircleX } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "react-use";
import styles from "./styles.module.scss";
import cs from "clsx";
import { useBookStore } from "@/store/book-store";
import { Book, OnlineBook } from "@/types/book";
import { useRouter } from "next/router";
import { proxyUrl } from "@/lib/utils";
// import mockOnlineBooks from "@/mock/online-books";
import { usePrevious } from "react-use";

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
  const {
    allBooks,
    setAllBooks,
    setOnlineMode,
    onlineMode,
    setBooks,
    books,
    loading,
    setLoading,
  } = useBookStore();
  const [focusMode, setFocusMode] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const allFetched = useRef(false);
  // const [loading, setLoading] = useState(false);
  const prevSearch = usePrevious(search);

  // fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const resp = await fetch(proxyUrl("local-books"));
      const data = await resp.json();
      setAllBooks(data?.books || []);

      allFetched.current = true;
      setLoading(false);
    };

    if (focusMode && !allFetched.current) {
      fetchBooks();
    }
  }, [focusMode, allFetched.current]);

  // search online books
  useEffect(() => {
    const fetchBooks = async (search: string) => {
      if (!search) return;

      setLoading(true);
      const resp = await fetch(proxyUrl(`/search-online-books/${search}`));
      const data = await resp.json();
      // const data=mockOnlineBooks
      // console.log("fetch online books: ", data?.books);
      setBooks(data?.books || []);
      setLoading(false);
    };

    if (search && onlineMode) {
      console.log("search word: ", search);
      fetchBooks(search);
    }
  }, [search, onlineMode]);

  const [, cancel] = useDebounce(
    () => {
      setSearch(val);
    },
    200,
    [val]
  );

  const filterBooks = useMemo(() => {
    if (onlineMode) {
      return books;
    }

    return flatDeep(allBooks).filter((v) =>
      v.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allBooks, onlineMode, books]);

  return (
    <TextField.Root
      placeholder="Search book"
      className={`relative h-[40px] border-solid border-slate-200 rounded-md transition-all ${focusMode ? "w-[800px]" : "w-[500px]"}`}
      value={val}
      onChange={(ev) => {
        setVal(ev.target.value);
      }}
      onFocus={() => {
        setFocusMode(true)
      }}
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
          "absolute top-[42px] w-full bg-slate-100 max-h-[600px] overflow-auto min-h-[100px] z-[100] rounded-b-md",
          styles.search_result,
          { [styles.show]: focusMode }
        )}
      >
        {loading ? (
           <div className="w-full h-full flex justify-center items-center">
           <Spinner />
         </div>
        ) : filterBooks.length === 0 ? (
          <div className="w-full h-full flex justify-center items-center">
          No result
        </div>
        ) : (
          filterBooks.map(({ name, prefix, size, createAt }: Book) => {
            return (
              <li
                className={styles.item}
                key={[prefix, name].join("")}
                onClick={(ev) => {
                  // ev.stopPropagation();
                  // ev.preventDefault();
      
                  const url = `/book/${prefix}/${name}`;
                  router.push(url, undefined, { shallow: true });
      
                  setVal(name)
      
                  setTimeout(() => {
                    inputRef.current?.blur();         
                  }, 100);
                }}
              >
                <Tooltip content={name}>
                  <span className="truncate max-w-[90%]">{name}</span>
                </Tooltip>
                <div className="flex items-center">
                  {prefix && <Badge color="blue">{prefix}</Badge>}
                  <Tooltip content="Open in new Tab">
                    <span
                      className="w-6 h-6 rounded-full hover:bg-gray-300 inline-flex justify-center items-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        // const path=encodeURIComponent(`${prefix}/${name}`)
                        window.open(
                          proxyUrl(`book-blob/${prefix}/${name}`),
                          "_blank"
                        );
                      }}
                    >
                      <ExternalLink size={14} color="var(--gray-9)" />
                    </span>
                  </Tooltip>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <TextField.Slot>
        <CircleX
          size={14}
          className={`text-xs cursor-pointer hover:text-gray-300 ${
            search ? "block" : "hidden"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setVal("");
          }}
        />
      </TextField.Slot>

      <TextField.Slot>
        <span className="text-xs">{filterBooks.length} books total</span>
      </TextField.Slot>

      {/* <TextField.Slot>
        <label htmlFor="online-mode-toggle" className="ml-2">
          Search web
        </label>
        <Switch
          checked={onlineMode}
          onCheckedChange={setOnlineMode}
          id="online-mode-toggle"
          onClick={(ev) => {
            ev.stopPropagation();
          }}
        />
      </TextField.Slot> */}
    </TextField.Root>
  );
};
