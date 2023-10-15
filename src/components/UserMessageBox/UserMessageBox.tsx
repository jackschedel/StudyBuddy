import React, { useCallback, useState, useEffect } from "react";
import { useAppContext } from "../../hooks/AppContext";
import { generateQuestions, queryDocumentQuestion } from "../../api/api";
import { ContextDocument, DocumentType } from "@src/types";

const UserMessageBox = () => {
  const { appendChatArray, contextDocument } = useAppContext();
  const [text, setText] = useState("");
  useState<ContextDocument | null>(null);

  const handleSubmit = useCallback(() => {
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

  const documentText = "Why learn data analytics and machine learning? Businesses today often use data to solve complex problems. A business that ignores the data it generates is at a significant disadvantage.";

  async function askDocumentQuestion() {
    try {
      const data = await queryDocumentQuestion(documentText, text);
      console.log(data.response)
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
    <div className="w-full h-full flex items-center justify-center p-4">
      <textarea
        value={text}
        placeholder={"Chat with StudyBuddy..."}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="resize-none flex items-center mr-2 py-2 px-4 rounded-lg focus:outline-none focus:ring-0 bg-gray-200 focus:bg-gray-300 w-full h-full"
      />
      <button
        onClick={handleSubmit}
        className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded ml-2"
      >
        Submit
      </button>
    </div>
  );
};

export default UserMessageBox;
