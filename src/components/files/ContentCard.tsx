import { useState } from "react";
import { FaFilePdf, FaFileAlt, FaLink } from "react-icons/fa";
import { PdfViewerModal } from "../modals/PdfViewerModal";

interface ContentCardProps {
 item: {
  id: string;
  title: string;
  type: string;
  url: string;
 };
}

export function ContentCard({ item }: ContentCardProps) {
 const [open, setOpen] = useState(false);

 const handleClick = () => {
  if (item.type === "pdf") {
   setOpen(true);
  } else if (item.type === "link") {
   window.open(item.url, "_blank");
  } else {
   const link = document.createElement("a");
   link.href = item.url;
   link.download = "";
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
  }
 };

 const getIcon = () => {
  switch (item.type) {
   case "pdf":
    return <FaFilePdf className="text-mainlilly" size={40} />;
   case "link":
    return <FaLink className="text-blue-500" size={40} />;
   default:
    return <FaFileAlt className="text-gray-500" size={40} />;
  }
 };

 return (
  <>
   <div
    className="rounded-lg bg-[#edf2f7] hover:bg-[#e2e8f0] cursor-pointer p-4 flex items-start gap-3 transition-colors duration-300"
    onClick={handleClick}
   >
    <div className="flex-shrink-0">{getIcon()}</div>
    <p className="text-sm text-zinc-700 break-words leading-snug">{item.title}</p>
   </div>

   {item.type === "pdf" && <PdfViewerModal open={open} onClose={() => setOpen(false)} pdfUrl={item.url} showDownload />}
  </>
 );
}