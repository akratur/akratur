"use client";

import { useState } from "react";
// Remove Tour from types and define here to avoid mismatch with old store types
// Or assume types generally match but we handle IDs carefully
import { Plus, Edit, Trash, X, Save, Clock, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { upsertTourAction, deleteTourAction } from "@/actions/tour";
import Link from "next/link";

interface Tour {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    images: string[];
    type: string;
    date: string; // ISO string
    location: string;
    itinerary: { time: string; activity: string }[];
    locationIds?: string[]; // Kept for UI state, even if not fully relational yet in complex way
    // For Prisma relation, we might need a separate mechanism if using relations.
    // But for now, user seems happy with simple storage.
}

interface Location {
    id: string;
    title: string;
}

interface Props {
    tours: any[]; // Prisma returns standard objects
    locations: Location[];
}

export function ToursClient({ tours, locations }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTour, setEditingTour] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    // Form State
    const initialFormState: Tour = {
        id: "",
        title: "",
        description: "",
        coverImage: "",
        images: [],
        type: "culture",
        date: new Date().toISOString().split('T')[0],
        location: "",
        itinerary: [{ time: "09:00", activity: "Başlangıç" }],
        locationIds: []
    };

    const [formData, setFormData] = useState<Tour>(initialFormState);

    const handleOpenModal = (tour?: any) => {
        if (tour) {
            setEditingTour(tour);
            // Parse JSON fields if they come as strings from DB (depending on how Prisma returned them)
            // If we used JSON.stringify in action, Prisma might return them as objects if the type is mapped?
            // sqlite: everything is string usually unless mapped.
            // But we stored as String in Schema. So we need to parse.

            let parsedItinerary = [];
            try { parsedItinerary = typeof tour.itinerary === 'string' ? JSON.parse(tour.itinerary) : tour.itinerary; } catch (e) { }

            let parsedImages = [];
            try { parsedImages = typeof tour.images === 'string' ? JSON.parse(tour.images) : tour.images; } catch (e) { }

            setFormData({
                ...tour,
                date: new Date(tour.date).toISOString().split('T')[0], // Convert Date obj to YYYY-MM-DD
                itinerary: parsedItinerary || [],
                images: parsedImages || [],
                locationIds: tour.locations?.map((l: any) => l.id) || []
            });
        } else {
            setEditingTour(null);
            setFormData({ ...initialFormState });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTour(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = { ...formData };
        if (!editingTour) delete (payload as any).id;

        const res = await upsertTourAction(payload);
        setLoading(false);

        if (res.success) {
            handleCloseModal();
            window.location.reload();
        } else {
            alert(res.error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu turu silmek istediğinize emin misiniz?")) return;
        const res = await deleteTourAction(id);
        if (res.success) window.location.reload();
        else alert(res.error);
    }

    // Itinerary Helpers
    const addItineraryItem = () => {
        setFormData({ ...formData, itinerary: [...formData.itinerary, { time: "", activity: "" }] });
    };

    const removeItineraryItem = (index: number) => {
        setFormData({ ...formData, itinerary: formData.itinerary.filter((_, i) => i !== index) });
    };

    const updateItineraryItem = (index: number, field: 'time' | 'activity', value: string) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setFormData({ ...formData, itinerary: newItinerary });
    };

    // Image Helper
    const addImage = () => {
        const url = prompt("Resim URL'sini giriniz:");
        if (url) setFormData({ ...formData, images: [...formData.images, url] });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Tur Yönetimi</h1>
                    <p className="text-slate-400">Turları ekleyin, düzenleyin veya silin.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors shadow-lg shadow-amber-500/20"
                >
                    <Plus size={20} />
                    Yeni Tur Ekle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tours.map((tour) => (
                    <div key={tour.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-amber-500/50 transition-all">
                        <div className="h-48 overflow-hidden relative">
                            {tour.coverImage ? (
                                <img src={tour.coverImage} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">Resim Yok</div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(tour)}
                                    className="p-2 bg-slate-900/80 backdrop-blur-sm text-blue-400 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(tour.id)}
                                    className="p-2 bg-slate-900/80 backdrop-blur-sm text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-white line-clamp-1">{tour.title}</h3>
                                <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 capitalize">{tour.type}</span>
                            </div>
                            <p className="text-slate-400 text-sm line-clamp-2 mb-4">{tour.description}</p>
                            <div className="text-sm text-slate-500 flex items-center gap-2">
                                <Clock size={14} />
                                {new Date(tour.date).toLocaleDateString("tr-TR")}
                            </div>
                        </div>
                    </div>
                ))}
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
                                <h2 className="text-2xl font-bold text-white">{editingTour ? 'Turu Düzenle' : 'Yeni Tur Ekle'}</h2>
                                <button onClick={handleCloseModal} className="text-slate-400 hover:text-white"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Tur Başlığı</label>
                                            <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Açıklama</label>
                                            <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1">Tarih</label>
                                                <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1">Tür</label>
                                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white">
                                                    <option value="culture">Kültür</option>
                                                    <option value="science">Bilim</option>
                                                    <option value="education">Eğitim</option>
                                                    <option value="fun">Eğlence</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Lokasyon (Şehir/Bölge)</label>
                                            <input required type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white" />
                                        </div>

                                        {/* Locations Checkbox Section - Still mostly UI for now */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Ziyaret Noktaları (Lokasyonlar)</label>
                                            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 max-h-40 overflow-y-auto custom-scrollbar">
                                                {locations.length > 0 ? locations.map(loc => (
                                                    <label key={loc.id} className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded cursor-pointer transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.locationIds?.includes(loc.id) || false}
                                                            onChange={e => {
                                                                const currentIds = formData.locationIds || [];
                                                                if (e.target.checked) {
                                                                    setFormData({ ...formData, locationIds: [...currentIds, loc.id] });
                                                                } else {
                                                                    setFormData({ ...formData, locationIds: currentIds.filter(id => id !== loc.id) });
                                                                }
                                                            }}
                                                            className="w-4 h-4 rounded border-slate-600 text-amber-500 focus:ring-amber-500 bg-slate-900"
                                                        />
                                                        <span className="text-sm text-slate-200">{loc.title}</span>
                                                    </label>
                                                )) : (
                                                    <div className="text-center py-2">
                                                        <p className="text-xs text-slate-500 mb-1">Henüz lokasyon tanımlanmamış.</p>
                                                        <Link href="/admin/locations" className="text-xs text-blue-400 hover:text-blue-300">Lokasyon Ekle</Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Kapak Resmi URL</label>
                                            <input required type="text" value={formData.coverImage} onChange={e => setFormData({ ...formData, coverImage: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">Video URL (Opsiyonel)</label>
                                            <input type="text" value={(formData as any).videoUrl || ''} onChange={e => setFormData({ ...formData, videoUrl: e.target.value } as any)} className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white" />
                                        </div>

                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-sm font-medium text-slate-400">Tur Programı</label>
                                                <button type="button" onClick={addItineraryItem} className="text-xs bg-amber-500/20 text-amber-500 px-2 py-1 rounded hover:bg-amber-500/30">Ekle</button>
                                            </div>
                                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                {formData.itinerary.map((item, idx) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <input type="time" value={item.time} onChange={e => updateItineraryItem(idx, 'time', e.target.value)} className="bg-slate-900 border-slate-700 rounded px-2 py-1 text-white w-24" />
                                                        <input type="text" value={item.activity} onChange={e => updateItineraryItem(idx, 'activity', e.target.value)} placeholder="Aktivite" className="bg-slate-900 border-slate-700 rounded px-2 py-1 text-white flex-1" />
                                                        <button type="button" onClick={() => removeItineraryItem(idx)} className="text-red-400 hover:text-red-300 p-1"><X size={16} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-sm font-medium text-slate-400">Galeri Resimleri ({formData.images.length})</label>
                                                <button type="button" onClick={addImage} className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded hover:bg-blue-500/30">Resim Ekle</button>
                                            </div>
                                            <div className="flex gap-2 overflow-x-auto pb-2 min-h-[80px]">
                                                {formData.images.map((img, idx) => (
                                                    <div key={idx} className="flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden group">
                                                        <img src={img} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                                            className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {formData.images.length === 0 && <span className="text-xs text-slate-500 self-center mx-auto">Resim yok</span>}
                                            </div>
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
