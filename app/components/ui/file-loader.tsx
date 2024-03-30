import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const AnimatedDots = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) return "";
        return prevDots + ".";
      });
    }, 800); // Adjust the interval duration as needed

    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
};

const Loader = ({ messages }: { messages: string[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let currentIndex = 0;
    const timeouts = messages.map((message, i) => {
      let timeoutDuration;
      switch (i) {
        case 0:
          timeoutDuration = 5000; // 5 seconds
          break;
        case 1:
          timeoutDuration = 60000; // 60 seconds
          break;
        case 2:
          timeoutDuration = 30000; // 30 seconds
          break;
        case 3:
          timeoutDuration = 600000;
          break;
        default:
          timeoutDuration = null;
          break;
      }

      if (timeoutDuration !== null) {
        setTimeout(() => {
          setIndex(i);
        }, currentIndex);
        currentIndex += timeoutDuration;
      }
      return null;
    });

    // Cleanup function to clear timeouts
    return () => {
      // @ts-ignore
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      <p className="mt-2 text-gray-500">
        {messages[index]}
        <AnimatedDots />
      </p>
    </div>
  );
};

export default Loader;
