import React, { createContext, useContext, useState } from "react";
import { ContextDocument } from "@src/types";

interface AppContext {
  chatArray: string[];
  appendChatArray: (str: string) => void;
  contextDocument: ContextDocument| null;
  setContextDocument: (doc: ContextDocument) => void;
}

const AppContext = createContext<AppContext | undefined>(undefined);

export const useChat = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useChat must be used within a ContextProvider");
  }
  return context;
};

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chatArray, setChatArray] = useState<string[]>([]);
  const [contextDocument, setContextDocument] = useState<ContextDocument| null>(null);

  const appendChatArray = (str: string) => {
    setChatArray((prevArray) => [...prevArray, str]);
  };

  return (
    <AppContext.Provider
      value={{ chatArray, appendChatArray, contextDocument, setContextDocument}}
    >
      {children}
    </AppContext.Provider>
  );
};
