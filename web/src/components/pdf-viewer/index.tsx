import { useState, useCallback, useEffect, useRef } from "react";
import { pdfjs, Document, Page, Outline } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import styles from "./pdf.module.scss";
import cs from "clsx";
import { TextField, Button, Switch } from "@radix-ui/themes";
import { Search as SearchIcon } from "lucide-react";
import {useLayoutStore} from '@/store/layout-store'

// use a script copy pdf-dist from node modules to publix
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  // 'pdfjs-dist/build/pdf.worker.min.js',  // for prod env
  "pdfjs-dist/build/pdf.worker.js",
  import.meta.url
).toString();

function highlightPattern(text, pattern) {
  return text.replace(pattern, (value) => `<mark>${value}</mark>`);
}

export interface PdfViewerProps {
  className?: string;
  fileUrl: string;
}

export function PdfViewer({ fileUrl, className }: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  // const [pageWidth, setPageWidth] = useState(800);
  // const [autoScrollMode, setAutoScrollMode] = useState(false); // continue scroll view

  const [currentPage, setCurrentPage] = useState(1);
  const pagesRef = useRef([]);

  const containerRef = useRef(null);
  const [outline, setOutline] = useState([]);

  const {hideSidebar}=useLayoutStore()

  const [useNativeViewer, setUseNativeViewer] = useState(true);

  const fetchFileBlob = async (url: string) => {
    if(!url) return
    try {
      const resp = await fetch(url);
      const buff = await resp.arrayBuffer();
      // setPdfData(new Uint8Array(buff));
      setPdfData(buff)

      // const blob = await resp.blob();
      // setPdfData(new Uint8Array(blob));
    } catch (err) {
      console.error("Error fetching PDF:", err);
    }
  };

  useEffect(() => {
    fetchFileBlob(fileUrl);
  }, [fileUrl]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentPage(Number(entry.target.dataset.pageNumber));
          }
        });
      },
      { threshold: 0.3 } // Trigger when 50% of the page is visible
    );

    pagesRef.current.forEach((page) => {
      if (page) {
        observer.observe(page);
      }
    });

    return () => {
      pagesRef.current.forEach((page) => {
        if (page) {
          observer.unobserve(page);
        }
      });
    };
  }, [numPages]);

  const textRenderer = useCallback(
    (textItem) => highlightPattern(textItem.str, searchText),
    [searchText]
  );

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    pagesRef.current = new Array(numPages).fill(null);
  }

  function changePage(offset: number) {
    setCurrentPage((prevPageNumber) => prevPageNumber + offset);
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
    setCurrentPage(pageNum);
    pagesRef.current[pageNum - 1]?.scrollIntoView({ behavior: 'smooth' });
  }

  const loadOutline = async (pdf) => {
    const outline = await pdf.getOutline();
    setOutline(outline || []);
  };

   const renderOutlineItems = (items, level = 0) => {
    return items.map((item, index) => (
      <div key={index} style={{ marginLeft: `${level * 20}px` }}>
        <button onClick={() => onItemClick(item.dest[0].num)}>
          {item.title}
        </button>
        {item.items && renderOutlineItems(item.items, level + 1)}
      </div>
    ));
  };

  return (
    <div className={cs("flex flex-col p-4 pt-0", styles.pdf)}>
      <div
        className={cs(
          "flex items-center w-full h-[40px] justify-between",
          styles.toolbar
        )}
      >
        <div className="flex justify-between items-center w-full px-4 pl-0">
          <div className="flex items-center" style={{
            visibility: useNativeViewer ? 'hidden' : 'visible'
          }}>
            <p className="mr-4 w-[200px]">
              Page {currentPage || (numPages ? 1 : "--")} of {numPages || "--"}
            </p>

            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={previousPage}
              className="mr-4 cursor-pointer"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={currentPage >= numPages}
              onClick={nextPage}
              className="cursor-pointer"
            >
              Next
            </button>
          </div>

          <div className="flex items-center cursor-pointer mr-8">
            <Switch
              checked={useNativeViewer}
              onCheckedChange={setUseNativeViewer}
              id="native-viewer-toggle"
            />
            <label htmlFor="native-viewer-toggle" className="ml-2">
              Use Native Viewer
            </label>
          </div>
          {/* <Button variant="solid" size='1' className="cursor-pointer mr-8">Native view</Button> */}

          {/* <TextField.Root
            className="w-[260px] rounded-md ml-[100px]"
            placeholder="Search in book"
            value={searchText}
            onChange={onChangeSearch}
            id="search"
            // ref={inputRef}
          >
            <TextField.Slot>
              <SearchIcon size={16} />
            </TextField.Slot>
          </TextField.Root> */}
        </div>
      </div>

      {useNativeViewer ? (
         <iframe
         src={fileUrl}
         width="100%"
         height="100%"
         title="PDF Viewer"
       />
      ) : (
        <Document
        file={pdfData}
        onLoadSuccess={onDocumentLoadSuccess}
        // options={{
        //   // cMapUrl: '/dist/cmaps/',
        //   cMapUrl: 'https://unpkg.com/browse/pdfjs-dist@3.11.174/cmaps/',
        //   cMapPacked: true,
        // }}
      >
        <div className="flex flex-row gap-4 max-h-screen overflow-hidden">
          {/* <div style={{ width: "250px", overflowY: "auto", padding: "10px" }}>
            <h3>Outline</h3>
            {renderOutlineItems(outline)}
          </div> */}
          <Outline onItemClick={onItemClick} className={styles.outline} />
          <div className="flex flex-col max-h-full overflow-auto flex-1">
            {Array.from(new Array(numPages), (el, index) => (
              <div
                key={`page_${index + 1}`}
                ref={(el) => (pagesRef.current[index] = el)}
                data-page-number={index + 1}
              >
                <Page
                  pageNumber={index + 1}
                  className={styles.body}
                  scale={1}
                  customTextRenderer={textRenderer}
                  renderTextLayer
                  renderAnnotationLayer
                  // renderInteractiveForms
                  width={
                    containerRef.current?.clientWidth ||
                    window.innerWidth - 300 - (hideSidebar ? 0 : 200)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </Document>
      )}

     
    </div>
  );
}
