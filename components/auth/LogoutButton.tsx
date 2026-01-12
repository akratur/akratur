"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";

export function LogoutButton() {
    return (
        <button
            onClick={() => logoutAction()}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
            <LogOut size={18} />
            <span className="hidden md:inline">Çıkış</span>
        </button>
    );
}
