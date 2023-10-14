import React, { useEffect, useRef, useState } from "react";
import { Switch } from "@headlessui/react";

const Modal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(
    localStorage.getItem("canvas_api_key") || "",
  );
  const [setting1, setSetting1] = useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

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
    localStorage.setItem("canvas_api_key", inputValue);
    localStorage.setItem("setting1", setting1.toString());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white rounded shadow-lg text-black">
        <button onClick={onClose} className="float-right m-4 mr-5">
          X
        </button>

        <div className="w-full h-full flex items-center justify-center p-4">
          <input
            type={isFocused ? "text" : "password"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="resize-none flex items-center mr-2 py-2 px-4 rounded-lg focus:outline-none focus:ring-0 bg-gray-200 focus:bg-gray-300 w-full h-full"
          />
        </div>
        <div className="mt-2">
          <Switch
            checked={setting1}
            onChange={setSetting1}
            className={`${
              setting1 ? "bg-blue-600" : "bg-gray-200"
            } relative inline-flex items-center h-6 rounded-full w-11 mr-2 my-2`}
          >
            <span
              className={`${
                setting1 ? "translate-x-6" : "translate-x-1"
              } inline-block w-4 h-4 transform bg-white rounded-full`}
            />
          </Switch>
          <label htmlFor="setting1" className="ml-2">
            Setting1
          </label>
        </div>
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
    <div className="w-full h-full border-2 flex items-center justify-center text-white">
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
