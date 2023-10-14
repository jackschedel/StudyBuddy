import React, { useState } from "react";
import AssignmentSelector from "./AssignmentSelector";
import LectureSelector from "./LectureSelector";

const DocumentSelector = () => {
  const [selectedTab, setSelectedTab] = useState("assignment");

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-blue-600 text-white">
      <div className="w-full flex flex-col h-full">
        <div className="flex h-1/8 items-center justify-center bg-gray-400">
          <button
            className="w-1/2 h-full"
            onClick={() => setSelectedTab("assignment")}
          >
            Assignment
          </button>
          <button
            className="w-1/2 h-full"
            onClick={() => setSelectedTab("lecture")}
          >
            Lecture
          </button>
        </div>

        <div className="h-7/8 h-full">
          {selectedTab === "assignment" && <AssignmentSelector />}
          {selectedTab === "lecture" && <LectureSelector />}
        </div>
      </div>
    </div>
  );
};

export default DocumentSelector;
