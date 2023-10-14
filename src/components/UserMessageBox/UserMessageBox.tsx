import React, { useCallback, useState } from "react";
import { useChat } from "../../hooks/AppContext";

const UserMessageBox = () => {
  const { appendChatArray } = useChat();
  const [text, setText] = useState("");

  const handleSubmit = useCallback(() => {
    appendChatArray(text);
    setText("");
  }, [text, appendChatArray]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(event.target.value);
    },
    [],
  );

  return (
    <div className="w-full h-full flex items-center justify-center px-16 py-4">
      <textarea
        value={text}
        placeholder={"Chat with StudyBuddy..."}
        onChange={handleInputChange}
        className="resize-none flex items-center mr-2 py-2 px-4 rounded-lg focus:outline-none focus:ring-0 bg-gray-200 focus:bg-gray-300 w-full h-full"
      />
      <button
        onClick={handleSubmit}
        className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded ml-2"
      >
        Submit
      </button>
    </div>
  );
};

export default UserMessageBox;
