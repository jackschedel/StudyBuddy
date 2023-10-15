import React, { useEffect, useRef, useState } from "react";
import { Switch } from "@headlessui/react";

const Modal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [canvasAPIKey, setCanvasAPIKey] = useState(
    localStorage.getItem("canvas_api_key") || "",
  );
  const [openAIKey, setOpenAIKey] = useState(
    localStorage.getItem("openai_api_key") || "",
  );
  const [pineconeKey, setPineconeKey] = useState(
    localStorage.getItem("pinecone_api_key") || "",
  );
  // const [setting1, setSetting1] = useState(false);
  const [canvasIsFocused, setCanvasIsFocused] = React.useState(false);
  const [oaiIsFocused, setOaiIsFocused] = React.useState(false);
  const [pineconeIsFocused, setPineconeIsFocused] = React.useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = () => {
    localStorage.setItem("canvas_api_key", canvasAPIKey);
    localStorage.setItem("openai_api_key", openAIKey);
    localStorage.setItem("pinecone_api_key", pineconeKey);
    // localStorage.setItem("setting1", setting1.toString());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white rounded shadow-lg text-black p-4">
        <button onClick={onClose} className="float-right">
          X
        </button>

        <div className="mb-4">
          <p>Canvas API Key</p>
          <input
            type={canvasIsFocused ? "text" : "password"}
            value={canvasAPIKey}
            onChange={(e) => setCanvasAPIKey(e.target.value)}
            onFocus={() => setCanvasIsFocused(true)}
            onBlur={() => setCanvasIsFocused(false)}
            className="w-full py-2 px-4 rounded-lg focus:outline-none focus:ring-0 bg-gray-200 focus:bg-gray-300"
          />
        </div>

        <div className="mb-4">
          <p>OpenAI API Key</p>
          <input
            type={oaiIsFocused ? "text" : "password"}
            value={openAIKey}
            onChange={(e) => setOpenAIKey(e.target.value)}
            onFocus={() => setOaiIsFocused(true)}
            onBlur={() => setOaiIsFocused(false)}
            className="w-full py-2 px-4 rounded-lg focus:outline-none focus:ring-0 bg-gray-200 focus:bg-gray-300"
          />
        </div>

        <div className="mb-4">
          <p>Pinecone API Key</p>
          <input
            type={pineconeIsFocused ? "text" : "password"}
            value={pineconeKey}
            onChange={(e) => setPineconeKey(e.target.value)}
            onFocus={() => setPineconeIsFocused(true)}
            onBlur={() => setPineconeIsFocused(false)}
            className="w-full py-2 px-4 rounded-lg focus:outline-none focus:ring-0 bg-gray-200 focus:bg-gray-300"
          />
        </div>
        {
          // <div className="mt-2">
          //   <Switch
          //     checked={setting1}
          //     onChange={setSetting1}
          //     className={`${
          //       setting1 ? "bg-blue-600" : "bg-gray-200"
          //     } relative inline-flex items-center h-6 rounded-full w-11 mr-2 my-2`}
          //   >
          //     <span
          //       className={`${
          //         setting1 ? "translate-x-6" : "translate-x-1"
          //       } inline-block w-4 h-4 transform bg-white rounded-full`}
          //     />
          //   </Switch>
          //   <label htmlFor="setting1" className="ml-2">
          //     Setting1
          //   </label>
          // </div>
        }
        <button
          onClick={handleSubmit}
          className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded m-2"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
const MiscBox = () => {
  const [showModal, setShowModal] = useState(false);

  const handleSettingsButton = () => {
    setShowModal(true);
  };

  return (
    <div className="w-full h-full border flex items-center justify-center text-white">
      <button
        onClick={handleSettingsButton}
        className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded"
      >
        Settings
      </button>
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default MiscBox;
