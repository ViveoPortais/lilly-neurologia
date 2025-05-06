import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import ReduxProvider from "@/components/redux/ReduxProvider";
import { GenericModalProvider } from "@/contexts/GenericModalContext";
import { PdfModalProvider } from "@/contexts/PdfModalContext";
import { CookieModalProvider } from "@/contexts/CookieModalContext";

const lato = Lato({
 subsets: ["latin"],
 weight: ["400", "700", "900"],
 display: "swap",
});

export const metadata: Metadata = {
 title: "Programa  Lilly",
 description: "Programa Lilly",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang="en">
   <body className={lato.className}>
    <ReduxProvider>
     <PdfModalProvider>
      <GenericModalProvider>
       <CookieModalProvider>
        <ToastProvider>{children}</ToastProvider>
       </CookieModalProvider>
      </GenericModalProvider>
     </PdfModalProvider>
    </ReduxProvider>
   </body>
  </html>
 );
}
