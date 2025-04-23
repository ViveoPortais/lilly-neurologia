'use client';
import { Loading } from "./Loading";
import useSession from "@/hooks/useSession";

interface LoadingOverlayProps {
    isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
    const session = useSession();
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
            <Loading size={60} customClass={"text-mainlilly"} />
        </div>
    );
}
