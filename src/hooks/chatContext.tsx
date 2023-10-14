import React, { createContext, useContext, useState } from 'react';

interface IChatContext {
  chatArray: string[];
  appendChatArray: (str: string) => void;
}

const ChatContext = createContext<IChatContext | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC = ({ children }) => {
  const [chatArray, setChatArray] = useState<string[]>([]);

  const appendChatArray = (str: string) => {
    setChatArray(prevArray => [...prevArray, str]);
  };

  return (
    <ChatContext.Provider value={{ chatArray, appendChatArray }}>
      {children}
    </ChatContext.Provider>
  );
};
