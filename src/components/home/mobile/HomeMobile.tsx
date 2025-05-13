"use client";
import Image from "next/image";
import { ReactNode } from "react";
import { Footer } from "@/components/Footer";

interface Props {
  children: ReactNode;
}

export default function HomeMobile({ children }: Props) {
  return (
    <main className="min-h-screen w-screen flex flex-col">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/home.png"
          alt="Background institucional"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white/80 p-4 mx-4 rounded-2xl shadow-xl backdrop-blur-sm w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Image src="/images/logo_lilly.png" alt="Logo Lilly" width={140} height={140} className="mb-10" />
          </div>
          {children}
        </div>
      </div>

      <Footer bgColor="bg-white" />
    </main>
  );
}
