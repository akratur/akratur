"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";
import { Plus, Trash, BarChart2, Eye, X, Save, CheckCircle, StopCircle, FileQuestion, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Survey } from "@/lib/types";

export default function AdminSurveysPage() {
    const { surveys, addSurvey, updateSurvey, deleteSurvey } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formTitle, setFormTitle] = useState("");
    const [formDesc, setFormDesc] = useState("");
    const [formOptions, setFormOptions] = useState<string[]>(["", ""]); // Start with 2 empty options

    const handleOpenModal = () => {
        setFormTitle("");
        setFormDesc("");
        setFormOptions(["", ""]);
        setIsModalOpen(true);
    };

    const handleAddOption = () => {
        setFormOptions([...formOptions, ""]);
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formOptions];
        newOptions[index] = value;
        setFormOptions(newOptions);
    };

    const handleRemoveOption = (index: number) => {
        if (formOptions.length <= 2) return; // Min 2 options
        setFormOptions(formOptions.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Filter empty options
        const validOptions = formOptions.filter(o => o.trim() !== "");
        if (validOptions.length < 2) {
            alert("En az 2 seçenek girmelisiniz!");
            return;
        }

        const newSurvey: Survey = {
            id: Math.random().toString(36).substr(2, 9),
            title: formTitle,
            description: formDesc,
            options: validOptions,
            votes: [],
            isActive: true
        };

        addSurvey(newSurvey);
        setIsModalOpen(false);
    };

    const toggleStatus = (survey: Survey) => {
        updateSurvey({ ...survey, isActive: !survey.isActive });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Anket Yönetimi</h1>
                    <p className="text-slate-400">Öğrenci ve veli anketlerini yönetin, sonuçları inceleyin.</p>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors shadow-lg shadow-amber-500/20"
                >
                    <Plus size={20} />
                    Yeni Anket Oluştur
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {surveys.map(survey => {
                    const totalVotes = survey.votes.reduce((acc, v) => acc + v.count, 0);

                    return (
                        <div key={survey.id} className={`bg-slate-900 border rounded-2xl p-6 transition-all ${survey.isActive ? 'border-slate-800' : 'border-slate-800 opacity-75'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-white">{survey.title}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${survey.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                                            {survey.isActive ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm">{survey.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleStatus(survey)}
                                        className={`p-2 rounded-lg transition-colors ${survey.isActive ? 'text-amber-500 hover:bg-amber-500/10' : 'text-green-500 hover:bg-green-500/10'}`}
                                        title={survey.isActive ? "Anketi Durdur" : "Anketi Başlat"}
                                    >
                                        {survey.isActive ? <StopCircle size={20} /> : <CheckCircle size={20} />}
                                    </button>
                                    <button
                                        onClick={() => { if (confirm("Anketi silmek istediğinize emin misiniz?")) deleteSurvey(survey.id) }}
                                        className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="space-y-3 mt-6">
                                <div className="flex justify-between text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">
                                    <span>Sonuçlar</span>
                                    <span>Toplam Oy: {totalVotes}</span>
                                </div>
                                {survey.options.map((option, idx) => {
                                    const voteCount = survey.votes.find(v => v.option === option)?.count || 0;
                                    const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

                                    return (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-sm text-slate-300">
                                                <span>{option}</span>
                                                <span className="font-mono">{percentage}% ({voteCount})</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full bg-blue-500 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    );
                })}

                {surveys.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-500 bg-slate-900 border border-slate-800 border-dashed rounded-2xl">
                        <FileQuestion size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Henüz anket oluşturulmamış.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl z-10 p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                                <h2 className="text-2xl font-bold text-white">Yeni Anket</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Anket Başlığı (Soru)</label>
                                    <input
                                        required
                                        type="text"
                                        value={formTitle}
                                        onChange={e => setFormTitle(e.target.value)}
                                        className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white"
                                        placeholder="Örn: Gelecek gezi nereye olsun?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Açıklama</label>
                                    <input
                                        required
                                        type="text"
                                        value={formDesc}
                                        onChange={e => setFormDesc(e.target.value)}
                                        className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white"
                                        placeholder="Kısa bir açıklama..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Seçenekler</label>
                                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                                        {formOptions.map((opt, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <div className="bg-slate-800 border border-slate-700 rounded px-2 flex items-center text-slate-500 cursor-grab">
                                                    <GripVertical size={14} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={e => handleOptionChange(idx, e.target.value)}
                                                    className="w-full bg-slate-800 border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                                                    placeholder={`Seçenek ${idx + 1}`}
                                                />
                                                {formOptions.length > 2 && (
                                                    <button type="button" onClick={() => handleRemoveOption(idx)} className="text-slate-500 hover:text-red-400 px-1">
                                                        <Trash size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={handleAddOption} className="mt-2 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium">
                                        <Plus size={16} /> Seçenek Ekle
                                    </button>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">İptal</button>
                                    <button type="submit" className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/20 transition-colors flex items-center gap-2">
                                        <Save size={18} />
                                        Oluştur
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
