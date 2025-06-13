"use client";

import { HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import dayjs from "dayjs";
import { routes } from "@/helpers/routes";

interface Notification {
  id: string;
  content: string;
  createdAt: string;
}

interface NotificationContentProps {
  notifications: Notification[];
  onDelete: (id: string) => void;
}

export default function NotificationContent({ notifications, onDelete }: NotificationContentProps) {
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
              <li key={n.id} className="flex justify-between items-start gap-3">
                <div className="flex-1 text-sm text-gray-800 leading-snug">
                  <span className="block">{renderContent(n.content)}</span>
                  <span className="text-xs text-gray-500 mt-1 block">{dayjs(n.createdAt).format("DD [de] MMMM [de] YYYY • HH:mm")}</span>
                </div>
                <button onClick={() => onDelete(n.id)} className="text-gray-500 hover:text-red-600" aria-label="Remover notificação">
                  <HiX size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}