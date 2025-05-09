"use client";

import ContentCard from "@/components/ContentCard";
import { routes } from "@/helpers/routes";
import { useModalContent } from "@/hooks/useModal";
import useSession from "@/hooks/useSession";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGetMessagesCount, selectMessageCount } from "@/store/slices/callTrackingSlice";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
 const router = useRouter();
 const auth = useSession();
 const modal = useModalContent();
 const countMessage = useAppSelector(selectMessageCount);
 const userRoutes = routes[auth.role] || [];
 const dispatch = useAppDispatch();

 useEffect(() => {
  dispatch(fetchGetMessagesCount(auth.programCode));
 }, []);

 const filteredRoutes = userRoutes.filter((route) => route.text !== "Início");

 return (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-5 my-5">
   {filteredRoutes.map((item, index) => (
    <ContentCard
     key={index}
     title={item.text}
     bgColor={item.text === "Minhas Pendências" ? "bg-mainlilly" : "bg-colorcard"}
     hasIcon={true}
     svgIcon={item.icon}
     buttonText="Acessar"
     onButtonClick={() => router.push(item.route)}
     customIconText={item.text === "Minhas Pendências" ? " " : undefined}
     customBottomText={item.text === "Minhas Pendências" ? `${countMessage ?? 0} pendentes` : undefined}
     hideButton={item.text === "Minhas Pendências" ? false : undefined}
    />
   ))}
  </div>
 );
};

export default Page;
