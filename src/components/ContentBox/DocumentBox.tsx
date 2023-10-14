import React, { useState, useEffect } from "react";
import { useAppContext } from "../../hooks/AppContext";
import { ContextDocument, DocumentType } from "@src/types";
import { Document, Page } from "react-pdf";

const DocumentBox = () => {
  const { contextDocument } = useAppContext();
  const [prevContextDocument, setPrevContextDocument] =
    useState<ContextDocument | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  if (!contextDocument) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-black">
        <h1 className="text-4xl">No Document Selected</h1>
      </div>
    );
  }

  const isPdf =
    contextDocument.doc_type == "assignment" &&
    contextDocument.url.startsWith("https://corsproxy.io");

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col justify-start items-center text-black p-5">
      <h1 className="text-4xl">{contextDocument.name}</h1>
      <div className="flex justify-center items-center w-full h-full">
        {isPdf ? (
          <div className="w-full h-full overflow-hidden relative">
            <Document
              file={contextDocument.url}
              onLoadSuccess={onDocumentLoadSuccess}
              className="self-center w-full h-full"
            >
              <Page
                pageNumber={pageNumber}
                className="absolute top-[-5%] w-1/2"
              />
            </Document>
          </div>
        ) : (
          <p className="self-center">
            ContextDocumentURL: {contextDocument.url}
          </p>
        )}
      </div>
    </div>
  );
};

export default DocumentBox;
