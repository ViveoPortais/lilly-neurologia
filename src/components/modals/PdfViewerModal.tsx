import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { PdfViewerMobile } from "./PdfViewerMobile";

interface PdfViewerModalProps {
 open: boolean;
 onClose: () => void;
 pdfUrl: string;
 showAgree?: boolean;
 showDisagree?: boolean;
 showDownload?: boolean;
 onAgree?: () => void;
 onDisagree?: () => void;
}

export function PdfViewerModal({
 open,
 onClose,
 pdfUrl,
 showAgree = false,
 showDisagree = false,
 showDownload = false,
 onAgree,
 onDisagree,
}: PdfViewerModalProps) {
 const isMobile = useMediaQuery("(max-width: 768px)");

 return (
  <Dialog open={open} onOpenChange={onClose}>
   <DialogContent className="max-w-5xl w-full h-[80vh] flex flex-col">
    <DialogHeader>
     <DialogTitle>Visualização do Documento</DialogTitle>
    </DialogHeader>

    {isMobile ? <PdfViewerMobile pdfUrl={pdfUrl} /> : <iframe src={pdfUrl} className="flex-1 border rounded" title="Documento PDF" />}

    <DialogFooter className="mt-4 flex justify-between items-center">
     {showDownload && (
      <a href={pdfUrl} download className="text-blue-600 underline text-sm" target="_blank" rel="noopener noreferrer">
       Baixar Documento
      </a>
     )}
     <div className="flex gap-2">
      {showDisagree && (
       <Button variant="outlineMainlilly" onClick={onDisagree}>
        Eu discordo
       </Button>
      )}
      {showAgree && <Button onClick={onAgree}>Eu concordo</Button>}
     </div>
    </DialogFooter>
   </DialogContent>
  </Dialog>
 );
}
