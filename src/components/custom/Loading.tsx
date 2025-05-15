'use client'

import { CgSpinner } from "react-icons/cg";

interface LoadingProps {
    size?: number;
    customClass?: string;
}

export function Loading({
    size = 60,
    customClass = 'text-mainlilly'
}: LoadingProps) {

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] h-screen bg-gray-200 bg-opacity-50">
            <CgSpinner 
                size={size} 
                className={`animate-spin ${customClass}`} 
            />
        </div>
    )
}