import React, { useEffect } from "react";
import { ContextProvider } from "./hooks/AppContext";
import "./App.css";
import { pdfjs } from "react-pdf";
import ContentBox from "./components/ContentBox";
import UserMessageBox from "./components/UserMessageBox";
import DocumentSelector from "./components/DocumentSelector";
import MiscBox from "./components/MiscBox";
import { initializePinecone } from "./api/api";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  async function pineconeInit() {
    try {
      await initializePinecone();
    } catch (error) {
      console.log("Pinecone init error:", error);
    }
  }

  pineconeInit();

  return (
    <ContextProvider>
      <div className="App flex w-full h-screen">
        <div className="flex flex-col w-3/4 h-full">
          <div className="h-4/5">
            <ContentBox />
          </div>
          <div className="h-1/5">
            <UserMessageBox />
          </div>
        </div>
        <div className="flex flex-col w-1/4 h-full">
          <div className="h-4/5">
            <DocumentSelector />
          </div>
          <div className="h-1/5">
            <MiscBox />
          </div>
        </div>
      </div>
    </ContextProvider>
  );
}

export default App;
