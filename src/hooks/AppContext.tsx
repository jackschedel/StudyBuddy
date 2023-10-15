import React, { createContext, useContext, useState } from "react";
import { ContextDocument, DocumentType } from "@src/types";

interface AppContext {
  chatArray: string[];
  appendChatArray: (str: string) => void;
  contextDocument: ContextDocument | null;
  setContextDocument: (doc: ContextDocument) => void;
  fetchedCanvasData: any | null;
  setFetchedCanvasData: (data: any) => void;
}

const AppContext = createContext<AppContext | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a ContextProvider");
  }
  return context;
};

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chatArray, setChatArray] = useState<string[]>([]);
  const [contextDocument, setContextDocument] =
    useState<ContextDocument | null>(null);
  const [fetchedCanvasData, setFetchedCanvasData] = useState<any | null>(null);

  const appendChatArray = (str: string) => {
    setChatArray((prevArray) => [...prevArray, str]);
  };

  return (
    <AppContext.Provider
      value={{
        chatArray,
        appendChatArray,
        contextDocument,
        setContextDocument,
        fetchedCanvasData,
        setFetchedCanvasData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
