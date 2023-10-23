import React, { useState, useEffect } from "react";
import { useAppContext } from "../../hooks/AppContext";
import { ContextDocument, DocumentType } from "../../types";
import {
  fetchAll,
  fetchAnnouncements,
  fetchCourseFiles,
  fetchCourses,
  fetchCourseTasks,
} from "../../api/api";

const DocumentSelector = () => {
  const [selectedTab, setSelectedTab] = useState<DocumentType>("assignment");
  const { setContextDocument, setChatArray } = useAppContext();
  const [selectedCourseId, setSelectedCourseId] = useState<null | number>(null);
  const [courseData, setCourseData] = useState<any>(null);
  const [canvasApiKey, setCanvasApiKey] = useState<string | null>(null);

  useEffect(() => {
    setChatArray([]);
  }, [selectedTab]);

  useEffect(() => {
    setChatArray([]);
  }, [selectedCourseId]);

  const handleDocumentSelection = (doc: ContextDocument) => {
    setContextDocument(doc);
  };

  async function callFetchCourseList() {
    try {
      const data = await fetchCourses();
      setCourseData(data);
      console.log("courses fetched");
      console.log(data);
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  }

  async function callFetchAnnouncements(courseId: number) {
    try {
      const data = await fetchAnnouncements(courseId);
      console.log("announcements:");
      console.log(data);
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("canvas_api_key") != canvasApiKey) {
      setCanvasApiKey(localStorage.getItem("canvas_api_key"));
      callFetchCourseList();
    }
  }, []);

  useEffect(() => {
    console.log("selected course id: " + selectedCourseId);
  }, [selectedCourseId]);

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseId(Number(event.target.value));
    callFetchAnnouncements(Number(event.target.value));
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
              className={`${
                selectedTab === "assignment"
                  ? "bg-gray-900 hover:bg-gray-800"
                  : "bg-gray-600 hover:bg-gray-500"
              } text-white py-3 rounded m-1 flex-grow`}
              onClick={() => setSelectedTab("assignment")}
            >
              Assignments
            </button>
          </div>
          <div className="flex w-1/2 justify-center">
            <button
              className={`${
                selectedTab === "lecture"
                  ? "bg-gray-900 hover:bg-gray-800"
                  : "bg-gray-600 hover:bg-gray-500"
              } text-white py-3 rounded m-1 flex-grow`}
              onClick={() => setSelectedTab("lecture")}
            >
              Materials
            </button>
          </div>
        </div>

        <div className="h-6/8 h-full">
          <SelectorList
            selectedTab={selectedTab}
            handleDocumentSelection={handleDocumentSelection}
            selectedCourseId={selectedCourseId}
          />
        </div>
      </div>
    </div>
  );
};

const SelectorList: React.FC<{
  selectedTab: DocumentType;
  handleDocumentSelection: (doc: ContextDocument) => void;
  selectedCourseId: number | null;
}> = ({ selectedTab, handleDocumentSelection, selectedCourseId }) => {
  const [courseData, setCourseData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // New state variable

  useEffect(() => {
    async function callFetchData() {
      setIsLoading(true); // Set loading status to true when fetching data
      try {
        let data;
        if (selectedCourseId) {
          if (selectedTab == "assignment") {
            data = await fetchCourseTasks(selectedCourseId);
          } else {
            data = await fetchCourseFiles(selectedCourseId);
          }
        }
        if (data) {
          setCourseData(data);
        } else {
          setCourseData([]);
        }
      } catch (error) {
        console.log("Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    callFetchData();
  }, [selectedTab, selectedCourseId]);

  let docs: ContextDocument[];

  if (selectedTab === "assignment") {
    docs = courseData.reduce((acc: ContextDocument[], course) => {
      const existingIndex = acc.findIndex(
        (item) => item.name === (course.name ? course.name : course.title),
      );

      if (existingIndex !== -1) {
        if (course.title) {
          // If the course.title is not null, replace the existing item
          acc[existingIndex] = {
            doc_type: selectedTab,
            name: course.title,
            url: course.html_url,
            text: "",
          };
        }
      } else {
        // If it doesn't exist yet, add to the accumulator
        acc.push({
          doc_type: selectedTab,
          name: course.name ? course.name : course.title,
          url: course.html_url,
          text: "",
        });
      }

      return acc;
    }, []);
  } else {
    docs = courseData.map((course) => ({
      doc_type: selectedTab,
      name: course.display_name,
      url: course.url,
      text: "",
    }));
  }

  docs = docs.filter(
    (doc: ContextDocument) => doc.name !== undefined && doc.name !== "",
  );

  return (
    <div className="w-full h-full flex flex-col text-white overflow-y-auto">
      {isLoading || docs.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          {isLoading ? (
            <div className="text-black">Loading...</div>
          ) : (
            <div className="text-black">No Items Found.</div>
          )}
        </div>
      ) : (
        docs.map((doc) => (
          <button
            key={doc.name}
            onClick={() => handleDocumentSelection(doc)}
            className="bg-gray-200 border border-gray-400 hover:bg-gray-300 hover:border-gray-600 text-black px=1 py-1 m-1 w-full text-sm"
          >
            {doc.name}
          </button>
        ))
      )}
    </div>
  );
};

export default DocumentSelector;
