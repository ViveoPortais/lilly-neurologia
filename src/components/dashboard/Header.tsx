"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { IoClose } from "react-icons/io5";

import api from "@/services/api";
import useSession from "@/hooks/useSession";
import { useLateralRightMenu, useMobilelMenu } from "@/hooks/useMenus";
import { routes } from "@/helpers/routes";

import { useProgramColor } from "@/hooks/useProgramColor";
import { useModalAlterPassword } from "@/hooks/useModal";
import { useAppDispatch } from "@/store/hooks";
import { addRepresentative } from "@/store/slices/registerRepresentativeSlice";
import { IRegisterRepresentative } from "@/types/user";

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
    setCurrentRoute("Meus Dados");
    return;
   }

   if (findRoute) {
    setCurrentRoute(findRoute.text);
   } else {
    setCurrentRoute("");
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
     <span className="text-xs font-semibold text-zinc-800 mb-5">Início</span>
     <div
      className={`pl-4 border-l-4 rounded-l-2xl ${pathname.startsWith("/dashboard/starts") ? "border-mainlilly" : "border-transparent"}`}
     >
      <h1 className="text-lg lg:text-2xl font-semibold text-black">Bem-vindo, {auth.name}!</h1>

      {pathname.startsWith("/dashboard/starts") && (
       <span className="text-sm text-zinc-600">
        Aqui você encontra tudo o que precisa para gerenciar suas solicitações de forma mais rápida e intuitiva.
       </span>
      )}
     </div>
    </div>
   </header>
  </>
 );
}
