import { useEffect, useState } from "react";
import styles from "./books.module.scss";
import cs from "clsx";
import Head from "next/head";

interface Props {
  className?: string;
}

type Book = {
  // id: string
  name: string;
  // author: string
  // coverImg: string
  size?: number;
  files?: Book[];
};

export default function LocalBooks({ className }: Props) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const resp = await fetch(`http://localhost:3001/local-books`);
      const data = await resp.json();

      setBooks(data?.books || []);
    };

    fetchBooks();
  }, []);

  return (
    <>
      <Head>
        <title>Reader-AI - One-stop personal learning platform</title>
      </Head>

      <div className={styles.wrap}>
        {books.map(({ name, size, files }) => {
          const isDir = Array.isArray(files);

          return (
            <div
              key={name}
              className={cs(styles.book, {
                [styles.isDir]: isDir,
              })}
            >
              <div>{name}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
