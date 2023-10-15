import React, { useCallback, useState, useEffect } from "react";
import { useAppContext } from "../../hooks/AppContext";
import { generateQuestions, queryDocumentQuestion } from "../../api/api";
import { ContextDocument, DocumentType } from "@src/types";

const UserMessageBox = () => {
  const { appendChatArray, contextDocument, chatArray } = useAppContext();
  const [text, setText] = useState("");
  useState<ContextDocument | null>(null);

  const handleSubmit = useCallback(() => {
    if (text.trim() !== "") {
      appendChatArray(text);
      askDocumentQuestion();
      setText("");
    }
  }, [text, appendChatArray]);

  const handleAction = useCallback(() => {
    if (text.trim() !== "") {
      appendChatArray(text);
      askDocumentQuestion();
      setText("");
    }
  }, [text, appendChatArray]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(event.target.value);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const documentText =
    "Why learn data analytics and machine learning? Businesses today often use data to solve complex problems. A business that ignores the data it generates is at a significant disadvantage.";

  async function askDocumentQuestion() {
    try {
      const data = await queryDocumentQuestion(documentText, text);
      console.log(data.response);
      appendChatArray(data.response.output);
    } catch (error) {
      console.log("query agent error:", error);
    }
  }

  async function generateQuestionsFromDoc() {
    try {
      const data = await generateQuestions(documentText);
      console.log(data);
    } catch (error) {
      console.log("query agent error:", error);
    }
  }

  //generateQuestionsFromDoc();

  useEffect(() => {
    if (contextDocument) {
      generateQuestionsFromDoc();
    }
  }, [contextDocument]);

  return (
    <div
      className={`w-full h-full flex items-center justify-center p-4 ${
        (chatArray.length % 2 === 1 || !contextDocument) ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      <textarea
        value={text}
        placeholder={contextDocument ? (chatArray.length % 2 === 1 ? "Wait for StudyBuddy to finish..." : "Chat with StudyBuddy...") : "Select a document first to chat with StudyBuddy."}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={(chatArray.length % 2 === 1 || !contextDocument)}
        className="resize-none flex items-center mr-2 py-2 px-4 rounded-lg focus:outline-none focus:ring-0 bg-gray-200 focus:bg-gray-300 w-full h-full"
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {contextDocument && (
          <button
            onClick={handleAction}
            className={`bg-gray-600 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded ml-2 mb-2
      ${(chatArray.length % 2 === 1 || !contextDocument) ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={(chatArray.length % 2 === 1 || !contextDocument)}
          >
            {contextDocument.doc_type === "assignment"
              ? "Review Missed Questions"
              : "Summarize Document"}
          </button>
        )}
        <button
          onClick={handleSubmit}
          className={`bg-gray-600 hover:bg-gray-800 text-white font-bold py-4 px-12 rounded ml-2 mt-2
    ${(chatArray.length % 2 === 1 || !contextDocument) ? "opacity-70 cursor-not-allowed" : ""}`}
          disabled={(chatArray.length % 2 === 1 || !contextDocument)}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UserMessageBox;
