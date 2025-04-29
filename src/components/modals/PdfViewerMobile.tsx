"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface PdfViewerMobileProps {
 pdfUrl: string;
}

export function PdfViewerMobile({ pdfUrl }: PdfViewerMobileProps) {
 return (
  <div className="overflow-y-auto max-h-[60vh] p-2">
   <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
    <Viewer fileUrl={pdfUrl} />
   </Worker>
  </div>
 );
}
