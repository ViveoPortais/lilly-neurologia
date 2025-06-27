import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import useSession from "./useSession";
import { ICommunicationFilterModel } from "@/types/notifications";

export function useNotification() {
  const { token, programsCode } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!token || !programsCode[0] || connectionRef.current) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/hubs/communication`, {
        accessTokenFactory: () => token,
      })
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

        connection.invoke("GetNotifications", filter, programsCode[0]);
      })
      .catch((err) => console.error("Erro ao conectar SignalR:", err));

    connection.on("ReceiveNotifications", (data) => {
      console.log(data);
      setNotifications(data.notifications);
      // const unread = data?.filter((n: any) => n.status === "#PENDING")?.length ?? 0;
      setUnreadCount(data.totalCount);
    });

    connection.on("ReceiveNotificationError", (errors: string[]) => {
      console.error("Erro SignalR:", errors);
    });

    return () => {
      connection.stop();
    };
  }, [token, programsCode[0]]);

  const refresh = () => {
    const filter: ICommunicationFilterModel = {
      page: 1,
      pageSize: 10,
      programCode: programsCode[0],
    };

    connectionRef.current?.invoke("GetNotifications", filter, programsCode[0]);
  };

  const markAsRead = async (notificationId: string) => {
    await connectionRef.current?.invoke("UpdateNotificationStatus", programsCode[0], notificationId, "#READ", {
      page: 1,
      pageSize: 10,
      progamCode: programsCode[0],
    });
  };

  const removeNotification = async (notificationId: string) => {
    await connectionRef.current?.invoke("UpdateNotificationStatus", programsCode[0], notificationId, "#REMOVED", {
      page: 1,
      pageSize: 10,
      progamCode: programsCode[0],
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