"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FORMATS = [".pdf", ".jpg", ".jpeg", ".png"];

interface UploadButtonProps {
 fieldName: string;
 label: string;
 onFileValid: (file: File) => void;
 onError?: (message: string) => void;
 errorMessage?: string;
 disabled?: boolean;
}

export const UploadButton = ({ fieldName, label, onFileValid, onError, errorMessage, disabled }: UploadButtonProps) => {
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [fileName, setFileName] = useState("");

 const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  const sizeMB = file.size / (1024 * 1024);

  const isValidExtension = ACCEPTED_FORMATS.includes(extension);
  const isValidSize = sizeMB <= MAX_FILE_SIZE_MB;

  if (!isValidExtension || !isValidSize) {
   setFileName("");
   onError?.("O arquivo deve ser PDF, JPG ou PNG e ter no máximo 5MB.");
   event.target.value = "";
   return;
  }

  setFileName(file.name);
  onFileValid(file);
 };

 return (
  <div className="w-full flex flex-col items-center gap-2">
   <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={ACCEPTED_FORMATS.join(",")} className="hidden" />

   <Button
    type="button"
    variant="ghost"
    className="w-full h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
    onClick={() => fileInputRef.current?.click()}
    disabled={disabled}
   >
    <Upload className="w-4 h-4 mr-2" />
    {label}
   </Button>

   {fileName && (
    <p className="text-xs text-zinc-600 text-center">
     Arquivo selecionado: <span className="font-medium">{fileName}</span>
    </p>
   )}

   {errorMessage && <span className="text-sm text-red-500 block text-center">{errorMessage}</span>}
  </div>
 );
};
