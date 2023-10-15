import React, { useState, useEffect } from "react";
import { useAppContext } from "../../hooks/AppContext";
import { generateQuestions } from "../../api/api";

const ResponseBox = () => {
  const { chatArray, contextDocument, docText, setChatArray } = useAppContext();
  const [typing, setTyping] = useState("");
  const typingAnimation = [".", "..", "...", " ..", "  .", ""];
  const [q1, sq1] = useState("");
  const [q2, sq2] = useState("");
  const [q3, sq3] = useState("");
  const [q4, sq4] = useState("");

  async function generateQuestionsFromDoc() {
    try {
      const data = await generateQuestions(docText);
      console.log(data);
    } catch (error) {
      console.log("query agent error:", error);
    }
  }

  useEffect(() => {
    setChatArray([]);

    if (contextDocument) {
      generateQuestionsFromDoc();
    }
  }, [contextDocument]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTyping(typingAnimation[index]);
      index = (index + 1) % typingAnimation.length;
    }, 200); // adjust speed here

    return () => clearInterval(interval);
  }, []);

  return (
<div className="w-full h-full flex flex-col text-white pt-4">
      {(chatArray.length === 0 || !contextDocument) ? (
        <div className="">
    <p className={`bg-gray-100 border border-gray-500 text-gray-500 p-3 rounded-lg m-1 h-auto text-left mx-5`}>
        {!contextDocument ? 'Select a document to begin.' : 'Ask a question about the current document or pick a quick-action.'}
    </p>
    {false && chatArray.length === 0 && contextDocument ? (
      <div>
    <p className={`bg-gray-100 border border-gray-500 text-gray-500 p-3 py-8 rounded-lg m-1 mt-56 my-5 h-auto text-left mx-5`}>
    {q1}
    </p>
    <p className={`bg-gray-100 border border-gray-500 text-gray-500 p-3 py-8 rounded-lg m-1 my-5 h-auto text-left mx-5`}>
    {q2}
    </p>
    <p className={`bg-gray-100 border border-gray-500 text-gray-500 p-3 py-8 rounded-lg m-1 my-5 h-auto text-left mx-5`}>
    {q3}
    </p>
    <p className={`bg-gray-100 border border-gray-500 text-gray-500 p-3 py-8 rounded-lg m-1 my-5 h-auto text-left mx-5`}>
    {q4}
    </p>
    </div>

) : null}
</div>
      ) : (
        <div>
          {chatArray.map((str, index) => (
            <p
              key={index}
              className={`bg-gray-100 border border-gray-500 text-black p-3 rounded-l-xl  rounded-r-lg m-1 h-auto text-left m-2 ${
                index % 2 === 0 ? "ml-10" : "mr-10"
              }`}
            >
              {str.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          ))}
          {chatArray.length % 2 === 1 && (
            <p
            className={`bg-gray-100 border border-gray-500 text-black p-3 rounded-r-xl rounded-l-lg m-1 h-auto text-left m-2 mr-10
            `}          >
            {typing || '\u00A0'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResponseBox;