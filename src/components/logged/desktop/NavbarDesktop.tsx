import { MenuIcon } from "@/components/custom/Icon";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiBell } from "react-icons/fi";
import { HiUser } from "react-icons/hi";
import { LuLogOut, LuPencil } from "react-icons/lu";
import { MdOutlineLogout } from "react-icons/md";
import { PiDotsThreeVerticalBold } from "react-icons/pi";

export interface NavbarDesktopProps {
 isMenuOpen: boolean;
 changeMenu: (value: boolean) => void;
 generalRoutes: any[];
 role: string;
 pathname: string;
 auth: any;
 handleLogout: () => void;
 handleProtectedRoute: (route: string) => void;
}

export default function NavbarDesktop({
 isMenuOpen,
 changeMenu,
 generalRoutes,
 role,
 pathname,
 auth,
 handleLogout,
 handleProtectedRoute,
}: NavbarDesktopProps) {
 const router = useRouter();
 return (
  <nav
   className={`${
    isMenuOpen ? "w-1/6 bg-zinc-100 border-r border-zinc-100" : "w-[100px]"
   } hidden lg:flex relative h-full transition-all bg-zinc-100 border-r border-zinc-100 shadow-lg px-4 pb-6 flex-col items-center text-zinc-800`}
  >
   <div className={`w-full h-28 flex items-center justify-between px-4`}>
    <Image src="/images/LILLY_LOGO.png" width={150} height={90} alt="logo" className={`hidden mt-2 ${isMenuOpen && "lg:flex"}`} />

    <div
     className="flex items-center gap-2 cursor-pointer text-zinc-800 p-2 rounded-lg hover:bg-zinc-100 transition-all"
     onClick={() => changeMenu(isMenuOpen)}
    >
     <MdOutlineLogout size={24} className={`text-red-600 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
    </div>
   </div>

   <ul className={`flex flex-col mt-6 ${!isMenuOpen && "items-center"} gap-2 w-full px-2`}>
    {role &&
     generalRoutes.map((route) => {
      const isProtected = route.openModal === true;

      return isProtected ? (
       <button
        key={route.route}
        onClick={() => handleProtectedRoute(route.route)}
        className={`flex gap-x-2 items-center w-full cursor-pointer hover:bg-mainlilly hover:text-white rounded-md py-2 px-3 text-sm transition-colors ${
         pathname === route.route ? "bg-mainlilly text-white" : ""
        }`}
       >
        <MenuIcon icon={route.icon} size={24} />
        {isMenuOpen && route.text}
       </button>
      ) : (
       <Link
        key={route.route}
        href={route.route}
        className={`flex gap-x-2 items-center w-full cursor-pointer hover:bg-mainlilly hover:text-white rounded-md py-2 px-3 text-sm transition-colors ${
         pathname === route.route ? "bg-mainlilly text-white" : ""
        }`}
       >
        <MenuIcon icon={route.icon} size={24} />
        {isMenuOpen && route.text}
       </Link>
      );
     })}
   </ul>

   <Separator className="bg-mainlilly mt-4" />

   <div className="w-full mt-6 px-2" onClick={() => console.log("Abrir modal de notificações")}>
    <div
     className={`flex items-center justify-between gap-2 p-2 rounded-md hover:bg-zinc-200 cursor-pointer ${
      isMenuOpen ? "pl-3 pr-4" : "justify-center"
     }`}
    >
     {isMenuOpen ? (
      <>
       <div className="flex items-center gap-2">
        <FiBell size={22} className="text-zinc-800" />
        <span className="text-sm text-zinc-800">Notificações</span>
       </div>
       <div className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">0</div>
      </>
     ) : (
      <div className="relative">
       <FiBell size={22} className="text-zinc-800" />
       <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
        0
       </div>
      </div>
     )}
    </div>
   </div>

   <div className="absolute bottom-4 w-[70%]">
    <div className="bg-[#7C6E68] text-white rounded-md flex items-center justify-between px-4 py-2 shadow-md">
     <div className="flex items-center gap-3">
      <div className="bg-white rounded-full p-1">
       <HiUser size={18} className="text-[#7C6E68]" />
      </div>
      {isMenuOpen && <span className="font-medium text-sm">{auth.name}</span>}
     </div>

     <DropdownMenu>
      <DropdownMenuTrigger asChild>
       <button className="text-white">
        <PiDotsThreeVerticalBold size={20} />
       </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="end" className="z-[50] bg-white rounded-lg p-2 w-48 shadow-lg border border-zinc-200">
       <DropdownMenuItem
        onClick={() => router.push("/dashboard/profile")}
        className="cursor-pointer px-3 py-2 rounded-md hover:bg-zinc-100 flex items-center gap-2 text-sm text-zinc-800"
       >
        <LuPencil className="text-lg" /> Editar Cadastro
       </DropdownMenuItem>
       <DropdownMenuItem
        onClick={handleLogout}
        className="cursor-pointer px-3 py-2 rounded-md hover:bg-zinc-100 flex items-center gap-2 text-sm text-zinc-800"
       >
        <LuLogOut className="text-lg" /> Sair
       </DropdownMenuItem>
      </DropdownMenuContent>
     </DropdownMenu>
    </div>
   </div>
  </nav>
 );
}
