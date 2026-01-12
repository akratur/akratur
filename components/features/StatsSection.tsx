"use client";

import { useStore } from "@/lib/store";
import { motion } from "framer-motion";

export function StatsSection() {
    const { siteConfig } = useStore();

    return (
        <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-b border-white/5 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {siteConfig.stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-amber-500/30 transition-colors"
                        >
                            <div className="text-3xl md:text-5xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-2">
                                {stat.value}
                            </div>
                            <div className="text-amber-500/80 font-medium text-sm md:text-base uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
