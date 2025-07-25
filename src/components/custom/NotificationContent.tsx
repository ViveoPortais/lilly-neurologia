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
  regardingEntity? : IRegardingEntity;
}

interface IRegardingEntity{
  regardingObjectIdTarget? : string;
  regardingEntityNameTarget? : string;
}
interface NotificationContentProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

export default function NotificationContent({ notifications, onMarkAsRead, onRemove, onClose }: NotificationContentProps) {
  const router = useRouter();
  const { role } = useSession();

  const renderContent = useCallback(
    (notification: Notification) => {
      const profileRoutes = role ? routes[role] : [];

      if (!profileRoutes || profileRoutes.length === 0) return notification.description;
      let matchedText: string | undefined;

      for (const route of profileRoutes) {
        if (notification.description.toLowerCase().includes(route.text.toLowerCase())) {
          matchedText = route.text;
          break;
        }
      }

      if (!matchedText) return notification.description;

      const [before, after] = notification.description.split(new RegExp(matchedText, "i"));

      return (
        <>
          {before}
          <span
            className="underline text-red-600 cursor-pointer"
          >
            {matchedText}
          </span>
          {after}
        </>
      );
    },
    [router, role, onClose]
  );

  const routerPush = (notification: Notification) => {
    const profileRoutes = role ? routes[role] : [];
    if (!profileRoutes?.length) return;

    const routeConfig: Record<string,{ route: string; useResolveId: boolean }> = {
      Exam: {
        route: "pendings",
        useResolveId: true,
      },
      HealthProfessionalByProgramDoctorByProgram: {
        route: "link-management",
        useResolveId: false,
      },
    };

    const entityName = notification.regardingEntity?.regardingEntityNameTarget;
    const config = entityName ? routeConfig[entityName] : null;
    if (!config) return;

    const matched = profileRoutes.find((x: any) =>
      x.route.includes(config.route)
    );
    if (!matched) return;

    const matchedRoute = config.useResolveId
      ? `${matched.route}?resolveId=${notification.regardingEntity?.regardingObjectIdTarget}`
      : matched.route;

    return () => {
      router.push(matchedRoute);
      onClose();
    };
  };

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
                  <span className="block cursor-pointer" onClick={()=>{routerPush(n)?.()}}>{renderContent(n)}</span>
                  <div className="mt-3 flex gap-1 text-xs text-gray-500">
                    <span>{dayjs(n.createdOn).format("DD [de] MMMM [de] YYYY")}</span>
                    <span>•</span>
                    <span>{dayjs(n.createdOn).format("HH:mm")}</span>
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