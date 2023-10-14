import DocumentBox from "./DocumentBox";
import ResponseBox from "./ResponseBox";

const ContentBox = () => {
  return (
    <div className="flex flex-row h-full">
      <div className="flex-grow">
        <ResponseBox />
      </div>
      <div className="flex-grow">
        <DocumentBox />
      </div>
    </div>
  );
};

export default ContentBox;
