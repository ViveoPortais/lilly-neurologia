import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MdDownload } from "react-icons/md";
import dynamic from "next/dynamic";

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
  const showActionButtons = showAgree || showDisagree;

  const PdfViewerMobile = dynamic(() => import("@/components/modals/PdfViewerMobile"), { ssr: false });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Visualização do Documento</DialogTitle>
        </DialogHeader>

        {isMobile ? <PdfViewerMobile pdfUrl={pdfUrl} /> : <iframe src={pdfUrl} className="flex-1 border rounded" title="Documento PDF" />}

        <DialogFooter className={`mt-4 flex ${showActionButtons ? "justify-between" : "justify-center"} items-center`}>
          {showDownload && (
            <a
              href={pdfUrl}
              download
              className="bg-mainlilly text-white text-sm font-semibold px-6 py-2 rounded flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MdDownload size={16} />
              Baixar Documento
            </a>
          )}
          {showActionButtons && (
            <div className="flex gap-2">
              {showDisagree && (
                <Button variant="outlineMainlilly" onClick={onDisagree}>
                  Eu discordo
                </Button>
              )}
              {showAgree && <Button onClick={onAgree}>Eu concordo</Button>}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}