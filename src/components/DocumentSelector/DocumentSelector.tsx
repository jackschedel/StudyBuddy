import React, { useState, useEffect } from "react";
import { useAppContext } from "../../hooks/AppContext";
import { ContextDocument, DocumentType } from "@src/types";
import { fetchCourses } from "../../api/canvas-interface";

const DocumentSelector = () => {
  const [selectedTab, setSelectedTab] = useState<DocumentType>("assignment");
  const { setContextDocument } = useAppContext();
  const [selectedCourseId, setSelectedCourseId] = useState<null | number>(null);
  const [courseData, setCourseData] = useState<any[]>([]);

  const handleDocumentSelection = (doc: ContextDocument) => {
    setContextDocument(doc);
  };

  useEffect(() => {
    async function callFetchData() {
      try {
        const data = await fetchCourses();
        setCourseData(data);
      } catch (error) {
        console.log("Fetch Error:", error);
      }
    }

    callFetchData();
  }, []);

  useEffect(() => {
    console.log(selectedCourseId);
  }, [selectedCourseId]);

  useEffect(() => {
    console.log(courseData);
  }, [courseData]);

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseId(Number(event.target.value));
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white">
      <div className="w-full flex flex-col h-full">
        <div className="flex h-1/8 items-center justify-center">
          <select
            onChange={handleCourseChange}
            className={`w-full bg-gray-100 hover:bg-gray-200 text-black py-3 rounded m-1 border-2 border-gray-400`}
          >
            {!courseData || !courseData.length ? (
              <option>Loading Courses...</option>
            ) : (
              courseData.map((course: { id: number; name: string }) => {
                if (!course.name) {
                  return null;
                }

                return (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                );
              })
            )}
          </select>
        </div>

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

        <div className="h-6/8 h-full">
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
    "https://corsproxy.io/?https://d1mybsg2h91vjj.cloudfront.net/idcKVqRBdKilRtxr-p7pYHsVSWxJtP/file.pdf?versionId=D0rRWpPc1ikJjuRb6nF5hB5QxWkUHRd2&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMW15YnNnMmg5MXZqai5jbG91ZGZyb250Lm5ldC9pZGNLVnFSQmRLaWxSdHhyLXA3cFlIc1ZTV3hKdFAvZmlsZS5wZGY~dmVyc2lvbklkPUQwclJXcFBjMWlrSmp1UmI2bkY1aEI1UXhXa1VIUmQyIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNjk3MzE3NTgxfX19XX0_&Key-Pair-Id=K1X4MAECXZ8SUU&Signature=DnE3YRLgL2LvwA~i-6n2g5k7PgC5ok7TTnJduxU4Vv2JJPv-XQ9P6qZGd4uOM77ytsCckBYHQJriwucPt3OKRo4a68zRBtzCRf6wZFth94ysdOD3xUdYhYwnY-5rOoeDvZqtNz38-RAG1gUBfWv5YY2-rbgYaMIuDW08Tv62CO0y7y5JE4G3iJYW-vHAjsC7Nx1knn-JEOqdb2tbYoHfeEW-VoRLeP5Q56TUu9E2Wro-B3Nl-ZloUehp2cS5Ty04sIRj0Bazp9RT9IWHgQETAr9jem8E00bs4lLiVYWvTTt2HEx7ol1JhBNHY2k4ob3mWFiOMIgCFD30KUf9d2CTuA__",
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
