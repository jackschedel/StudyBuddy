import React from "react";
import DocumentBox from "./DocumentBox";
import ResponseBox from "./ResponseBox";

const ContentBox = () => {
  return (
    <div className="flex flex-row h-full">
      <div className="flex-1">
        <ResponseBox />
      </div>
      <div className="flex-1">
        <DocumentBox />
      </div>
    </div>
  );
};

export default ContentBox;
