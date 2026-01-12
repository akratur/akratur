"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { loginAdminAction } from "@/actions/auth";
import { UserCog, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
    const router = useRouter();
    const { loginAdmin } = useStore();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await loginAdminAction(username, password);

            if (result.success) {
                loginAdmin(); // Sync client store
                router.push("/admin");
                router.refresh(); // Ensure server components re-render with new cookie
            } else {
                setError(result.error || "Hatalı kullanıcı adı veya şifre!");
            }
        } catch (err) {
            setError("Bir hata oluştu.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 relative z-10"
            >
                <div className="flex justify-center mb-8">
                    <div className="p-4 bg-amber-500/10 rounded-full ring-1 ring-amber-500/50">
                        <UserCog size={48} className="text-amber-500" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-white mb-2">Yönetici Girişi</h2>
                <p className="text-slate-400 text-center mb-8">Lütfen yönetim paneline erişmek için giriş yapınız.</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Kullanıcı Adı</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                placeholder="admin"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Şifre</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                            <Lock className="absolute right-3 top-3.5 text-slate-500" size={18} />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2 group"
                    >
                        Giriş Yap
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
