"use client";

import { useStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Map,
    School,
    Settings,
    LogOut,
    Menu,
    X,
    UserCog,
    FileQuestion,
    MapPin,
    Calculator,
    MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAdmin, logoutAdmin, isInitialized } = useStore();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (!isInitialized) return; // Wait for session check

        if (!isAdmin && !isLoginPage) {
            router.push("/admin/login");
        }
    }, [isAdmin, router, isLoginPage, isInitialized]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) setSidebarOpen(false);
            else setSidebarOpen(true);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isLoginPage) return <>{children}</>;
    if (!isInitialized) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Yükleniyor...</div>;
    if (!isAdmin) return null;

    const menuItems = [
        { name: "Panel Özeti", href: "/admin", icon: LayoutDashboard },
        { name: "Tur Yönetimi", href: "/admin/tours", icon: Map },
        { name: "Lokasyon Yönetimi", href: "/admin/locations", icon: MapPin },
        { name: "Okul & Öğrenci", href: "/admin/schools", icon: School },
        { name: "Finans & Raporlar", href: "/admin/reports", icon: Calculator },
        { name: "Anket Yönetimi", href: "/admin/surveys", icon: FileQuestion },
        { name: "Değerlendirmeler", href: "/admin/reviews", icon: MessageSquare },
        { name: "Site Ayarları", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans">
            {/* Sidebar Overlay for Mobile */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: sidebarOpen ? 280 : 0,
                    opacity: sidebarOpen ? 1 : 0
                }}
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden whitespace-nowrap",
                    !sidebarOpen && "hidden lg:flex lg:w-0" // Hide completely when closed on mobile, nice animation on desktop
                )}
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-500/20">
                        A
                    </div>
                    <span className="font-bold text-xl tracking-tight">Admin Paneli</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                pathname === item.href
                                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25 font-medium"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                            onClick={() => isMobile && setSidebarOpen(false)}
                        >
                            <item.icon size={20} className={cn(pathname === item.href ? "text-white" : "text-slate-500 group-hover:text-amber-500 transition-colors")} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => { logoutAdmin(); router.push("/admin/login"); }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-slate-800 hover:text-red-300 w-full transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400">Yönetici</span>
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                            <UserCog size={16} className="text-slate-300" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-10 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
