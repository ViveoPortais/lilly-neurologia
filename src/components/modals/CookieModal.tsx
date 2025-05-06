import { useEffect, useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import ToggleSwitch from "../custom/ToggleSwitch";

const EXPIRATION_DAYS = 90;

const cookieCategories = [
 {
  key: "NecessaryCookies",
  title: "Cookies necessários",
  description:
   "Esses cookies e outras tecnologias são essenciais para tornar o site utilizável, permitindo funções básicas, como navegação na página e acesso a áreas seguras do site. Você não pode cancelar o recebimento de cookies ou outras tecnologias “estritamente necessárias” para o serviço, razão pela qual permanecerão sempre ativos.",
  tokens: [
   {
    title: "Cookies necessários",
    content:
     "Esses cookies e tecnologias semelhantes nos permitem lembrar as escolhas que você faz, tais como idioma de preferência ou pesquisa realizadas. Utilizamos esses cookies para lhe proporcionar uma experiência mais adequada às suas seleções e para tornar a sua utilização dos serviços mais personalizada. Se você não permitir esses cookies, alguns ou todos esses serviços podem não funcionar corretamente.",
   },
  ],
 },
 {
  key: "AnalyticalCookies",
  title: "Cookies Analíticos (desempenho)",
  description:
   "Esses cookies e tecnologias semelhantes coletam informações sobre como você interage com os serviços, fornecendo, por exemplo, informações sobre áreas visitadas, tempo de permanência e quaisquer bugs ou problemas em nossa plataforma, nos permitindo melhorar a forma como os serviços são operados.",
  tokens: [
   {
    title: "Cookies Analíticos (desempenho)",
    content: "Esses cookies são usados ​​para monitorar o tráfego e analisar tendências de como os visitantes navegam em nosso site",
   },
  ],
 },
 {
  key: "AdvertisingAndMarketingCookies",
  title: "Cookies de Publicidade e Marketing",
  description:
   "Esses cookies permitem que a Lilly utilize funcionalidades que possam rastrear sua atividade on-line, como Facebook piexels ou métodos de rastreamento semelhantes em redes sociais e sites, conforme descrito em nosso Política de Privacidade. Esses métodos criam um perfil de sua atividade para nossos fins comerciais e comerciais e para permitir que a Lilly forneça ofertas e informações (on-line ou pessoalmente) a você com base em seu perfil, que podem melhorar suas interações profissionais com a Lilly. Você entende que essa função é opcional, mas ao não fornecer o seu consentimento para tratarmos os seus dados pessoais para estes fins, significa que a Lilly terá menos acurácia ao identificar o seu perfil de consumo o que poderá resultar em menos ações de marketing que sejam do seu estrito interesse. Você entende que pode retirar através da opção de configuração de cookies.",
  tokens: [
   {
    title: "Cookies de Publicidade e Marketing",
    content:
     "Esses cookies permitem que a Lilly utilize funcionalidades que possam rastrear sua atividade on-line, como Facebook piexels ou métodos de rastreamento semelhantes em redes sociais e sites, conforme descrito em nosso Política de Privacidade. Esses métodos criam um perfil de sua atividade para nossos fins comerciais e comerciais e para permitir que a Lilly forneça ofertas e informações (on-line ou pessoalmente) a você com base em seu perfil, que podem melhorar suas interações profissionais com a Lilly. Você entende que essa função é opcional, mas ao não fornecer o seu consentimento para tratarmos os seus dados pessoais para estes fins, significa que a Lilly terá menos acurácia ao identificar o seu perfil de consumo o que poderá resultar em menos ações de marketing que sejam do seu estrito interesse. Você entende que pode retirar através da opção de configuração de cookies.",
   },
  ],
 },
];

const CookieModal = ({ onClose }: { onClose: () => void }) => {
 const [expanded, setExpanded] = useState<string | null>(null);
 const [consent, setConsent] = useState({
  AnalyticalCookies: false,
  AdvertisingAndMarketingCookies: false,
 });

 const allEnabled = consent.AnalyticalCookies && consent.AdvertisingAndMarketingCookies;

 const toggleAll = () => {
  const newValue = !allEnabled;
  setConsent({
   AnalyticalCookies: newValue,
   AdvertisingAndMarketingCookies: newValue,
  });
 };

 const saveConsent = () => {
  Cookies.set("NecessaryCookies", "true", { expires: EXPIRATION_DAYS });
  Cookies.set("AnalyticalCookies", consent.AnalyticalCookies.toString(), { expires: EXPIRATION_DAYS });
  Cookies.set("AdvertisingAndMarketingCookies", consent.AdvertisingAndMarketingCookies.toString(), { expires: EXPIRATION_DAYS });
  onClose();
 };

 const acceptOnlyNecessary = () => {
  Cookies.set("NecessaryCookies", "true", { expires: EXPIRATION_DAYS });
  Cookies.set("AnalyticalCookies", "false", { expires: EXPIRATION_DAYS });
  Cookies.set("AdvertisingAndMarketingCookies", "false", { expires: EXPIRATION_DAYS });
  onClose();
 };

 const acceptAllCookies = () => {
  const newConsent = {
   AnalyticalCookies: true,
   AdvertisingAndMarketingCookies: true,
  };

  setConsent(newConsent);

  Cookies.set("NecessaryCookies", "true", { expires: EXPIRATION_DAYS });
  Cookies.set("AnalyticalCookies", "true", { expires: EXPIRATION_DAYS });
  Cookies.set("AdvertisingAndMarketingCookies", "true", { expires: EXPIRATION_DAYS });

  onClose();
 };

 useEffect(() => {
  const analytical = Cookies.get("AnalyticalCookies") === "true";
  const marketing = Cookies.get("AdvertisingAndMarketingCookies") === "true";

  setConsent({
   AnalyticalCookies: analytical,
   AdvertisingAndMarketingCookies: marketing,
  });
 }, []);

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
   <AnimatePresence>
    <motion.div
     initial={{ opacity: 0, y: -20 }}
     animate={{ opacity: 1, y: 0 }}
     exit={{ opacity: 0, y: -20 }}
     transition={{ duration: 0.3 }}
     className="w-full max-w-[1100px] rounded-2xl bg-white p-4 md:p-6 shadow-xl overflow-y-auto max-h-[90vh]"
    >
     <div className="flex flex-col items-center gap-4 mb-6">
      <Image src="/images/LILLY_LOGO.png" alt="Lilly" width={100} height={30} />

      <div className="w-full">
       <h1 className="text-2xl md:text-3xl font-bold text-[#82786f] mb-4">Ajustes de cookie</h1>
       <p className="text-sm text-[#666666] mb-4 leading-relaxed w-full">
        Quando você visita qualquer site, ele pode armazenar ou recuperar informações em seu navegador, principalmente na forma de cookies.
        Essas informações podem ser sobre você, suas preferências ou seu dispositivo e são usadas principalmente para fazer o site funcionar
        como você espera. Os cookies podem ser usados para distingui-lo de outros usuários deste site. Como respeitamos seu direito à
        privacidade, você pode optar por não permitir alguns tipos de cookies. Clique nos diferentes títulos das categorias para saber mais
        e alterar nossas configurações padrão. No entanto, o bloqueio de alguns tipos de cookies pode afetar sua experiência no site e os
        serviços que podemos oferecer. Para obter mais informações consulte nossa Política de Privacidade.
       </p>

       <div className="flex justify-end items-center gap-2">
        <span className="text-sm text-mainlilly">Aceitar todos os cookies</span>
        <ToggleSwitch enabled={consent.AnalyticalCookies && consent.AdvertisingAndMarketingCookies} onChange={toggleAll} />
       </div>
      </div>
     </div>

     <div className="divide-y divide-neutral-200">
      {cookieCategories.map((category) => (
       <div key={category.key} className="py-6 border-t border-neutral-200">
        <div className="flex justify-between flex-col md:flex-row md:items-start gap-4">
         <div className="flex-1">
          <h3 className="text-lg font-bold text-[#82786f] mb-2">{category.title}</h3>

          <p className="text-sm text-[#666666]">{category.description}</p>

          <button
           onClick={() => setExpanded((prev) => (prev === category.key ? null : category.key))}
           className="text-red-600 text-sm font-medium mt-3 hover:underline"
          >
           {expanded === category.key ? "Esconder Cookies" : "Ver Cookies"}
          </button>
         </div>

         {category.key !== "NecessaryCookies" && (
          <div className="mt-4 md:mt-2 self-start md:self-center">
           <ToggleSwitch
            enabled={consent[category.key as keyof typeof consent]}
            onChange={() =>
             setConsent((prev) => ({
              ...prev,
              [category.key]: !prev[category.key as keyof typeof prev],
             }))
            }
           />
          </div>
         )}
        </div>

        <AnimatePresence initial={false}>
         {expanded === category.key && category.tokens.length > 0 && (
          <motion.div
           key="content"
           initial={{ height: 0, opacity: 0 }}
           animate={{ height: "auto", opacity: 1 }}
           exit={{ height: 0, opacity: 0 }}
           transition={{ duration: 0.3 }}
           className="overflow-hidden mt-4 ml-4 border-l-2 border-neutral-200 pl-4"
          >
           {category.tokens.map((token, idx) => (
            <div key={idx} className="mb-4">
             <h4 className="font-semibold text-[#82786f] mb-1">{token.title}</h4>
             <p className="text-sm text-[#666666]">{token.content}</p>
            </div>
           ))}
          </motion.div>
         )}
        </AnimatePresence>
       </div>
      ))}
     </div>

     <div className="border-t border-neutral-200 pt-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Button size={"lg"} onClick={acceptOnlyNecessary} className="py-3 px-6">
       ACEITAR APENAS COOKIES NECESSÁRIOS
      </Button>
      <Button size={"lg"} onClick={saveConsent} className="py-3 px-6">
       AJUSTAR PREFERÊNCIAS
      </Button>
      <Button size={"lg"} onClick={acceptAllCookies} className="py-3 px-6">
       ACEITAR TODOS COOKIES
      </Button>
     </div>
    </motion.div>
   </AnimatePresence>
  </div>
 );
};

export default CookieModal;
