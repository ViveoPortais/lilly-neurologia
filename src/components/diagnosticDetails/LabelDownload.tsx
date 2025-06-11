import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { downloadBase64File } from "@/helpers/fileHelper";
import { AttachmentModel } from "@/types/diagnostic";

interface LabelDownloadsProp {
  file: AttachmentModel;
}

export default function LabelDownload({file}: LabelDownloadsProp) {
  return (
    <div className="border border-gray-400 rounded rounded-2xl p-4 w-full">
      <h1 className="text-xl text-center mb-4">Download de Etiqueta para Logística</h1>
      <div className="w-full flex flex-col items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            downloadBase64File(file.documentBody!, file.fileName!, file.contentType!);
          }}
          className="w-full md:w-[250px] h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
        >
          <Download className="w-4 h-4 mr-2" />
          Download da Etiqueta
        </Button>
      </div>
    </div>
  );
}