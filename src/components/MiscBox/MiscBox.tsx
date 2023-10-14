import React, { useState } from "react";

const MiscBox = () => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    localStorage.setItem("canvas_api_key", inputValue);
  };

  return (
    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="mr-4 bg-blue-800"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default MiscBox;
