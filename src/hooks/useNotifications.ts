import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import useSession from "./useSession";
import { ICommunicationFilterModel } from "@/types/notifications";
import { toast } from "react-toastify";
import { showNotificationToast } from "@/components/custom/ToastNotification";

export function useNotification() {
  const { programsCode } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!programsCode[0] || connectionRef.current) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/hubs/communication`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => {
        console.log("SignalR conectado");

        const filter: ICommunicationFilterModel = {
          page: 1,
          pageSize: 10,
          programCode: programsCode[0],
        };

        connection.invoke("GetNotifications", filter);
      })
      .catch((err) => console.error("Erro ao conectar SignalR:", err));

    connection.on("AddNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
      showNotificationToast("Nova Notificação", data.description);
    });

    connection.on("AllNotifications",(data) =>{
      setNotifications(data.data);
      const unread = data?.data.filter((n: any) => n.statusCodeStringMap.flag === "#PENDING")?.length ?? 0;
      setUnreadCount(unread);
    });

    connection.on("ReceiveNotificationError", (errors: string[]) => {
      console.error("Erro SignalR:", errors);
    });

    return () => {
      connection.stop();
    };
  }, [programsCode[0]]);

  const refresh = () => {
    const filter: ICommunicationFilterModel = {
      page: 1,
      pageSize: 10,
      programCode: programsCode[0],
    };

    connectionRef.current?.invoke("GetNotifications", filter);
  };

  const markAsRead = async (notificationId: string) => {
    await connectionRef.current?.invoke("UpdateNotificationStatus", notificationId, "#READ", {
      page: 1,
      pageSize: 10,
      programCode: programsCode[0],
    });
  };

  const removeNotification = async (notificationId: string) => {
    await connectionRef.current?.invoke("UpdateNotificationStatus", notificationId, "#REMOVED", {
      page: 1,
      pageSize: 10,
      programCode: programsCode[0],
    });
  };

  return {
    notifications,
    unreadCount,
    refresh,
    markAsRead,
    removeNotification,
  };
}