import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { IconType } from "react-icons/lib";

interface ContentCardProps {
 isCustomBg?: boolean;
 bgColor?: string;
 textColor?: string;
 buttonColor?: string;
 buttonBorderColor?: string;
 title: string;
 subtitle?: string;
 subtitleTwo?: string;
 subtitleThree?: string;
 subtitleFour?: string;
 subtitleFive?: string;
 subtitleSix?: string;
 subtitleSeven?: string;
 textemail?: string;
 textphone?: string;
 buttonText?: string;
 svgIcon?: IconType;
 hasIcon?: boolean;
 hideButton?: boolean;
 isHeight?: boolean;
 isMainCard?: boolean;
 onButtonClick?: () => void;
 showImages?: boolean;
 programCode?: string;
 customBottomText?: string;
 customIconText?: string;
}

const ContentCard = ({
 isCustomBg,
 bgColor = "bg-zinc-100",
 title,
 subtitle,
 subtitleTwo,
 textemail,
 textphone,
 buttonText = "Acessar",
 hideButton,
 subtitleThree,
 subtitleFour,
 subtitleFive,
 subtitleSix,
 subtitleSeven,
 onButtonClick,
 showImages = false,
 programCode,
 hasIcon = false,
 svgIcon: Icon,
 customBottomText,
 customIconText,
}: ContentCardProps) => {
 const sendEmail = () => {
  window.open("mailto:teste@suporteaopaciente.com.br?subject=Subject&body=Body%20goes%20here");
 };

 const calling = () => {
  window.open("tel:0800 000 0000");
 };

 return (
  <div className={`relative w-full h-auto min-h-[150px] md:min-h-[150px] rounded-xl p-4 flex flex-col justify-between ${bgColor}`}>
   {hasIcon && Icon && (
    <div className="absolute top-4 right-4 flex flex-col items-center">
     <Icon className={`w-8 h-8 ${title === "Minhas Pendências" ? "text-white" : "text-black"}`} />
     {customIconText && <span className="text-xs text-white mt-1">{customIconText}</span>}
    </div>
   )}

   <div className={`${title === "Minhas Pendências" ? "text-white" : "text-black"} text-base flex flex-col gap-1 pr-10`}>
    <span className="text-xl font-semibold">{title}</span>
    {subtitle && <span className="text-sm">{subtitle}</span>}
    {subtitleTwo && <span className="text-sm">{subtitleTwo}</span>}
    {(subtitleThree || subtitleFour || subtitleFive || subtitleSix) && (
     <div className="flex flex-col text-sm">
      {subtitleThree && <span>{subtitleThree}</span>}
      {subtitleFour && <span>{subtitleFour}</span>}
      {subtitleFive && <span>{subtitleFive}</span>}
      {subtitleSix && <span>{subtitleSix}</span>}
     </div>
    )}
    {subtitleSeven && <span className="text-sm">{subtitleSeven}</span>}
    {textemail && (
     <span onClick={sendEmail} className="text-sm font-medium text-careDarkBlue cursor-pointer hover:underline">
      {textemail}
     </span>
    )}
    {textphone && (
     <span onClick={calling} className="text-lg font-bold text-careDarkBlue cursor-pointer hover:underline">
      {textphone}
     </span>
    )}
   </div>

   {showImages && (
    <div className="flex flex-wrap gap-4 mt-3">
     <Image src="/images/logo-rare.png" width={programCode === "987" ? 180 : 200} height={100} alt="Logo Rare" />
     <a href="https://www.sanoficonecta.com.br/" target="_blank" rel="noopener noreferrer">
      <Image src="/images/logo-conecta.png" width={programCode === "987" ? 180 : 200} height={80} alt="Logo Conecta" />
     </a>
     {programCode === "987" && (
      <a href="https://www.labcorplink.com/ui/#/login" target="_blank" rel="noopener noreferrer">
       <Image src="/images/logo-LabCorp.png" width={180} height={80} alt="Logo LabCorp" />
      </a>
     )}
    </div>
   )}

   {customBottomText && Icon && (
    <div className="text-xs font-semibold text-white flex items-center gap-1 md:absolute md:bottom-4 md:right-4 mt-2 md:mt-0">
     {customBottomText}
     <Icon className={`w-4 h-4 ${title === "Minhas Pendências" ? "text-white" : "text-black"}`} />
    </div>
   )}

   {!hideButton && (
    <div className="mt-4">
     <Button
      size="sm"
      className={`${
       title === "Minhas Pendências"
        ? "bg-white text-black border border-white hover:bg-white/90"
        : "bg-mainlilly text-white hover:bg-mainlilly/90"
      } font-semibold`}
      onClick={onButtonClick}
     >
      {buttonText}
     </Button>
    </div>
   )}
  </div>
 );
};

export default ContentCard;
