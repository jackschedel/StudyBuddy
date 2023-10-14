import React, { createContext, useContext, useState } from "react";

interface AppContext {
  chatArray: string[];
  appendChatArray: (str: string) => void;
  document: string;
  setDocument: (str: string) => void;
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
  const [document, setDocument] = useState<string>("No Document Selected!");

  const appendChatArray = (str: string) => {
    setChatArray((prevArray) => [...prevArray, str]);
  };

  return (
    <AppContext.Provider
      value={{ chatArray, appendChatArray, document, setDocument }}
    >
      {children}
    </AppContext.Provider>
  );
};
