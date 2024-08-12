import { useState, useCallback } from "react";
import { pdfjs, Document, Page, Outline } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import styles from "./pdf.module.scss";
import cs from "clsx";
import { TextField } from "@radix-ui/themes";
import { Search as SearchIcon } from "lucide-react";

// use a script copy pdf-dist from node modules to publix
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  // 'pdfjs-dist/build/pdf.worker.min.js',  // for prod env
  "pdfjs-dist/build/pdf.worker.js",
  import.meta.url
).toString();

function highlightPattern(text, pattern) {
  return text.replace(pattern, (value) => `<mark>${value}</mark>`);
}

export default function TestPdf() {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const [searchText, setSearchText] = useState("");

  const textRenderer = useCallback(
    (textItem) => highlightPattern(textItem.str, searchText),
    [searchText]
  );

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function onChangeSearch(event) {
    setSearchText(event.target.value);
  }

  function onItemClick({ pageNumber: pageNum }) {
    setPageNumber(pageNum);
  }

  return (
    <div className={cs("flex flex-col p-4", styles.pdf)}>
      <div
        className={cs(
          "flex items-center w-full h-[60px] justify-between",
          styles.toolbar
        )}
      >
        <div className="flex justify-between items-center">
          <p className="mr-4">
            Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
          </p>

          <button
            type="button"
            disabled={pageNumber <= 1}
            onClick={previousPage}
            className="mr-4 cursor-pointer"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={pageNumber >= numPages}
            onClick={nextPage}
            className="cursor-pointer"
          >
            Next
          </button>
        </div>

        <div className="flex justify-between items-center">
          {/* <label htmlFor="search" className="mr-4">Search:</label> */}

          <TextField.Root
            className="w-[260px] rounded-md"
            placeholder="Search in book"
            value={searchText}
            onChange={onChangeSearch}
            id="search"
            // ref={inputRef}
          >
            <TextField.Slot>
              <SearchIcon size={16} />
            </TextField.Slot>
          </TextField.Root>
        </div>
      </div>

      <Document
        file={"/deep_learning.pdf"}
        onLoadSuccess={onDocumentLoadSuccess}
        // options={{
        //   cMapUrl: '/cmaps/',
        // }}
      >
        <div className="flex flex-row gap-4 max-h-screen overflow-auto">
          <Outline onItemClick={onItemClick} className={styles.outline} />
          <Page pageNumber={pageNumber} className={styles.body} />
        </div>
      </Document>
    </div>
  );
}
