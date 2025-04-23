export function Footer() {
  return (
    <footer className="w-full bg-white text-xs text-center px-4 py-6 text-muted-foreground">
      <div className="mb-2 px-4">
        <span>
          Copyright © 2023 Eli Lilly and Company. / Todos os direitos reservados. / PP-SE-BR-0103 – Mai/2024 / Site
          destinado a profissionais de saúde prescritores de medicamentos
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
    </footer>
  );
}
