"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import { HiChevronDoubleLeft, HiUser } from "react-icons/hi";

import { useLateralMenu, useMobilelMenu } from "@/hooks/useMenus";
import { routes } from "@/helpers/routes";
import useSession from "@/hooks/useSession";

import { MenuIcon } from "../custom/Icon";
import { useProgramColor } from "@/hooks/useProgramColor";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import api from "@/services/api";
import { LuLogOut, LuPencil } from "react-icons/lu";
import { MdOutlineLogout } from "react-icons/md";
import { Separator } from "../ui/separator";
import { FiBell } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import NavbarMobile from "../logged/mobile/NavbarMobile";
import NavbarDesktop from "../logged/desktop/NavbarDesktop";
import { motion } from "framer-motion";

export function Navbar() {
 const pathname = usePathname();
 const { isMenuOpen, changeMenu } = useLateralMenu();
 const { isMobileMenuOpen, changeMobileMenu } = useMobilelMenu();
 const auth = useSession();
 const role = auth.role;
 const router = useRouter();
 const generalRoutes = routes[role] || [];
 const isMobile = useMediaQuery("(max-width: 768px)");

 function handleLogout() {
  router.push("/");
  auth.onLogout();
  api.defaults.headers.Authorization = "";
 }

 const mobileMenuVariants = {
  hidden: { opacity: 0, x: "-100%" },
  visible: { opacity: 1, x: "0%", transition: { duration: 0.1 } },
 };

 return isMobile ? (
  <motion.div
   variants={mobileMenuVariants}
   initial="hidden"
   animate={isMobileMenuOpen ? "visible" : "hidden"}
   className="fixed inset-0 z-[999] bg-white flex flex-col w-full p-4 shadow-lg transition-all"
  >
   <NavbarMobile
    changeMobileMenu={changeMobileMenu}
    generalRoutes={generalRoutes}
    handleLogout={handleLogout}
    pathname={pathname}
    auth={auth}
    isMobileMenuOpen={isMobileMenuOpen}
   />
  </motion.div>
 ) : (
  <NavbarDesktop
   auth={auth}
   changeMenu={changeMenu}
   generalRoutes={generalRoutes}
   handleLogout={handleLogout}
   isMenuOpen={isMenuOpen}
   pathname={pathname}
   role={role}
  />
 );

 //  return (
 //   <nav
 //    className={`${
 //     isMenuOpen ? "w-1/6 bg-zinc-100 border-r border-zinc-100" : "w-[100px]"
 //    } hidden lg:flex relative h-full transition-all bg-zinc-100 border-r border-zinc-100 shadow-lg px-4 pb-6 flex-col items-center text-zinc-800`}
 //   >
 //    <div className={`w-full h-28 flex items-center justify-between px-4`}>
 //     <Image src="/images/LILLY_LOGO.png" width={150} height={90} alt="logo" className={`hidden mt-2 ${isMenuOpen && "lg:flex"}`} />

 //     <div
 //      className="flex items-center gap-2 cursor-pointer text-zinc-800 p-2 rounded-lg hover:bg-zinc-100 transition-all"
 //      onClick={() => changeMenu(isMenuOpen)}
 //     >
 //      <MdOutlineLogout size={24} className={`text-red-600 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
 //     </div>
 //    </div>

 //    <ul className={`flex flex-col mt-6 ${!isMenuOpen && "items-center"} gap-2 w-full px-2`}>
 //     {role &&
 //      generalRoutes.map((route) => (
 //       <Link
 //        key={route.route}
 //        href={route.route}
 //        className={`flex gap-x-2 items-center cursor-pointer hover:bg-mainlilly hover:text-white rounded-md py-2 px-3 text-sm transition-colors ${
 //         pathname === route.route ? `bg-mainlilly text-white hover:text-zinc-800` : ""
 //        }`}
 //       >
 //        <MenuIcon icon={route.icon} size={24} />
 //        {isMenuOpen && route.text}
 //       </Link>
 //      ))}
 //    </ul>

 //    <Separator className="bg-mainlilly mt-4" />

 //    <div className="w-full mt-6 px-2" onClick={() => console.log("Abrir modal de notificações")}>
 //     <div
 //      className={`flex items-center justify-between gap-2 p-2 rounded-md hover:bg-zinc-200 cursor-pointer ${
 //       isMenuOpen ? "pl-3 pr-4" : "justify-center"
 //      }`}
 //     >
 //      {isMenuOpen ? (
 //       <>
 //        <div className="flex items-center gap-2">
 //         <FiBell size={22} className="text-zinc-800" />
 //         <span className="text-sm text-zinc-800">Notificações</span>
 //        </div>
 //        <div className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">0</div>
 //       </>
 //      ) : (
 //       <div className="relative">
 //        <FiBell size={22} className="text-zinc-800" />
 //        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
 //         0
 //        </div>
 //       </div>
 //      )}
 //     </div>
 //    </div>

 //    <div className="absolute bottom-4 w-[70%]">
 //     <div className="bg-[#7C6E68] text-white rounded-md flex items-center justify-between px-4 py-2 shadow-md">
 //      <div className="flex items-center gap-3">
 //       <div className="bg-white rounded-full p-1">
 //        <HiUser size={18} className="text-[#7C6E68]" />
 //       </div>
 //       {isMenuOpen && <span className="font-medium text-sm">{auth.name}</span>}
 //      </div>

 //      <DropdownMenu>
 //       <DropdownMenuTrigger asChild>
 //        <button className="text-white">
 //         <PiDotsThreeVerticalBold size={20} />
 //        </button>
 //       </DropdownMenuTrigger>

 //       <DropdownMenuContent side="right" align="end" className="z-[50] bg-white rounded-lg p-2 w-48 shadow-lg border border-zinc-200">
 //        <DropdownMenuItem
 //         onClick={() => router.push("/profile")}
 //         className="cursor-pointer px-3 py-2 rounded-md hover:bg-zinc-100 flex items-center gap-2 text-sm text-zinc-800"
 //        >
 //         <LuPencil className="text-lg" /> Editar Cadastro
 //        </DropdownMenuItem>
 //        <DropdownMenuItem
 //         onClick={handleLogout}
 //         className="cursor-pointer px-3 py-2 rounded-md hover:bg-zinc-100 flex items-center gap-2 text-sm text-zinc-800"
 //        >
 //         <LuLogOut className="text-lg" /> Sair
 //        </DropdownMenuItem>
 //       </DropdownMenuContent>
 //      </DropdownMenu>
 //     </div>
 //    </div>
 //   </nav>
 //  );
}
