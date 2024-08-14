import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import styles from "./books.module.scss";
import cs from "clsx";
import Head from "next/head";
import Image from "next/image";
import { Book as BookIcon, Folder } from "lucide-react";
import { Flex, Inset, Tooltip } from "@radix-ui/themes";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { formatSize } from "@/lib/utils";
import {BreadcrumbComp, NavProp} from '@/components/breadcrumb'
import {Book} from '@/types/book'
import {useBookStore, State} from '@/store/book-store'
import {shallow} from 'zustand/shallow'

const selector=(s: State)=> ({
  books: s.books,
  setBooks: s.setBooks
})

interface Props {
  className?: string;
}

export default function LocalBooks({ className }: Props) {
  const {books, setBooks}=useBookStore(selector, shallow)
  const router = useRouter();
  const { query } = router;
  const rawQuery = useRef("");
  const mounted = useRef(false);

  const navs=useMemo<NavProp[]>(()=> {
    const first={name: 'All books', link: '/'}

    if(!query.p) return [first]

    let lastLink=''
    const prefix='?p='
    const parts=(query.p as string).split('/').map((v, idx)=> {
      lastLink=[lastLink, v].join('/')
      if(lastLink.startsWith('/')){
        lastLink=lastLink.slice(1)
      }
      return {name: v, link: prefix + lastLink}
    })

    return [first, ...parts]
  }, [query.p])

  useEffect(() => {
    rawQuery.current = location.search;
  }, []);

  const fetchBooks = async (p: string) => {
    if (
      !mounted.current &&
      rawQuery.current.includes("?p=") &&
      p === undefined
    ) {
      // ignore initial stale query.p
      mounted.current = true;
      return;
    }

    const resp = await fetch(`http://localhost:3001/local-books?p=${p || ""}`);
    const data = await resp.json();

    // console.log("fetch books: ", data?.books);

    setBooks(data?.books || []);
  };

  useEffect(() => {
    // fixme: if depends on query.p will trigger twice when page refresh
    fetchBooks(query.p as string);
  }, [query.p]);

  const handleClickBook = (book: Book, is_dir: boolean) => {
    if (is_dir) {
      router.push(
        {
          ...router,
          query: { p: book.prefix },
        },
        undefined,
        { shallow: true }
      );
      return;
    }

    router.push(["/book", book.prefix || "", book.name].join("/"), undefined, {
      shallow: true,
    });
  };

  return (
    <>
      <Head>
        <title>Reader-AI - One-stop personal learning platform</title>
      </Head>

      <div className="w-full">
        <div className="flex items-center w-max h-8 px-2">
          <BreadcrumbComp navs={navs} />
        </div>

        <div className={styles.wrap}>
          {books.map((book) => {
            const { name, coverImg, size, files, createAt } = book;
            const isDir = Array.isArray(files);

            return (
              <div
                key={name}
                className={cs(styles.book, {
                  [styles.isDir]: isDir,
                })}
                onClick={(ev) => handleClickBook(book, isDir)}
              >
                <Flex direction="column" className="gap-y-4 w-full h-full">
                  {isDir ? (
                    <Flex
                      justify="center"
                      align="center"
                      className="relative w-full h-full text-center text-2xl font-light"
                    >
                      <Folder
                        size={16}
                        className="absolute left-1 top-1"
                        color="var(--gray-10)"
                      />
                      <p className="absolute right-1 top-1 text-xs">
                        {files.length || 0} files
                      </p>
                      <p>{name}</p>
                    </Flex>
                  ) : (
                    <>
                      <Inset
                        clip="padding-box"
                        side="top"
                        pb="0"
                        className="relative w-full rounded-t-xl book-cover"
                      >
                        <BookIcon
                          size={16}
                          className="absolute left-1 top-1"
                          color="var(--gray-10)"
                        />
                        <Image
                          src="/img/book_cover.png"
                          width={200}
                          height={120}
                          alt="Book cover placeholder"
                          style={{
                            objectFit: "cover",
                            backgroundColor: "var(--gray-5)",
                          }}
                        />
                      </Inset>

                      <div className="flex flex-1 flex-col justify-between p-1">
                        <Tooltip content={name}>
                          <p className={cs("text-sm", styles.name)}>{name}</p>
                        </Tooltip>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          {createAt && (
                            <p className="">
                              {format(new Date(createAt), "yyyy/MM/dd HH:mm")}
                            </p>
                          )}
                          <p className="justify-end">{formatSize(size || 0)}</p>
                        </div>
                      </div>
                    </>
                  )}
                </Flex>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
