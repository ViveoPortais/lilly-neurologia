"use client";

import dynamic from 'next/dynamic';

const PowerBIDashboard = dynamic(
  () => import("@/components/dashboard/PowerBIDashboard"),
  { ssr: false }
);

export default function ReportPage() {
  return <PowerBIDashboard reportId="51edacc5-6ee8-48d7-a98f-ac9aeb9f0f4f" groupId="8a751c4a-5e1e-4158-ba0c-78a5f3280050"/>;
}