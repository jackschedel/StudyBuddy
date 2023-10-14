import React, { createContext, useContext, useState } from "react";

interface AppContext {
  chatArray: string[];
  appendChatArray: (str: string) => void;
}

const AppContext = createContext<AppContext | undefined>(undefined);

export const useChat = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chatArray, setChatArray] = useState<string[]>([]);

  const appendChatArray = (str: string) => {
    setChatArray((prevArray) => [...prevArray, str]);
  };

  return (
    <AppContext.Provider value={{ chatArray, appendChatArray }}>
      {children}
    </AppContext.Provider>
  );
};
