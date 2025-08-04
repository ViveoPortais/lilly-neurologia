"use client";

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { useEffect, useRef } from "react";

GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";

interface PdfViewerMobileProps {
  pdfUrl: string;
}

export default function PdfViewerMobile({ pdfUrl }: PdfViewerMobileProps) {
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

        const containerWidth = container.clientWidth;
        const baseScale = 1.5;
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = (containerWidth / unscaledViewport.width) * baseScale;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const ratio = window.devicePixelRatio || 1;
        canvas.width = viewport.width * ratio;
        canvas.height = viewport.height * ratio;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        canvas.style.display = "block";
        canvas.style.margin = "0 auto 16px";
        canvas.className = "rounded border";

        if (context) {
          context.setTransform(ratio, 0, 0, ratio, 0, 0);
          await page.render({ canvasContext: context, viewport } as any).promise;
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

  return <div ref={containerRef} className="overflow-y-auto max-h-[60vh] px-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]" />;
}