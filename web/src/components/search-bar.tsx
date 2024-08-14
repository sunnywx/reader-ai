import { TextField, Tooltip, Badge, Switch, Spinner } from "@radix-ui/themes";
import { Search as SearchIcon, ExternalLink, CircleX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "react-use";
import styles from "./styles.module.scss";
import cs from "clsx";
import { useBookStore } from "@/store/book-store";
import { Book } from "@/types/book";
import { useRouter } from "next/router";
import { proxyUrl } from "@/lib/utils";

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
  const { allBooks, setAllBooks } = useBookStore();
  const [focusMode, setFocusMode] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const allFetched = useRef(false);

  const [loading, setLoading]=useState(false)
  const [onlineMode, setOnlineMode] = useState(false);

  // fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      const resp = await fetch(proxyUrl("local-books"));
      const data = await resp.json();
      setAllBooks(data?.books || []);

      allFetched.current = true;
      setLoading(false)
    };

    if (focusMode && !allFetched.current) {
      fetchBooks();
    }
  }, [focusMode, allFetched.current]);

  // search online books
  useEffect(()=> {
    if(focusMode && search && onlineMode){
      // todo
    }
  }, [focusMode, search, onlineMode])

  const [, cancel] = useDebounce(
    () => {
      setSearch(val);
    },
    500,
    [val]
  );

  const filterBooks = useMemo(() => {
    // if(onlineMode){
    //   return []
    // }

    return flatDeep(allBooks).filter((v) =>
      v.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allBooks, onlineMode]);

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
          "absolute top-[42px] w-full bg-slate-100 max-h-[600px] overflow-auto min-h-[100px]",
          styles.search_result,
          { [styles.show]: focusMode }
        )}
      >
        {loading && <Spinner />}

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

                  inputRef.current?.blur();
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
                      onClick={() =>
                        window.open(
                          proxyUrl(`get-raw-book/${prefix}/${name}`),
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink size={14} color="var(--gray-9)" />
                    </span>
                  </Tooltip>
                </div>
              </li>
            );
          })
        ) : (
          <div className='w-full h-full flex justify-center items-center'>No result</div>
        )}
      </ul>

      {search && (
        <TextField.Slot>
          <CircleX
            size={14}
            className="text-xs cursor-pointer hover:text-gray-300"
            onClick={() => setVal("")}
          />
        </TextField.Slot>
      )}

      <TextField.Slot>
        <span className="text-xs">{filterBooks.length} books total</span>
      </TextField.Slot>

      <TextField.Slot>
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
      </TextField.Slot>
    </TextField.Root>
  );
};
