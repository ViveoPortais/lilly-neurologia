"use client";

import { HiX, HiCheck } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import dayjs from "dayjs";
import { routes } from "@/helpers/routes";

interface Notification {
  id: string;
  content: string;
  createdAt: string;
  status?: string;
}

interface NotificationContentProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function NotificationContent({ notifications, onMarkAsRead, onRemove }: NotificationContentProps) {
  const router = useRouter();

  const renderContent = useCallback(
    (text: string) => {
      const match = text.match(/<route>(.*?)<\/route>/);
      if (!match) return text;

      const label = match[1].trim();
      let matchedRoute: string | undefined;

      Object.values(routes).some((profileRoutes) => {
        const found = profileRoutes.find((r) => r.text.toLowerCase() === label.toLowerCase());
        if (found) {
          matchedRoute = found.route;
          return true;
        }
        return false;
      });

      const [before, after] = text.split(match[0]);

      return (
        <>
          {before}
          {matchedRoute ? (
            <span onClick={() => router.push(matchedRoute!)} className="text-red-600 underline cursor-pointer">
              {label}
            </span>
          ) : (
            <span className="text-red-600">{label}</span>
          )}
          {after}
        </>
      );
    },
    [router]
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
              <li key={n.id} className={`flex justify-between items-start gap-3 border-b pb-2 ${n.status === "#READ" ? "opacity-70" : ""}`}>
                <div className="flex-1 text-sm text-gray-800 leading-snug">
                  <span className="block">{renderContent(n.content)}</span>
                  <div className="mt-3 flex gap-1 text-xs text-gray-500">
                    <span>{dayjs(n.createdAt).format("DD [de] MMMM [de] YYYY")}</span>
                    <span>•</span>
                    <span>{dayjs(n.createdAt).format("HH:mm")}h</span>
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