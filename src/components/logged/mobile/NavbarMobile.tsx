import { MenuIcon } from "@/components/custom/Icon";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { HiUser } from "react-icons/hi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { LuLogOut, LuPencil } from "react-icons/lu";
import { FiBell } from "react-icons/fi";
import { Footer } from "@/components/Footer";

interface NavbarMobileProps {
 changeMobileMenu: (value: boolean) => void;
 generalRoutes: any[];
 pathname: string;
 handleLogout: () => void;
 auth?: any;
 isMobileMenuOpen: boolean;
 handleProtectedRoute: (route: string) => void;
}

export default function NavbarMobile({
 changeMobileMenu,
 generalRoutes,
 handleLogout,
 pathname,
 auth,
 isMobileMenuOpen,
 handleProtectedRoute,
}: NavbarMobileProps) {
 const router = useRouter();

 return (
  isMobileMenuOpen && (
   <div className="fixed inset-0 z-[999] bg-white flex flex-col w-full shadow-lg transition-all">
    <div className="flex-1 overflow-y-auto p-4">
     <div className="w-full my-5">
      <div className="flex justify-between items-center w-full mb-5">
       <Image src="/images/LILLY_LOGO.png" width={120} height={60} alt="logo" />
       <button onClick={() => changeMobileMenu(false)}>
        <IoClose size={28} className="text-zinc-700" />
       </button>
      </div>
      <div className="bg-[#7C6E68] text-white rounded-md flex items-center justify-between px-4 py-2 shadow-md">
       <div className="flex items-center gap-3">
        <div className="bg-white rounded-full p-1">
         <HiUser size={18} className="text-[#7C6E68]" />
        </div>
        <span className="font-medium text-sm">{auth.name}</span>
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

     <Separator className="bg-mainlilly mb-4" />

     <div className="text-zinc-700 text-sm font-semibold px-4 mb-2">Plataforma:</div>

     <ul className="flex flex-col gap-2">
      {generalRoutes.map((route) => {
       const isProtected = route.openModal === true;

       return isProtected ? (
        <button
         key={route.route}
         onClick={() => {
          changeMobileMenu(false);
          handleProtectedRoute(route.route);
         }}
         className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md hover:bg-mainlilly hover:text-white w-full text-left ${
          pathname === route.route ? "bg-mainlilly text-white" : "text-zinc-800"
         }`}
        >
         <MenuIcon icon={route.icon} size={24} />
         {route.text}
        </button>
       ) : (
        <Link
         key={route.route}
         href={route.route}
         className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md hover:bg-mainlilly hover:text-white ${
          pathname === route.route ? "bg-mainlilly text-white" : "text-zinc-800"
         }`}
         onClick={() => changeMobileMenu(false)}
        >
         <MenuIcon icon={route.icon} size={24} />
         {route.text}
        </Link>
       );
      })}
     </ul>

     <Separator className="bg-mainlilly mt-6 mb-4" />

     <button className="flex items-center justify-between px-4 py-2 rounded-md hover:bg-zinc-100 text-zinc-800" onClick={() => {}}>
      <div className="flex items-center gap-2">
       <FiBell size={22} className="text-zinc-800" />
       <span className="text-sm text-zinc-800">Notificações</span>
      </div>
      <div className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">0</div>
     </button>
    </div>

    <div className="shrink-0 w-full">
     <Footer bgColor="bg-zinc-100" />
    </div>
   </div>
  )
 );
}
