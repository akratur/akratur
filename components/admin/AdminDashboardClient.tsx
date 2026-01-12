"use client";

import { Users, Map, Building2, TrendingUp, AlertCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardProps {
    totalSchools: number;
    totalStudents: number;
    totalRegistrations: number;
    pendingPayments: number;
    schoolStats: {
        id: string;
        name: string;
        totalStudents: number;
        registeredStudents: number;
    }[];
}

export function AdminDashboardClient({ totalSchools, totalStudents, totalRegistrations, pendingPayments, schoolStats }: DashboardProps) {

    const stats = [
        { label: "Anlaşmalı Okul", value: totalSchools, icon: Building2, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Sisteme Yüklü Öğrenci", value: totalStudents, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Kayıtlı Öğrenci", value: totalRegistrations, icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Bekleyen Ödeme", value: pendingPayments, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Panel Özeti</h1>
                <p className="text-slate-400">Okul ve öğrenci durumlarına genel bakış.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between"
                    >
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                        </div>
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* School Statistics Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Okul Bazlı Kayıt Durumu</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/50 border-b border-slate-700 text-slate-400 text-sm">
                                <th className="p-4 font-medium">Okul Adı</th>
                                <th className="p-4 font-medium text-center">Toplam Yüklü Öğrenci</th>
                                <th className="p-4 font-medium text-center">Kayıt Yaptıran Öğrenci</th>
                                <th className="p-4 font-medium text-center">Doluluk / Oran</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {schoolStats.map((school) => {
                                const ratio = school.totalStudents > 0 ? (school.registeredStudents / school.totalStudents) * 100 : 0;
                                return (
                                    <tr key={school.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 font-medium text-white">{school.name}</td>
                                        <td className="p-4 text-center text-slate-300">
                                            <span className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{school.totalStudents}</span>
                                        </td>
                                        <td className="p-4 text-center text-green-400 font-bold">
                                            <span className="bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">{school.registeredStudents}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${ratio}%` }}></div>
                                                </div>
                                                <span className="text-xs text-slate-500 w-12 text-right">%{ratio.toFixed(1)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
