import React from "react";
import { useAppContext } from "../../hooks/AppContext";

const ResponseBox = () => {
  const { chatArray } = useAppContext();

  return (
    <div className="w-full h-full flex flex-col text-white">
      <div>
        {chatArray.map((str, index) => (
          <p
            key={index}
            className={`bg-gray-100 border border-gray-500 text-black p-3 rounded-xl m-1 h-auto text-left m-2 ${
              index % 2 === 0 ? "ml-10" : "mr-10"
            }`}
          >
            {str.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ResponseBox;
