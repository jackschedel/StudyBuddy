import { useChat } from '../../hooks/chatContext';

const ResponseBox = () => {
  const { chatArray } = useChat();

  return (
    <div className="w-full h-full bg-red-600 flex items-center justify-center text-white">
      <div>
        {chatArray.map((str, index) => (
          <p key={index}>{str}</p>
        ))}
      </div>
    </div>
  );
};

export default ResponseBox;
