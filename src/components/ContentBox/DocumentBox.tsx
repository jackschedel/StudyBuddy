import React, { useState, useEffect } from "react";
import { useAppContext } from "../../hooks/AppContext";
import { ContextDocument, DocumentType } from "@src/types";
import { Document, Page } from "react-pdf";

const DocumentBox = () => {
  const { contextDocument } = useAppContext();
  const [prevContextDocument, setPrevContextDocument] = useState<ContextDocument | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  if (!contextDocument) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-black">
        <h1 className="text-4xl">No Document Selected</h1>
      </div>
    );
  }

  const isPdf = contextDocument.url.endsWith(".pdf") || contextDocument.url.endsWith("__");

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col justify-start items-center text-black p-5">
      <h1 className="text-4xl">{contextDocument.name}</h1>
      <div className="flex justify-center items-center w-full h-full">
        {isPdf ? (
          <Document
            file={contextDocument.url}
            onLoadSuccess={onDocumentLoadSuccess}
            className="self-center"
          >
            <Page pageNumber={pageNumber} />
          </Document>
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
