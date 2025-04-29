import useSession from "@/hooks/useSession";
import { usePathname, useRouter } from "next/navigation";
import { FiBell } from "react-icons/fi";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { LuLayoutDashboard } from "react-icons/lu";

export default function FooterMobile() {
 const router = useRouter();
 const pathname = usePathname();
 const auth = useSession();
 return (
  <div className="fixed bottom-0 left-0 right-0 bg-zinc-100 h-16 flex items-center justify-around shadow-inner rounded-t-2xl">
   <button
    className={`flex flex-col items-center justify-center ${
     pathname === `/dashboard/${auth.role}/pendings` ? "text-mainlilly" : "text-black"
    }`}
    onClick={() => router.push("/recent")}
   >
    <HiOutlineExclamationCircle className="w-6 h-6" />
   </button>

   <button
    className={`flex flex-col items-center justify-center ${
     pathname === "/dashboard/starts" ? "bg-mainlilly text-white rounded-full p-2" : "text-black"
    }`}
    onClick={() => router.push("/dashboard/starts")}
   >
    <LuLayoutDashboard className="w-6 h-6" />
   </button>

   <button className="flex flex-col items-center justify-center text-black" onClick={() => router.push("/notifications")}>
    <FiBell className="w-6 h-6" />
   </button>
  </div>
 );
}
