"use client";

import { useChat } from "ai/react";
import { useMemo, useState } from "react";
import { insertDataIntoMessages } from "./transform";
import { ChatInput, ChatMessages } from "./ui/chat";
import DocUploader from "./ui/doc-uploader";
import { Trash2 } from "lucide-react";

export default function ChatSection() {
  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    reload,
    stop,
    data,
  } = useChat({
    api: process.env.NEXT_PUBLIC_CHAT_API,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const transformedMessages = useMemo(() => {
    return insertDataIntoMessages(messages, data);
  }, [messages, data]);

  const [file, setFile] = useState<File | null>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFileUploading(true);
    try {
      if (!e.target.files?.[0]) {
        throw 0;
      }
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setFile(e.target.files[0]);
      console.log(data);
    } catch (error) {
      alert("Something's not right");
    } finally {
      setIsFileUploading(false);
    }
  };

  const deleteFileHandler = () => {
    setFile(null);
  };

  return (
    <div className="flex w-full max-w-5xl flex-col gap-y-6">
      <>
        <>
          <div className="flex rounded-lg border border-dashed border-input bg-indigo-50 p-3 text-sm text-indigo-950 shadow-xl">
            {!file ? (
              <p>Upload a document to get started</p>
            ) : (
              <p>
                Talking about: <span className="font-medium">{file.name}</span>
              </p>
            )}

            {file ? (
              <Trash2
                className="ml-auto cursor-pointer text-red-600"
                onClick={deleteFileHandler}
              />
            ) : (
              <></>
            )}
          </div>
        </>

        {!Boolean(file) ? (
          <DocUploader onChange={onFileChange} isLoading={isFileUploading} />
        ) : (
          <ChatMessages
            messages={transformedMessages}
            isLoading={isLoading}
            reload={reload}
            stop={stop}
            file={file}
          />
        )}

        <ChatInput
          input={input}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
          multiModal={process.env.NEXT_PUBLIC_MODEL === "gpt-4-vision-preview"}
          disabled={!Boolean(file)}
        />
      </>
    </div>
  );
}
