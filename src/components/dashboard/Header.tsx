"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { PiDotsThreeVerticalBold } from "react-icons/pi";

import useSession from "@/hooks/useSession";
import { useLateralRightMenu, useMobilelMenu } from "@/hooks/useMenus";
import { routesByProgram, buildDashboardHref, ProgramSlug, AppRole } from "@/helpers/routes";
import { ProgramSelector } from "./ProgramSelector";

import { useAppDispatch } from "@/store/hooks";

export function Header() {
 const router = useRouter();
 const pathname = usePathname();
 const auth = useSession();
 const { isMobileMenuOpen, changeMobileMenu } = useMobilelMenu();
 const { isMenuOpen, changeMenu } = useLateralRightMenu();
 const [currentRoute, setCurrentRoute] = useState("");
 const programSlug = (pathname.includes("/oncologia") ? "oncologia" : "neurologia") as ProgramSlug;
 const role = auth.role as AppRole;

 const generalRoutesRaw = routesByProgram[programSlug]?.[role] ?? [];
 const generalRoutes = generalRoutesRaw.map((item) => ({
  ...item,
  route: buildDashboardHref(programSlug, item.path),
 }));
 const [isModalOpen, setIsModalOpen] = useState(false);
 const dispatch = useAppDispatch();
 const [routeSummary, setRouteSummary] = useState("");

 useEffect(() => {
  if (isMobileMenuOpen) {
   changeMobileMenu(isMobileMenuOpen);
  }

  if (isMenuOpen) {
   changeMenu(isMenuOpen);
  }
 }, [pathname]);

 useEffect(() => {
  if (role) {
   let findRoute = generalRoutes.find((x) => x.route === pathname);

   if (pathname.includes("profile")) {
    setCurrentRoute("Perfil");
    return;
   }

   if (findRoute) {
    setCurrentRoute(findRoute.text);
    setRouteSummary(findRoute.summary || "");
   } else {
    setCurrentRoute("");
    setRouteSummary("");
   }
  }
 }, [auth, pathname, generalRoutes, role]);

 return (
  <>
   <header
    id="mobile-header"
    className="absolute top-0 left-0 right-0 flex lg:hidden h-14 items-center gap-2 pl-4 pr-2 bg-zinc-200 text-mainlilly rounded-b-2xl z-50 justify-between"
   >
    <div className="flex items-center gap-2">
     <div className="hover:opacity-70 cursor-pointer" onClick={() => changeMobileMenu(false)}>
      <PiDotsThreeVerticalBold size={24} />
     </div>
     <div>
      <Image src={`/images/LILLY_LOGO.png`} width={100} height={50} alt="Programa Neurologia" className="mt-2" />
     </div>
    </div>
    
    <ProgramSelector variant="mobile" />
   </header>

   <div className="h-10 lg:hidden" />

   <header id="desktop-header" className="hidden lg:flex h-28 w-full items-center justify-between">
    <div className="flex flex-col">
     <div className="text-xs font-semibold text-zinc-600 mb-5 flex items-center gap-1">
      <button className="hover:underline hover:text-mainlilly transition" onClick={() => router.push(buildDashboardHref(programSlug, "starts"))}>
       Início
      </button>

      {!pathname.includes("/starts") && currentRoute && (
       <>
        <span className="mx-1">›</span>
        <span className="text-black font-semibold">{currentRoute}</span>
       </>
      )}
     </div>
     <div className={`pl-4 ${pathname.includes("/starts") ? "border-l-4 rounded-l-2xl border-mainlilly" : ""} `}>
      <h1 className="text-2xl md:text-3xl font-semibold text-black">
       {pathname.includes("/starts") ? `Bem-vindo, ${auth.name}!` : currentRoute}
      </h1>

      {routeSummary && !pathname.includes("profile") && <span className="text-sm text-zinc-600">{routeSummary}</span>}
     </div>
    </div>

    <ProgramSelector variant="desktop" />
   </header>
  </>
 );
}
