import React, { useState } from "react";
import { useAppContext } from "../../hooks/AppContext";
import { ContextDocument, DocumentType } from "@src/types";

const DocumentSelector = () => {
  const [selectedTab, setSelectedTab] = useState<DocumentType>("assignment");
  const { setContextDocument } = useAppContext();

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

const SelectorList: React.FC<{
  selectedTab: DocumentType;
  handleDocumentSelection: (doc: ContextDocument) => void;
}> = ({ selectedTab, handleDocumentSelection }) => {
  const assignmentNames = ["Assignment 1", "Assignment 2", "Assignment 3"];
  const assignmentUrls = [
    "aurl1",
    "https://corsproxy.io/?https://d1mybsg2h91vjj.cloudfront.net/a7Osf9NMhbOx2H7ewyeYrTM7dDUyol/file.pdf?versionId=isdguKLiQYlfAXv8WHCEaMJEyt3ghaVR&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMW15YnNnMmg5MXZqai5jbG91ZGZyb250Lm5ldC9hN09zZjlOTWhiT3gySDdld3llWXJUTTdkRFV5b2wvZmlsZS5wZGY~dmVyc2lvbklkPWlzZGd1S0xpUVlsZkFYdjhXSENFYU1KRXl0M2doYVZSIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNjk3MzA3ODY4fX19XX0_&Key-Pair-Id=K1X4MAECXZ8SUU&Signature=XlTad1Y8Zz5dttMuoLfi7PLrq1oooZ-9YyBXz6DASG42M4Dp0EWQk~C2EmN0rD3PZwy3fJcWT02uHjdVMo6LjsFzMap32Zz3GK4EgGrOHY-8De~tSqonf4K-z8pQKSoOX8bzZoS~0VtPoxHfT~VprgFi9OhJr8K0D9e9CfBMmaHtfUH~os7oGmofmEiAWJv2tcMp~sJhZdv2yiOaEll-qHRyTRfh9d818sKNP9oBI8XGMMnJho52Kx-LMXaqkDjTZno1wQn08lB2jUvpoYXyRHkFJwtyjNq-~SOjNg0aRiFp4uyf0LBFaBER9R-gDckLkiDP4rBUklXNk5EkkxxdgQ__",
    "aurl3",
  ];

  const lectureNames = ["Lecture 1", "Lecture 2", "Lecture 3", "Lec"];
  const lectureUrls = ["lurl1", "lurl2", "lurl3", "whatever"];

  const assignmentDocs: ContextDocument[] = assignmentNames.map((name, i) => ({
    doc_type: "assignment",
    name: name,
    url: assignmentUrls[i],
  }));

  const lectureDocs: ContextDocument[] = lectureNames.map((name, i) => ({
    doc_type: "lecture",
    name: name,
    url: lectureUrls[i],
  }));

  const docs = selectedTab === "lecture" ? lectureDocs : assignmentDocs;

  return (
    <div className="w-full h-full flex flex-col text-white">
      {docs.map((doc) => (
        <button
          key={doc.name}
          onClick={() => handleDocumentSelection(doc)}
          className="bg-gray-200 border border-gray-400 hover:bg-gray-300 hover:border-gray-600 text-black py-3 m-1 h-[50px]"
        >
          {doc.name}
        </button>
      ))}
    </div>
  );
};

export default DocumentSelector;
