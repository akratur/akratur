"use client";

import { motion } from "framer-motion";
import { Users, Bus, School, GraduationCap, Map as MapIcon, Star } from "lucide-react";

interface StatItem {
    label: string;
    value: string;
}

interface Props {
    stats?: StatItem[];
}

export function AnimatedStats({ stats: passedStats }: Props) {
    // Default stats if none provided (or if DB is empty)
    const defaultStats = [
        { label: "Mutlu Öğrenci", value: "15000+" },
        { label: "Düzenlenen Tur", value: "450+" },
        { label: "Anlaşmalı Okul", value: "80+" },
        { label: "Tecrübeli Rehber", value: "30+" }
    ];

    const stats = passedStats && passedStats.length > 0 ? passedStats : defaultStats;

    const icons = [Users, Bus, School, GraduationCap, MapIcon, Star];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12">
            {stats.map((stat, idx) => {
                const Icon = icons[idx % icons.length];
                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform"
                    >
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Icon size={24} />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wide font-medium">{stat.label}</p>
                    </motion.div>
                );
            })}
        </div>
    );
}
