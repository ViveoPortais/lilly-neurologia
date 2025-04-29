interface FooterProps {
 bgColor?: string;
}

export function Footer({ bgColor }: FooterProps) {
 return (
  <footer className={`w-full ${bgColor} text-xs px-4 py-4 text-muted-foreground`}>
   <div className="flex items-center justify-between w-full">
    <div className="flex-shrink-0">
     <img src="/images/LILLY_LOGO.png" alt="Lilly Logo" className="h-14" />
    </div>

    <div className="flex-1 text-center">
     <div className="mb-2 px-2">
      <span>
       Copyright © 2023 Eli Lilly and Company. / Todos os direitos reservados. / PP-AD-BR-0150 – Abril/2025 / Site destinado a profissionais
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

      <a href="#" className="underline">
       Política de Privacidad
      </a>
      <a href="#" className="underline">
       Termos de Uso
      </a>
      <a href="#" className="underline">
       Declaração de privacidade
      </a>
      <a href="#" className="underline">
       Declaração de acessibilidade
      </a>
      <a href="#" className="underline">
       Ajustes de cookies
      </a>
     </div>
    </div>

    <div className="w-10" />
   </div>
  </footer>
 );
}
