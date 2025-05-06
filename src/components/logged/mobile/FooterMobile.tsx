"use client";

import useSession from "@/hooks/useSession";
import { usePathname, useRouter } from "next/navigation";
import { useKeenSlider } from "keen-slider/react";
import { routes } from "@/helpers/routes";

export default function FooterMobile() {
 const auth = useSession();
 const pathname = usePathname();
 const router = useRouter();

 const currentRoutes = routes[auth.role] || [];

 const [sliderRef] = useKeenSlider<HTMLDivElement>({
  slides: {
   perView: 3,
   spacing: 10,
  },
 });

 return (
  <div className="fixed bottom-0 left-0 right-0 bg-zinc-100 h-20 shadow-inner rounded-t-2xl px-4">
   <div ref={sliderRef} className="keen-slider h-full flex items-center">
    {currentRoutes.map(({ route, icon: Icon }, index) => {
     const isActive = pathname === route;
     return (
      <div key={index} className="keen-slider__slide flex justify-center items-center">
       <button
        onClick={() => router.push(route)}
        className={`flex flex-col items-center justify-center transition-all duration-200 ${
         isActive ? "text-mainlilly scale-110" : "text-black opacity-70 hover:opacity-100"
        }`}
       >
        <Icon className="w-6 h-6" />
       </button>
      </div>
     );
    })}
   </div>
  </div>
 );
}
