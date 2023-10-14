import React, { useEffect, useRef, useState } from "react";

const Modal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-5 rounded shadow-lg text-black">
        <button onClick={onClose} className="float-right">
          X
        </button>
        <div>Your content goes here... </div>
      </div>
    </div>
  );
};

const MiscBox = () => {
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSettingsButton = () => {
    setShowModal(true);
  };

  const handleSubmit = () => {
    localStorage.setItem("canvas_api_key", inputValue);
  };

  return (
    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="mr-4 bg-blue-800 w-full"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
      <button
        onClick={handleSettingsButton}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Settings
      </button>
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default MiscBox;
