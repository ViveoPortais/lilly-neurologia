"use client";

import { useCookieModal } from "@/contexts/CookieModalContext";

interface FooterProps {
 bgColor?: string;
}

export function Footer({ bgColor }: FooterProps) {
 const { openCookieModal } = useCookieModal();
 return (
  <footer className={`w-full ${bgColor} text-xs px-4 py-4 text-muted-foreground`}>
   <div className="flex items-center justify-between w-full">
    <div className="flex-shrink-0">
     <img src="/images/LILLY_LOGO.png" alt="Lilly Logo" className="h-14" />
    </div>

    <div className="flex-1 text-center">
     <div className="mb-2 px-2">
      <span>
       Copyright © 2025 Eli Lilly and Company. / Todos os direitos reservados. / PP-AD-BR-0168 – Junho/2025 / Site destinado a profissionais
       de saúde prescritores de medicamentos
      </span>
     </div>

     <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 px-4 text-center">
      <span>
       Contato: 0800 701 0444 /{" "}
       <a href="mailto:sac_brasil@lilly.com" className="underline">
        sac_brasil@lilly.com
       </a>
      </span>

      <a href="https://www.lillyprivacy.com/BR-pt/hcp" target="_blank" rel="noopener noreferrer" className="underline">
       Política de Privacidade
      </a>
      <a href="/files/Regulamento_PSD_Neurologia_vfinal.pdf" target="_blank" rel="noopener noreferrer" className="underline">
       Termos de Uso
      </a>
      <a
       href="https://www.lilly.com/br/declaracao-de-privacidade?redirect-referrer=https%3A%2F%2Fwww.diagnosticocorreto.com.br%2F"
       target="_blank"
       rel="noopener noreferrer"
       className="underline"
      >
       Declaração de privacidade
      </a>
      <a
       href="https://www.lilly.com/br/declaracao-de-acessibilidade?redirect-referrer=https%3A%2F%2Fwww.diagnosticocorreto.com.br%2F"
       target="_blank"
       rel="noopener noreferrer"
       className="underline"
      >
       Declaração de acessibilidade
      </a>
      <a
       href="#"
       className="underline cursor-pointer"
       onClick={(e) => {
        e.preventDefault();
        openCookieModal();
       }}
      >
       Ajustes de cookies
      </a>
     </div>
    </div>

    <div className="w-10" />
   </div>
  </footer>
 );
}
