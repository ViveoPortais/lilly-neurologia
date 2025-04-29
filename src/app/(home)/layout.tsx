"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { useLateralMenu } from "@/hooks/useMenus";
import useSession from "@/hooks/useSession";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import HomeMobile from "@/components/home/mobile/HomeMobile";
import HomeDesktop from "@/components/home/desktop/HomeDesktop";

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const { isMenuOpen } = useLateralMenu();
  const { isLogged } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  return isMobile ? <HomeMobile>{children}</HomeMobile> : <HomeDesktop>{children}</HomeDesktop>;
}
