import { useEffect, useState } from "react";
import styles from "./books.module.scss";
import cs from "clsx";
import Head from "next/head";
import Image from "next/image";
import { Book as BookIcon, Folder } from "lucide-react";
import { Card, Flex, Inset, Tooltip } from "@radix-ui/themes";
import { format } from "date-fns";
import {useRouter} from 'next/router'

interface Props {
  className?: string;
}

type Book = {
  // id: string
  name: string;
  // author: string
  coverImg?: string;
  size?: number;
  files?: Book[];
  createAt?: Date;
  prefix?: string
};

export default function LocalBooks({ className }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const router=useRouter()
  const {query}=router

  const fetchBooks = async (p: string='') => {
    const resp = await fetch(`http://localhost:3001/local-books?p=${p}`);
    const data = await resp.json();

    console.log("fetch books: ", data?.books);

    setBooks(data?.books || []);
  };

  useEffect(() => {
    fetchBooks(query.p as string);
  }, [query.p]);

  const handleClickBook=(book: Book, is_dir: boolean)=> {
    if(is_dir){
      router.push({
        ...router,
        query: {p: book.prefix}
      }, undefined, {shallow: true})
      return
    }

    router.push(['/book',book.prefix || '', book.name].join('/'), undefined, {shallow: true})
  }

  return (
    <>
      <Head>
        <title>Reader-AI - One-stop personal learning platform</title>
      </Head>

      <div className={styles.wrap}>
        {books.map((book) => {
          const { name, coverImg, size, files, createAt }=book
          const isDir = Array.isArray(files);

          return (
            <div
              key={name}
              className={cs(styles.book, {
                [styles.isDir]: isDir,
              })}
              onClick={ev=> handleClickBook(book, isDir)}
            >
              <Flex direction="column" className="gap-y-4 w-full h-full">
                {isDir ? (
                  <Flex
                    justify="center"
                    align="center"
                    className="relative w-full h-full"
                  >
                    <Folder
                      size={16}
                      className="absolute left-1 top-1"
                      color="var(--gray-10)"
                    />
                    <p className="text-center">{name}</p>
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
                      <p className={cs("text-sm", styles.name)}>{name}</p>
                      {createAt && (
                        <p className="text-xs text-gray-500">
                          {format(new Date(createAt), "yyyy/MM/dd HH:mm")}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </Flex>
            </div>
          );
        })}
      </div>
    </>
  );
}
