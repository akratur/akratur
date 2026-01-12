"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ArrowRight, Baby, Lock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { loginParentAction } from "@/actions/auth";

export default function ParentLoginPage() {
    const router = useRouter();
    const [tc, setTc] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const result = await loginParentAction(tc, accessCode);
            if (result.success) {
                router.push("/parent");
            } else {
                setError(result.error || "Giriş başarısız.");
            }
        } catch (err) {
            setError("Bir hata oluştu.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1544531861-80693a18a992?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5 blur-sm" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 relative z-10"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-green-500/10 rounded-full ring-1 ring-green-500/50">
                        <User size={48} className="text-green-500" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-2">Veli Girişi</h2>
                <p className="text-slate-500 text-center mb-8">Okul kodunuz ve TC kimlik numaranız ile giriş yapın.</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm mb-6">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Okul Kodu</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all uppercase tracking-wider"
                                placeholder="Örn: CK2024"
                                required
                            />
                            <Lock className="absolute right-3 top-3.5 text-slate-400" size={18} />
                        </div>
                        <p className="mt-1 text-xs text-slate-400">Okulunuz tarafından verilen kodu giriniz.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Öğrenci T.C. Kimlik No</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={tc}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                                    setTc(val);
                                }}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="11 haneli TC Kimlik No"
                                required
                                minLength={11}
                                maxLength={11}
                            />
                            <Baby className="absolute right-3 top-3.5 text-slate-400" size={18} />
                        </div>
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group"
                    >
                        Giriş Yap
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
