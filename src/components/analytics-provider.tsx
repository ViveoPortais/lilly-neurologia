"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";

export default function AnalyticsProvider() {
  useEffect(() => {
    const analyticalConsent = Cookies.get("AnalyticalCookies") === "true";

    if (!analyticalConsent) return;

    const hjid = process.env.NEXT_PUBLIC_HOTJAR_SITE_ID;
    const hjsv = process.env.NEXT_PUBLIC_HOTJAR_VERSION;

    if (hjid && hjsv && !(window as any).hj) {
      (function (h: any, o: any, t: any, j: any, a?: any, r?: any) {
        h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments); };
        h._hjSettings = { hjid: Number(hjid), hjsv: Number(hjsv) };
        a = o.getElementsByTagName("head")[0];
        r = o.createElement("script");
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
      })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
    }

    const logrocketId = process.env.NEXT_PUBLIC_LOGROCKET_ID;

    if (logrocketId && !(window as any).LogRocket) {
      import("logrocket").then((LogRocket) => {
        LogRocket.default.init(logrocketId);
      });
    }
  }, []);

  return null;
}