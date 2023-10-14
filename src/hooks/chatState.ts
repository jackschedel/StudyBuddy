import { useState } from "react";

const useAddChat = () => {
  const [chatArray, setChatArray] = useState<string[]>(["owo"]);

  const appendChatArray = (str: string) => {
    setChatArray((prevArray) => [...prevArray, str]);
  };

  return {
    chatArray,
    appendChatArray,
  };
};

export default useAddChat;
