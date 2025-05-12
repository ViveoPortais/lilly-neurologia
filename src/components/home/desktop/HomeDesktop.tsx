"use client";
import Image from "next/image";
import { ReactNode } from "react";
import { Footer } from "@/components/Footer";

interface Props {
 children: ReactNode;
}

export default function HomeDesktop({ children }: Props) {
 return (
  <main className="min-h-screen w-screen flex flex-col">
   <div className="flex flex-1 w-full">
    <div className="w-2/3 relative hidden md:flex">
     <Image
      src="/images/home.png"
      alt="Background institucional"
      fill
      className="object-cover rounded-tr-[60px] rounded-br-[60px]"
      priority
      quality={100}
     />
     <div className="absolute inset-0" />
    </div>

    <div className="w-full md:w-1/3 flex items-center justify-center p-12">
     <div className="w-full max-w-md md:p-8 md:bg-transparent md:shadow-none">
      <div className="flex justify-center mb-6">
       <Image src="/images/logo_lilly.png" alt="Logo Lilly" width={320} height={320} className="mb-10" />
      </div>
      {children}
     </div>
    </div>
   </div>

   <Footer bgColor="bg-white" />
  </main>
 );
}
