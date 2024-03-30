import { FileSearch } from "lucide-react";
import Image from "next/image";
import DocUploader from "./ui/doc-uploader";

export default function Header() {
  return (
    <div>
    <div className="flex items-center gap-2 tracking-widest">
      <FileSearch size={48} />
      <h1 className="uppercase font-bold text-6xl text-primary">DocTalk.AI</h1>
    </div>
    </div>
  );
}
