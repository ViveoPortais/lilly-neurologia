"use client";

import { HiX, HiCheck } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import dayjs from "dayjs";
import { routes } from "@/helpers/routes";
import { IStringMap } from "@/types";
import useSession from "@/hooks/useSession";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

interface Notification {
  id: string;
  name: string;
  description: string;
  createdOn?: string;
  statusCodeStringMap?: IStringMap;
}

interface NotificationContentProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function NotificationContent({ notifications, onMarkAsRead, onRemove }: NotificationContentProps) {
  const router = useRouter();
  const { role } = useSession();

  const renderContent = useCallback(
    (text: string) => {
      const profileRoutes = role ? routes[role] : [];

      if (!profileRoutes || profileRoutes.length === 0) return text;

      let matchedRoute: string | undefined;
      let matchedText: string | undefined;

      for (const route of profileRoutes) {
        if (text.toLowerCase().includes(route.text.toLowerCase())) {
          matchedRoute = route.route;
          matchedText = route.text;
          break;
        }
      }

      if (!matchedRoute || !matchedText) return text;

      const [before, after] = text.split(new RegExp(matchedText, "i"));

      return (
        <>
          {before}
          <span onClick={() => router.push(matchedRoute!)} className="text-gray-800 underline text-red-600 cursor-pointer">
            {matchedText}
          </span>
          {after}
        </>
      );
    },
    [router, role]
  );

  return (
    <div className="flex">
      <div className="w-[6px] bg-mainlilly rounded-l-md" />

      <div className="flex-1 p-4 max-h-[500px] overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma notificação disponível.</p>
        ) : (
          <ul className="space-y-5">
            {notifications.map((n) => (
              <li key={n.id} className={`flex justify-between items-start gap-3 border-b pb-2 ${n.statusCodeStringMap?.flag === "#READ" ? "opacity-70" : ""}`}>
                <div className="flex-1 text-sm text-gray-800 leading-snug text-left">
                  <span className="block">{renderContent(n.description)}</span>
                  <div className="mt-3 flex gap-1 text-xs text-gray-500">
                    <span>{dayjs(n.createdOn).format("DD [de] MMMM [de] YYYY")}</span>
                    <span>•</span>
                    <span>{dayjs(n.createdOn).format("HH:mm")}h</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => onMarkAsRead(n.id)} className="text-green-600 hover:text-green-800" title="Marcar como lida">
                    <HiCheck size={18} />
                  </button>

                  <button onClick={() => onRemove(n.id)} className="text-red-500 hover:text-red-700" title="Remover notificação">
                    <HiX size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}