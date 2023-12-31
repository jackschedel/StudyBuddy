import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../hooks/AppContext";
import { ContextDocument, DocumentType } from "../../types";
import { Document, Page, pdfjs } from "react-pdf";
import { fetchAssignmentHtml } from "../../api/api";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DocumentBox = () => {
  const { contextDocument, setContextDocument, setDocText, docText } =
    useAppContext();
  const [numPages, setNumPages] = useState(0);
  const [text, setText] = useState("");
  const [isHtml, setIsHtml] = useState(false);

  useEffect(() => {
    if (!contextDocument) return;

    if (contextDocument.url.endsWith("history?headless=1")) {
      callFetchDocumentAssignmentHtml();
    }

    console.log(contextDocument);
  }, [contextDocument]);

  async function callFetchDocumentAssignmentHtml() {
    try {
      if (contextDocument) {
        const data = await fetchAssignmentHtml(contextDocument.url);

        if (data) {
          let temp = contextDocument;
          temp.url = data;
          setContextDocument(temp);
          console.log(data);
          setIsHtml(true);
        }
      }
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  }

  useEffect(() => {
    console.log("Document Text: ", docText);
  }, [docText]);

  if (!contextDocument) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
        <h1 className="text-2xl">No Document Selected</h1>
      </div>
    );
  }

  const isPdf =
    contextDocument.url.startsWith("http://localhost:") &&
    contextDocument.url.endsWith(".pdf");

  async function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    if (contextDocument) {
      pdfjs.getDocument(contextDocument.url).promise.then((pdf) => {
        let text = "";
        for (let i = 1; i <= numPages; i++) {
          pdf.getPage(i).then((page) => {
            page.getTextContent().then((textContent) => {
              for (let item of textContent.items) {
                if ("str" in item) {
                  text += item.str + " ";
                }
              }
              setText(text);
              setDocText(text);
            });
          });
        }
      });
    }
  }

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col justify-start items-center text-black p-2">
      <h1 className="text-4xl pt-1 pb-2">{contextDocument.name}</h1>
      <div className="flex justify-center items-center w-full h-full overflow-hidden">
        {isPdf ? (
          <div className="w-full h-full overflow-hidden relative">
            <Document
              file={contextDocument.url}
              onLoadSuccess={onDocumentLoadSuccess}
              className="self-center w-full h-full overflow-auto"
            >
              {Array.from(new Array(numPages), (el, index) => [
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="absolute left-1/2 transform -translate-x-1/2"
                  scale={0.7}
                />,
                numPages > 1 && index < numPages - 1 ? (
                  <div className="h-2" key={`divider_${index + 1}`}></div>
                ) : null,
              ]).reduce((prev, curr) => prev.concat(curr), [])}
            </Document>
          </div>
        ) : isHtml ? (
          <iframe
            src={contextDocument.url}
            className="self-center w-full h-full overflow-auto"
          />
        ) : (
          <p className="self-center overflow-auto">
            ContextDocumentURL: {contextDocument.url}
          </p>
        )}
      </div>
    </div>
  );
};

export default DocumentBox;
