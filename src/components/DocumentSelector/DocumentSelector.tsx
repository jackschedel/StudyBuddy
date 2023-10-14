import React, { useState } from "react";

const DocumentSelector = () => {
  const [selectedTab, setSelectedTab] = useState("assignment");

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white">
      <div className="w-full flex flex-col h-full">
        <div className="flex h-1/8 items-center justify-center">
          <div className="flex w-1/2 justify-center">
            <button
              className="bg-gray-600 hover:bg-gray-800 text-white py-3 rounded m-1 flex-grow"
              onClick={() => setSelectedTab("assignment")}
            >
              Assignment
            </button>
          </div>
          <div className="flex w-1/2 justify-center">
            <button
              className="bg-gray-600 hover:bg-gray-800 text-white py-3 rounded m-1 flex-grow"
              onClick={() => setSelectedTab("lecture")}
            >
              Lecture
            </button>
          </div>
        </div>

        <div className="h-7/8 h-full">
          <SelectorList selectedTab={selectedTab} />
        </div>
      </div>
    </div>
  );
};

interface SelectorListProps {
  selectedTab: string;
}

const SelectorList: React.FC<SelectorListProps> = ({ selectedTab }) => {
  if (selectedTab === "lecture") {
    return (
      <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white">
        LectureSelector
      </div>
    );
  } else {
    return (
      <div className="w-full h-full bg-pink-600 flex items-center justify-center text-white">
        AssignmentSelector
      </div>
    );
  }
};

export default DocumentSelector;
