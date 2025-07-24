"use client";

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { useEffect, useRef } from "react";

GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";

interface PdfViewerMobileProps {
  pdfUrl: string;
}

export function PdfViewerMobile({ pdfUrl }: PdfViewerMobileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRenderingRef = useRef(false);

  useEffect(() => {
    const renderPDF = async () => {
      if (!containerRef.current || isRenderingRef.current) return;

      isRenderingRef.current = true;
      const container = containerRef.current;
      container.innerHTML = "";

      const pdf = await getDocument(pdfUrl).promise;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        const desiredWidth = container.clientWidth;
        const viewport = page.getViewport({ scale: 1 });
        const scale = desiredWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        canvas.style.display = "block";
        canvas.style.margin = "0 auto 16px";
        canvas.style.maxWidth = "100%";
        canvas.style.height = "auto";
        canvas.className = "rounded border";

        if (context) {
          await page.render({ canvasContext: context, viewport: scaledViewport }).promise;
          container.appendChild(canvas);
        }
      }

      isRenderingRef.current = false;
    };

    renderPDF();

    const resizeObserver = new ResizeObserver(() => {
      renderPDF();
    });

    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [pdfUrl]);

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto max-h-[60vh] px-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]"
    />
  );
}