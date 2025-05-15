"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

import { PiDotsThreeVerticalBold } from "react-icons/pi";

import useSession from "@/hooks/useSession";
import { useLateralRightMenu, useMobilelMenu } from "@/hooks/useMenus";
import { routes } from "@/helpers/routes";

import { useAppDispatch } from "@/store/hooks";

export function Header() {
 const router = useRouter();
 const pathname = usePathname();
 const auth = useSession();
 const { isMobileMenuOpen, changeMobileMenu } = useMobilelMenu();
 const { isMenuOpen, changeMenu } = useLateralRightMenu();
 const [currentRoute, setCurrentRoute] = useState("");
 const role = auth.role;
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
  if (role !== "") {
   let findRoute = routes[role]?.find((x) => `${x.route}` === pathname) || routes[role]?.find((x) => `${x.route}` === pathname);

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
 }, [auth, pathname]);

 return (
  <>
   <header
    id="mobile-header"
    className="absolute top-0 left-0 right-0 flex lg:hidden h-14 items-center gap-2 pl-4 bg-zinc-200 text-mainlilly rounded-b-2xl z-50"
   >
    <div className="hover:opacity-70 cursor-pointer" onClick={() => changeMobileMenu(false)}>
     <PiDotsThreeVerticalBold size={24} />
    </div>
    <div>
     <Image src={`/images/LILLY_LOGO.png`} width={100} height={50} alt="Programa Neurologia" className="mt-2" />
    </div>
    <div className="flex items-center justify-center gap-6"></div>
   </header>

   <div className="h-10 lg:hidden" />

   <header id="desktop-header" className="hidden lg:flex h-28 w-full items-center justify-between">
    <div className="flex flex-col">
     <div className="text-xs font-semibold text-zinc-600 mb-5 flex items-center gap-1">
      <button className="hover:underline hover:text-mainlilly transition" onClick={() => router.push("/dashboard/starts")}>
       Início
      </button>

      {pathname !== "/dashboard/starts" && currentRoute && (
       <>
        <span className="mx-1">›</span>
        <span className="text-black font-semibold">{currentRoute}</span>
       </>
      )}
     </div>
     <div className={`pl-4 ${pathname.startsWith("/dashboard/starts") ? "border-l-4 rounded-l-2xl border-mainlilly" : ""} `}>
      <h1 className="text-2xl md:text-3xl font-semibold text-black">
       {pathname.startsWith("/dashboard/starts") ? `Bem-vindo, ${auth.name}!` : currentRoute}
      </h1>

      {routeSummary && !pathname.includes("profile") && <span className="text-sm text-zinc-600">{routeSummary}</span>}
     </div>
    </div>
   </header>
  </>
 );
}
