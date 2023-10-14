import React from "react";
import { useChat } from "../../hooks/AppContext";
import { ContextDocument } from "@src/types";

const DocumentBox = () => {
  const { contextDocument } = useChat();

  if (!contextDocument) {
    return (
      <div className="w-full h-full bg-green-600 flex items-center justify-center text-white">
        No contextDocument available
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-green-600 flex items-center justify-center text-white">
      <div>
        <p>ContextDocumentname: {contextDocument.name}</p>
        <p>ContextDocumentURL: {contextDocument.url}</p>
      </div>
    </div>
  );
};

export default DocumentBox;
