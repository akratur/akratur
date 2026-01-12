"use client";

import { useState } from "react";
import { School, Tour } from "@/lib/types"; // These types might need updating or I define interfaces here if loose
import { Plus, Edit, Trash, X, Save, DollarSign, School as SchoolIcon, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { upsertSchoolAction, deleteSchoolAction } from "@/actions/school";

// We need robust types for the props passed from Server Page
interface SchoolWithTours extends School {
    assignedTours: any[]; // Prisma include result
}

interface Props {
    schools: any[]; // Avoid strict type conflict for now
    tours: any[];
}

export function SchoolsClient({ schools, tours }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchool, setEditingSchool] = useState<any | null>(null);

    const initialFormState = {
        id: "",
        name: "",
        city: "",
        district: "",
        contactName: "",
        phone: "",
        username: "",
        password: "",
        accessCode: "",
        iban: "",
        assignedTours: [] as any[]
    };

    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);

    // Multi-Select States
    const [selectedTourIds, setSelectedTourIds] = useState<string[]>([]);
    const [batchPrice, setBatchPrice] = useState("");

    const handleOpenModal = (school?: any) => {
        if (school) {
            setEditingSchool(school);
            // Map prisma assignedTours to our format
            const mappedTours = school.assignedTours?.map((st: any) => ({
                tourId: st.tourId,
                price: st.price
                // locationIds missing in DB
            })) || [];

            setFormData({ ...school, assignedTours: mappedTours });
        } else {
            setEditingSchool(null);
            setFormData({ ...initialFormState });
        }
        setSelectedTourIds([]);
        setBatchPrice("");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSchool(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Prepare data for server action
        const payload = { ...formData };
        if (!editingSchool) delete payload.id; // Let server handle new ID

        const result = await upsertSchoolAction(payload);
        setLoading(false);

        if (result.success) {
            handleCloseModal();
            window.location.reload(); // Refresh to see changes
        } else {
            alert("Hata: " + result.error);
        }
    };

    const handleBatchAssign = () => {
        if (selectedTourIds.length === 0 || !batchPrice) {
            alert("Lütfen en az bir tur seçin ve fiyat girin.");
            return;
        }

        const newAssignments = [...formData.assignedTours];

        selectedTourIds.forEach(tourId => {
            // Remove if exists
            const existingIdx = newAssignments.findIndex(t => t.tourId === tourId);
            if (existingIdx > -1) {
                newAssignments.splice(existingIdx, 1);
            }
            // Add new
            newAssignments.push({
                tourId: tourId,
                price: Number(batchPrice)
            });
        });

        setFormData({ ...formData, assignedTours: newAssignments });
        setSelectedTourIds([]);
        setBatchPrice("");
        alert(`${selectedTourIds.length} tur eklendi/güncellendi.`);
    };

    const removeAssignedTour = (tourId: string) => {
        setFormData({ ...formData, assignedTours: formData.assignedTours.filter(t => t.tourId !== tourId) });
    };

    const handleDeleteSchool = async (id: string) => {
        if (!confirm("Bu okulu silmek istediğinize emin misiniz?")) return;
        const res = await deleteSchoolAction(id);
        if (res.success) window.location.reload();
        else alert(res.error);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Okul Yönetimi</h1>
                    <p className="text-slate-400">Okul hesapları ve tur atamaları işlemlerini yönetin.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors shadow-lg shadow-amber-500/20"
                >
                    <Plus size={20} />
                    Yeni Okul Ekle
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800 border-b border-slate-700 text-slate-400">
                                <th className="p-4 font-medium">Okul Adı</th>
                                <th className="p-4 font-medium">Konum</th>
                                <th className="p-4 font-medium">Yetkili</th>
                                <th className="p-4 font-medium">Giriş Bilgileri</th>
                                <th className="p-4 font-medium">Tanımlı Turlar</th>
                                <th className="p-4 font-medium text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {schools.map((school: any) => (
                                <tr key={school.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 font-medium text-white">{school.name}</td>
                                    <td className="p-4 text-slate-400">{school.city} / {school.district}</td>
                                    <td className="p-4 text-slate-400">
                                        <div>{school.contactName}</div>
                                        <div className="text-xs">{school.phone}</div>
                                        <div className="text-[10px] text-slate-500 mt-1 bg-slate-800 px-1 rounded inline-block">
                                            {school._count?.students || 0} Öğrenci
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="space-y-1">
                                            <div className="text-sm bg-slate-800 inline-block px-2 py-1 rounded border border-slate-700">
                                                <span className="text-slate-500">Kod:</span> <span className="text-slate-300 font-mono">{school.accessCode}</span>
                                            </div>
                                            <div className="text-xs text-slate-500">U: {school.username}</div>
                                            {school.iban && <div className="text-[10px] text-green-600/70 font-mono">IBAN Var</div>}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {school.assignedTours?.map((at: any) => {
                                                const t = tours.find(x => x.id === at.tourId);
                                                return t ? (
                                                    <span key={at.tourId} className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                                                        {t.title.substring(0, 15)}...
                                                    </span>
                                                ) : null;
                                            })}
                                            {(!school.assignedTours || school.assignedTours.length === 0) && <span className="text-slate-600 text-xs text-italic">Tanımlı tur yok</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => handleOpenModal(school)} className="p-2 hover:bg-amber-500/20 text-amber-500 rounded-lg transition-colors">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteSchool(school.id)} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={handleCloseModal}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl z-10 p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                                <h2 className="text-2xl font-bold text-white">{editingSchool ? 'Okulu Düzenle' : 'Yeni Okul Ekle'}</h2>
                                <button onClick={handleCloseModal} className="text-slate-400 hover:text-white"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left: School Details */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2"><SchoolIcon size={20} className="text-amber-500" /> Okul Bilgileri</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Okul Adı</label>
                                            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1">İl</label>
                                                <input required type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1">İlçe</label>
                                                <input required type="text" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Yetkili Adı</label>
                                            <input required type="text" value={formData.contactName} onChange={e => setFormData({ ...formData, contactName: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Telefon</label>
                                            <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white" />
                                        </div>
                                        <div className="p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700 space-y-3">
                                            <h4 className="font-bold text-sm text-slate-400">Giriş & Ödeme Bilgileri</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs text-slate-500 block mb-1">Kurum Kodu</label>
                                                    <input required type="text" placeholder="Örn: GS2024" value={formData.accessCode} onChange={e => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm" />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 block mb-1">Kullanıcı Adı</label>
                                                    <input required type="text" placeholder="username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 block mb-1">Şifre</label>
                                                <input required type="text" placeholder="Şifre" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 block mb-1">Okul IBAN (TR...)</label>
                                                <input type="text" placeholder="TR00 0000 ..." value={formData.iban || ''} onChange={e => setFormData({ ...formData, iban: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Tour Assignments (Multi-Select) */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2"><DollarSign size={20} className="text-green-500" /> Tur Ataması (Toplu)</h3>
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                            <p className="text-xs text-slate-400 mb-3">Listeden birden fazla tur seçerek tek seferde fiyat tanımlayabilirsiniz.</p>

                                            <div className="max-h-60 overflow-y-auto custom-scrollbar border border-slate-700 rounded-lg p-2 mb-3 bg-slate-900">
                                                {tours.map(t => (
                                                    <label key={t.id} className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedTourIds.includes(t.id)}
                                                            onChange={e => {
                                                                if (e.target.checked) setSelectedTourIds([...selectedTourIds, t.id]);
                                                                else setSelectedTourIds(selectedTourIds.filter(id => id !== t.id));
                                                            }}
                                                            className="w-4 h-4 rounded border-slate-600 text-amber-500 focus:ring-amber-500 bg-slate-800"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="text-sm text-white">{t.title}</div>
                                                            <div className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString("tr-TR")}</div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>

                                            <div className="flex gap-3">
                                                <input
                                                    type="number"
                                                    placeholder="Toplu Fiyat (TL)"
                                                    value={batchPrice}
                                                    onChange={e => setBatchPrice(e.target.value)}
                                                    className="flex-1 bg-slate-900 border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleBatchAssign}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold"
                                                >
                                                    Turları Ekle
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                                            <h4 className="text-sm font-bold text-slate-400">Atanmış Turlar</h4>
                                            {formData.assignedTours.map((at) => {
                                                const t = tours.find((x: any) => x.id === at.tourId);
                                                if (!t) return null;
                                                return (
                                                    <div key={at.tourId} className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                                                        <div>
                                                            <div className="text-sm text-white font-medium line-clamp-1">{t.title}</div>
                                                            <div className="text-xs text-green-400 font-bold">{at.price} TL</div>
                                                        </div>
                                                        <button type="button" onClick={() => removeAssignedTour(at.tourId)} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors">
                                                            <Trash size={14} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                            {formData.assignedTours.length === 0 && <p className="text-center text-slate-500 text-sm py-4">Henüz tur tanımlanmamış.</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
                                    <button type="button" onClick={handleCloseModal} className="px-6 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">İptal</button>
                                    <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/20 transition-colors flex items-center gap-2">
                                        <Save size={18} />
                                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
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
