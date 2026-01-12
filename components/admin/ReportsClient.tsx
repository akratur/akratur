"use client";

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Bus, Calculator, Plus, Trash2, Printer, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { addExpenseAction, deleteExpenseAction } from "@/actions/finance";
import { exportTourParticipantsAction } from "@/actions/export";

interface Expense {
    id: string;
    description: string;
    amount: number;
}

interface TourReport {
    id: string;
    title: string;
    date: string;
    totalRevenue: number;
    totalExpenses: number;
    profit: number;
    expenses: Expense[];
    registeredCount: number;
}

interface Props {
    reports: TourReport[];
}

export function ReportsClient({ reports }: Props) {
    const router = useRouter();
    const [expandedTourId, setExpandedTourId] = useState<string | null>(null);
    const [newExpense, setNewExpense] = useState({ description: "", amount: "" });
    const [addingExpenseFor, setAddingExpenseFor] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedTourId(expandedTourId === id ? null : id);
        setAddingExpenseFor(null);
    };

    const handleExport = async (tourId: string, title: string) => {
        const result = await exportTourParticipantsAction(tourId);
        if (result.success && result.daa) {
            // Convert Base64 to Blob
            const byteCharacters = atob(result.daa);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

            // Trigger download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${title}_Katilimcilar.xlsx`;
            link.click();
        } else {
            alert("Liste indirilemedi: " + (result.error || "Bilinmeyen hata"));
        }
    };

    const handleAddExpense = async (tourId: string) => {
        if (!newExpense.description || !newExpense.amount) return;

        const result = await addExpenseAction(tourId, newExpense.description, parseFloat(newExpense.amount));
        if (result.success) {
            setNewExpense({ description: "", amount: "" });
            setAddingExpenseFor(null);
            router.refresh();
        } else {
            alert("Hata: " + result.error);
        }
    };

    const handleDeleteExpense = async (id: string) => {
        if (!confirm("Bu gideri silmek istediğinize emin misiniz?")) return;
        const result = await deleteExpenseAction(id);
        if (result.success) {
            router.refresh();
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <Calculator className="text-amber-500" />
                Finansal Raporlar ve Gider Yönetimi
            </h1>

            <div className="grid gap-6">
                {reports.map((report) => (
                    <div key={report.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">

                        {/* Summary Header */}
                        <div
                            className="p-6 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex flex-col md:flex-row justify-between items-center gap-4"
                            onClick={() => toggleExpand(report.id)}
                        >
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                    <Bus size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{report.title}</h3>
                                    <p className="text-sm text-slate-500">{format(new Date(report.date), "d MMM yyyy", { locale: tr })} • {report.registeredCount} Kayıtlı Öğrenci</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right">
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">Ciro</div>
                                    <div className="font-bold text-green-600">{report.totalRevenue.toLocaleString()} TL</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">Gider</div>
                                    <div className="font-bold text-red-500">{report.totalExpenses.toLocaleString()} TL</div>
                                </div>
                                <div className="text-right pr-4 border-r border-slate-200 dark:border-slate-700">
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">Kâr/Zarar</div>
                                    <div className={`font-bold text-xl ${report.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {report.profit.toLocaleString()} TL
                                    </div>
                                </div>
                                {expandedTourId === report.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                            </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                            {expandedTourId === report.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 border-t border-slate-200 dark:border-slate-800">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-slate-700 dark:text-slate-300">Gider Kalemleri ve İşlemler</h4>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleExport(report.id, report.title)}
                                                    className="text-sm bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                                                >
                                                    <Printer size={14} /> Listeyi İndir
                                                </button>
                                                <button
                                                    onClick={() => setAddingExpenseFor(report.id)}
                                                    className="text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                                                >
                                                    <Plus size={14} /> Gider Ekle
                                                </button>
                                            </div>
                                        </div>

                                        {addingExpenseFor === report.id && (
                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-4 flex gap-2 items-center animate-in fade-in slide-in-from-top-2">
                                                <input
                                                    type="text"
                                                    placeholder="Gider açıklaması"
                                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                                                    value={newExpense.description}
                                                    onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Tutar (TL)"
                                                    className="w-32 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                                                    value={newExpense.amount}
                                                    onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                                                />
                                                <button
                                                    onClick={() => handleAddExpense(report.id)}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700"
                                                >
                                                    Ekle
                                                </button>
                                                <button
                                                    onClick={() => setAddingExpenseFor(null)}
                                                    className="text-slate-500 hover:text-slate-700 px-2"
                                                >
                                                    İptal
                                                </button>
                                            </div>
                                        )}

                                        {report.expenses.length > 0 ? (
                                            <div className="space-y-2">
                                                {report.expenses.map(exp => (
                                                    <div key={exp.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group">
                                                        <span className="text-slate-700 dark:text-slate-300">{exp.description}</span>
                                                        <div className="flex items-center gap-4">
                                                            <span className="font-bold text-slate-800 dark:text-slate-200">{exp.amount.toLocaleString()} TL</span>
                                                            <button
                                                                onClick={() => handleDeleteExpense(exp.id)}
                                                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-slate-400 italic text-sm">Henüz gider eklenmemiş.</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
