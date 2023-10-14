import React from "react";
import { ContextProvider } from "./hooks/AppContext";
import "./App.css";
import ContentBox from "./components/ContentBox";
import UserMessageBox from "./components/UserMessageBox";
import DocumentSelector from "./components/DocumentSelector";
import MiscBox from "./components/MiscBox";
import { fetchAssignments } from "./api/getAssignments.js";
import { useEffect } from "react";

function App() {
  // useEffect(() => {
  //   async function callFetchAssignments() {
  //     try {
  //       const assignments = await fetchAssignments(courseId); // replace courseId with the actual course id
  //       console.log(assignments);
  //     } catch (error) {
  //       console.log('Error:', error);
  //     }
  //   }
  //
  //   callFetchAssignments();
  // }, []);

  return (
    <ContextProvider>
      <div className="App flex w-full h-screen">
        <div className="flex flex-col w-3/4 h-full">
          <div className="h-4/5">
            <ContentBox />
          </div>
          <div className="h-1/5">
            <UserMessageBox />
          </div>
        </div>
        <div className="flex flex-col w-1/4 h-full">
          <div className="h-4/5">
            <DocumentSelector />
          </div>
          <div className="h-1/5">
            <MiscBox />
          </div>
        </div>
      </div>
    </ContextProvider>
  );
}

export default App;
