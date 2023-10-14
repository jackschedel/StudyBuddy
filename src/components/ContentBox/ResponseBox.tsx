import React from "react";
import chatState from "../../hooks/chatState";

const ResponseBox = () => {
  const { chatArray, appendChatArray } = chatState();

  return (
    <div className="w-full h-full bg-red-600 flex items-center justify-center text-white">
      <div>
        {chatArray.map((str, index) => (
          <p key={index}>{str}</p>
        ))}
      </div>
    </div>
  );
};

export default ResponseBox;
