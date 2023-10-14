import React, { useState } from "react";
import { useChat } from "../../hooks/AppContext";
import { ContextDocument } from "@src/types";

const DocumentSelector = () => {
  const [selectedTab, setSelectedTab] = useState("assignment");
  const { setContextDocument } = useChat();

  const handleDocumentSelection = (doc: ContextDocument) => {
    setContextDocument(doc);
  };

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
          <SelectorList
            selectedTab={selectedTab}
            handleDocumentSelection={handleDocumentSelection}
          />
        </div>
      </div>
    </div>
  );
};

interface SelectorListProps {
  selectedTab: string;
  handleDocumentSelection: (doc: ContextDocument) => void;
}

const SelectorList: React.FC<SelectorListProps> = ({
  selectedTab,
  handleDocumentSelection,
}) => {
  const lectureNames = ["Lecture 1", "Lecture 2", "Lecture 3"];
  const assignmentNames = ["Assignment 1", "Assignment 2", "Assignment 3"];
  const lectureUrls = ["lurl1", "lurl2", "lurl3"];
  const assignmentUrls = ["aurl1", "aurl2", "aurl3"];

  const names = selectedTab === "lecture" ? lectureNames : assignmentNames;
  const urls = selectedTab === "lecture" ? lectureUrls : assignmentUrls;

  return (
    <div className="w-full h-full flex flex-col text-white">
      {names.map((name, index) => (
        <button
          key={name}
          onClick={() => handleDocumentSelection({ name, url: urls[index] })}
          className="bg-gray-200 border border-gray-800 hover:bg-gray-400 text-black py-3 rounded m-1 h-[50px]"
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default DocumentSelector;
