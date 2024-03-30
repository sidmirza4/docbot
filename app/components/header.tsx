import { FileSearch } from "lucide-react";
import Image from "next/image";
import DocUploader from "./ui/doc-uploader";

export default function Header() {
  return (
    <div>
      <div className="flex items-center gap-2 tracking-widest">
        <FileSearch className="h-7 w-7" />
        <h1 className="text-3xl font-bold uppercase text-primary md:text-3xl">
          DocTalk.AI
        </h1>
      </div>
    </div>
  );
}
