"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { useLateralMenu } from "@/hooks/useMenus";
import useSession from "@/hooks/useSession";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Ebook } from "@/components/Ebook";
import { Documents } from "@/components/Documents";
import { usePageHeight } from "@/hooks/usePageHeight";
import { Footer } from "@/components/Footer";

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const { isMenuOpen } = useLateralMenu();
  const { role, isLogged } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const verifyHeight = usePageHeight();

  useEffect(() => {
    if (
      !isLogged &&
      pathname !== "/login" &&
      pathname !== "/signin" &&
      pathname !== "/register" &&
      pathname !== "/forget/password" &&
      pathname !== "/signup"
    ) {
      router.push("/");
    }
  }, [isLogged, router, pathname]);

  return (
    <main className="min-h-screen w-screen flex flex-col">
      <div className="md:hidden fixed inset-0 -z-10">
        {/* Mobile background */}
        <Image
          src="/images/lilly_background.jpg"
          alt="Background institucional"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
      </div>

      <div className="flex flex-1 w-full">
        <div className="hidden md:flex w-2/3 relative">
          {/* Desktop background */}
          <Image
            src="/images/lilly_background.jpg"
            alt="Background institucional"
            fill
            className="object-cover rounded-tr-[60px] rounded-br-[60px]"
            priority
          />
          <div className="absolute inset-0 bg-white/40" />
        </div>

        <div className="w-full md:w-1/3 flex items-center justify-center p-4 md:p-12 bg-transparent">
          <div
            className="w-full max-w-md 
            bg-white/80 p-4 md:p-8 mx-4 rounded-2xl shadow-xl backdrop-blur-sm 
            md:bg-transparent md:rounded-none md:shadow-none md:backdrop-blur-none"
          >
            <div className="flex justify-center mb-6">
              {/* Mobile logo */}
              <Image
                src="/images/logo_lilly.png"
                alt="Logo Lilly"
                width={140}
                height={140}
                className="block md:hidden mb-10"
              />

              {/* Desktop logo */}
              <Image
                src="/images/logo_lilly.png"
                alt="Logo Lilly"
                width={320}
                height={320}
                className="hidden md:block mb-10"
              />
            </div>
            {children}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
