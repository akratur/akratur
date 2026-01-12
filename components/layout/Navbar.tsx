"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { User, School, Settings, Home, Menu, X, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const { siteConfig } = useStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Ana Sayfa", href: "/", icon: Home },
        { name: "Hakkımızda", href: "/about", icon: Info },
        { name: "Veli Girişi", href: "/parent/login", icon: User },
        { name: "Okul Girişi", href: "/school/login", icon: School },
        { name: "Yönetim", href: "/admin/login", icon: Settings },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center">
                        <img src="/logo.png" alt="AKRA TUR" className="h-14 w-auto object-contain" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="group relative px-3 py-2 rounded-md text-sm font-medium hover:text-amber-400 transition-colors duration-300"
                                >
                                    <span className="flex items-center gap-2">
                                        <item.icon className="w-4 h-4" />
                                        {item.name}
                                    </span>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-slate-800 border-b border-white/10"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
