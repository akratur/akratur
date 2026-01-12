"use client";

import { useStore } from "@/lib/store";
import { Location } from "@/lib/types";
import { useState } from "react";
import { Plus, Edit, Trash, X, Save, MapPin, Image as ImageIcon, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLocationsPage() {
    const { locations, addLocation, updateLocation, deleteLocation } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);

    const initialFormState: Location = {
        id: "",
        title: "",
        description: "",
        image: "",
        videoUrl: ""
    };

    const [formData, setFormData] = useState<Location>(initialFormState);

    const handleOpenModal = (location?: Location) => {
        if (location) {
            setEditingLocation(location);
            setFormData(location);
        } else {
            setEditingLocation(null);
            setFormData({ ...initialFormState, id: Math.random().toString(36).substr(2, 9) });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingLocation(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingLocation) {
            updateLocation(formData);
        } else {
            addLocation(formData);
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (confirm("Bu lokasyonu silmek istediğinizden emin misiniz?")) {
            deleteLocation(id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Lokasyon Yönetimi</h1>
                    <p className="text-slate-400">Tur rotaları için ziyaret noktalarını yönetin.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors shadow-lg shadow-amber-500/20"
                >
                    <Plus size={20} />
                    Yeni Lokasyon Ekle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map(location => (
                    <motion.div
                        key={location.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-amber-500/50 transition-colors"
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img src={location.image} alt={location.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button onClick={() => handleOpenModal(location)} className="p-2 bg-slate-900/80 text-amber-500 rounded-lg hover:bg-white transition-colors">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(location.id)} className="p-2 bg-slate-900/80 text-red-500 rounded-lg hover:bg-white transition-colors">
                                    <Trash size={16} />
                                </button>
                            </div>
                            {location.videoUrl && (
                                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-white text-xs flex items-center gap-1">
                                    <Video size={12} /> Video
                                </div>
                            )}
                        </div>
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{location.title}</h3>
                            <p className="text-slate-400 text-sm line-clamp-3 mb-4">{location.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

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
                            className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl z-10 p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                                <h2 className="text-2xl font-bold text-white">{editingLocation ? 'Lokasyonu Düzenle' : 'Yeni Lokasyon Ekle'}</h2>
                                <button onClick={handleCloseModal} className="text-slate-400 hover:text-white"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Lokasyon Adı</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            required
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-slate-800 border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                            placeholder="Örn: Anıtkabir"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Açıklama</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                        placeholder="Ziyaret edilecek yer hakkında kısa bilgi..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Görsel URL</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            required
                                            type="url"
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full bg-slate-800 border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    {formData.image && (
                                        <div className="mt-2 h-32 rounded-lg overflow-hidden border border-slate-700">
                                            <img src={formData.image} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Video URL (Opsiyonel)</label>
                                    <div className="relative">
                                        <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="url"
                                            value={formData.videoUrl || ""}
                                            onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                            className="w-full bg-slate-800 border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
                                    <button type="button" onClick={handleCloseModal} className="px-6 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">İptal</button>
                                    <button type="submit" className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/20 transition-colors flex items-center gap-2">
                                        <Save size={18} />
                                        Kaydet
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
