"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash, Image as ImageIcon, BarChart, Phone, Mail, MapPin } from "lucide-react";
import { updateSiteConfigAction, updateSliderAction, getAdminSettingsAction } from "@/actions/admin-settings";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

// Interface definitions to match our usage
interface SliderItem {
    id?: string;
    image: string;
    title: string;
    subtitle: string;
    order?: number;
}

interface StatItem {
    label: string;
    value: string;
}

interface SiteConfigData {
    logo: string;
    contact: {
        phone: string;
        email: string;
        address: string;
        footerText: string;
    };
    stats: StatItem[];
    slider: SliderItem[];
}

export default function AdminSettingsPage() {
    // Initial state matching the structure we want to manage
    const [config, setConfig] = useState<SiteConfigData>({
        logo: "",
        contact: { phone: "", email: "", address: "", footerText: "" },
        stats: [
            { label: "Mutlu Öğrenci", value: "1000+" },
            { label: "Okul", value: "50+" },
            { label: "Düzenlenen Tur", value: "200+" },
            { label: "Yıllık Tecrübe", value: "10" }
        ],
        slider: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch initial data
        getAdminSettingsAction().then(({ config: dbConfig, sliders: dbSliders }) => {
            if (dbConfig) {
                let stats = [];
                try {
                    stats = dbConfig.stats ? JSON.parse(dbConfig.stats) : [];
                } catch (e) { }

                if (stats.length === 0) {
                    // Default stats if empty
                    stats = [
                        { label: "Mutlu Öğrenci", value: "1000+" },
                        { label: "Okul", value: "50+" },
                        { label: "Düzenlenen Tur", value: "200+" },
                        { label: "Yıllık Tecrübe", value: "10" }
                    ];
                }

                setConfig(prev => ({
                    ...prev,
                    logo: dbConfig.logo || "",
                    contact: {
                        phone: dbConfig.phone || "",
                        email: dbConfig.email || "",
                        address: dbConfig.address || "",
                        footerText: dbConfig.footerText || ""
                    },
                    stats: stats
                }));
            }
            if (dbSliders) {
                setConfig(prev => ({ ...prev, slider: dbSliders }));
            }
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setLoading(true);
        // Save Config (including stats)
        const configResult = await updateSiteConfigAction({
            logo: config.logo,
            contact: config.contact,
            stats: config.stats
        });

        // Save Slider
        const sliderResult = await updateSliderAction(config.slider);

        setLoading(false);
        if (configResult.success && sliderResult.success) {
            alert("Tüm ayarlar veritabanına kaydedildi ve site güncellendi!");
        } else {
            const errorMsg = [configResult.error, sliderResult.error].filter(Boolean).join("\n");
            alert("Hata oluştu:\n" + errorMsg);
        }
    };

    const addSliderItem = () => {
        setConfig({
            ...config,
            slider: [...config.slider, { id: Math.random().toString(), image: "", title: "", subtitle: "" }]
        });
    };

    const removeSliderItem = (index: number) => {
        setConfig({
            ...config,
            slider: config.slider.filter((_, i) => i !== index)
        });
    };

    const updateSliderItem = (index: number, field: string, value: string) => {
        const newSlider = [...config.slider];
        newSlider[index] = { ...newSlider[index], [field]: value };
        setConfig({ ...config, slider: newSlider });
    };

    const updateStat = (index: number, field: 'label' | 'value', value: string) => {
        const newStats = [...config.stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setConfig({ ...config, stats: newStats });
    };

    const updateContact = (field: string, value: string) => {
        setConfig({
            ...config,
            contact: { ...config.contact, [field]: value }
        });
    };

    if (loading) {
        return <div className="p-10 text-center text-white">Yükleniyor...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Site Ayarları</h1>
                    <p className="text-slate-400">Logo, Slider ve İstatistikleri yönetin.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors shadow-lg shadow-amber-500/20"
                >
                    <Save size={20} />
                    {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>

            <div className="space-y-8">
                {/* Logo Section */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <ImageIcon size={20} className="text-amber-500" />
                        Logo Ayarları
                    </h2>
                    <div className="flex gap-6 items-start">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Logo URL</label>
                            <input
                                type="text"
                                value={config.logo}
                                onChange={(e) => setConfig({ ...config, logo: e.target.value })}
                                className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white"
                                placeholder="https://..."
                            />
                            <p className="text-xs text-slate-500 mt-2">Önerilen: Şeffaf PNG, Yatay format.</p>
                        </div>
                        <div className="w-32 h-16 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center p-2">
                            {config.logo ? (
                                <img src={config.logo} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <span className="text-xs text-slate-500">Önizleme</span>
                            )}
                        </div>
                    </div>
                </section>

                {/* Slider Section */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                            <ImageIcon size={20} className="text-blue-500" />
                            Slider Yönetimi
                        </h2>
                        <button onClick={addSliderItem} className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg text-white transition-colors flex items-center gap-1">
                            <Plus size={16} /> Ekle
                        </button>
                    </div>

                    <div className="space-y-4">
                        {config.slider.map((item, idx) => (
                            <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-start relative group">
                                <div className="md:col-span-3 aspect-video bg-slate-900 rounded-lg overflow-hidden">
                                    {item.image ? (
                                        <img src={item.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600">Resim Yok</div>
                                    )}
                                </div>
                                <div className="md:col-span-8 space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Resim URL"
                                        value={item.image}
                                        onChange={(e) => updateSliderItem(idx, 'image', e.target.value)}
                                        className="w-full bg-slate-900 border-slate-700 rounded px-3 py-1.5 text-white text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Başlık"
                                        value={item.title}
                                        onChange={(e) => updateSliderItem(idx, 'title', e.target.value)}
                                        className="w-full bg-slate-900 border-slate-700 rounded px-3 py-1.5 text-white text-sm font-bold"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Alt Başlık"
                                        value={item.subtitle}
                                        onChange={(e) => updateSliderItem(idx, 'subtitle', e.target.value)}
                                        className="w-full bg-slate-900 border-slate-700 rounded px-3 py-1.5 text-slate-300 text-sm"
                                    />
                                </div>
                                <div className="md:col-span-1 flex justify-end">
                                    <button onClick={() => removeSliderItem(idx)} className="text-red-400 p-2 hover:bg-slate-700 rounded-lg">
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <BarChart size={20} className="text-green-500" />
                        İstatistikler
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {config.stats.map((stat, idx) => (
                            <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 space-y-2">
                                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">İstatistik {idx + 1}</div>
                                <input
                                    type="text"
                                    value={stat.value}
                                    onChange={(e) => updateStat(idx, 'value', e.target.value)}
                                    className="w-full bg-slate-900 border-slate-700 rounded px-3 py-1.5 text-white font-bold text-xl text-center"
                                />
                                <input
                                    type="text"
                                    value={stat.label}
                                    onChange={(e) => updateStat(idx, 'label', e.target.value)}
                                    className="w-full bg-slate-900 border-slate-700 rounded px-3 py-1.5 text-slate-400 text-sm text-center"
                                />
                            </div>
                        ))}
                        {config.stats.length < 4 && (
                            <button
                                onClick={() => setConfig({ ...config, stats: [...config.stats, { label: "Yeni", value: "0" }] })}
                                className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-800 transition-colors"
                            >
                                <Plus size={24} />
                            </button>
                        )}
                    </div>
                </section>

                {/* Contact Section */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <Phone size={20} className="text-purple-500" />
                        İletişim Bilgileri
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Telefon</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    value={config.contact?.phone || ''}
                                    onChange={(e) => updateContact('phone', e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">E-posta</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    value={config.contact?.email || ''}
                                    onChange={(e) => updateContact('email', e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Adres</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    value={config.contact?.address || ''}
                                    onChange={(e) => updateContact('address', e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Footer Metni</label>
                            <textarea
                                value={config.contact?.footerText || ''}
                                onChange={(e) => updateContact('footerText', e.target.value)}
                                className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white"
                                rows={3}
                            />
                        </div>
                    </div>
                </section>

                <AdminUsersClient />
            </div>
        </div>
    );
}
