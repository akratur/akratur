"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, Clock, MapPin, PlayCircle, Info, ChevronLeft, School, Users, CheckCircle, Map as MapIcon, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { voteSurveyAction } from "@/actions/survey";

// Define Types compatible with what we pass from Server Component
interface TourInfo {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    images: string[];
    type: string;
    date: string; // ISO string
    location: string;
    itinerary: { time: string; activity: string }[];
}

interface SchoolInfo {
    id: string;
    name: string;
    city: string;
    district: string;
}

interface LocationInfo {
    id: string;
    title: string;
    description: string;
    image: string;
    videoUrl?: string | null;
}

interface SurveyInfo {
    id: string;
    title: string;
    description: string;
    options: string[];
    votes: { option: string; count: number }[];
    isActive: boolean;
}

interface Props {
    tour: TourInfo;
    school?: SchoolInfo | null;
    locations: LocationInfo[];
    registeredCount: number;
    surveys: SurveyInfo[];
}

export function TourDetailView({ tour, school, locations, registeredCount, surveys }: Props) {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [votedSurveyIds, setVotedSurveyIds] = useState<string[]>([]);

    // Load voted surveys locally
    useEffect(() => {
        const stored = localStorage.getItem('votedSurveys');
        if (stored) {
            setVotedSurveyIds(JSON.parse(stored));
        }
    }, []);

    const handleVote = async (surveyId: string, option: string) => {
        if (votedSurveyIds.includes(surveyId)) return;

        // Optimistic update or just wait for revalidate
        const result = await voteSurveyAction(surveyId, option);
        if (result.success) {
            const newVoted = [...votedSurveyIds, surveyId];
            setVotedSurveyIds(newVoted);
            localStorage.setItem('votedSurveys', JSON.stringify(newVoted));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Hero Header */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0"
                >
                    <img
                        src={tour.coverImage}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

                <div className="absolute top-24 left-4 z-10 md:top-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors border border-white/10"
                    >
                        <ChevronLeft size={20} />
                        Geri
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="inline-block px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20">
                                    {tour.type === 'culture' ? 'Kültür Turu' : tour.type === 'science' ? 'Bilim Turu' : 'Eğlence Turu'}
                                </span>
                                {school && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-bold border border-white/10">
                                        <School size={14} />
                                        {school.name}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 shadow-sm leading-tight max-w-4xl">{tour.title}</h1>

                            <div className="flex flex-wrap items-center gap-6 text-slate-200 text-lg font-medium">
                                <div className="flex items-center gap-2">
                                    <Calendar className="text-amber-400" />
                                    <span>{format(new Date(tour.date), "d MMMM yyyy", { locale: tr })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-amber-400" />
                                    <span>{tour.location}</span>
                                </div>
                                {school && (
                                    <div className="flex items-center gap-2">
                                        <Users className="text-green-400" />
                                        <span><span className="text-white font-bold">{registeredCount}</span> Kayıtlı Öğrenci</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* School Alert Badge if School Context Exists */}
                        {school && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-amber-500/50">
                                        {school.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{school.name} için Özel Gezi</h3>
                                        <p className="text-slate-400 text-sm">{school.city} / {school.district}</p>
                                    </div>
                                </div>
                                <div className="hidden sm:block">
                                    <span className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-sm font-bold flex items-center gap-2">
                                        <CheckCircle size={16} />
                                        Aktif Kayıt
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        {/* Locations Cards (New Section) */}
                        {locations.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800"
                            >
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg text-purple-600 dark:text-purple-500">
                                        <MapIcon size={24} />
                                    </div>
                                    Ziyaret Edilecek Lokasyonlar
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {locations.map((loc) => (
                                        <div key={loc.id} className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
                                            <div className="h-48 relative group">
                                                <img src={loc.image} alt={loc.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                {loc.videoUrl && (
                                                    <a href={loc.videoUrl} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 bg-black/70 text-white rounded-full p-2 hover:bg-amber-500 transition-colors">
                                                        <PlayCircle size={20} />
                                                    </a>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{loc.title}</h3>
                                                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3">{loc.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}


                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800"
                        >
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg text-amber-600 dark:text-amber-500">
                                    <Info size={24} />
                                </div>
                                Tur Detayları
                            </h2>
                            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                                {tour.description}
                            </p>
                        </motion.div>

                        {/* Itinerary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800"
                        >
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-slate-900 dark:text-white">
                                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-500">
                                    <Clock size={24} />
                                </div>
                                Saatlik Program
                            </h2>
                            <div className="space-y-0 relative pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-3">
                                {tour.itinerary.map((item, index) => (
                                    <div key={index} className="relative pl-8 pb-10 group last:pb-0">
                                        {/* Timeline Dot */}
                                        <div className="absolute left-[-21px] top-0 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center z-10 group-hover:border-amber-500 transition-colors">
                                            <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-amber-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-amber-500'} transition-colors`} />
                                        </div>

                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 group-hover:border-amber-500/30 group-hover:bg-amber-50/50 dark:group-hover:bg-amber-500/10 transition-all">
                                            <span className="text-amber-600 dark:text-amber-500 font-bold text-lg block mb-1">{item.time}</span>
                                            <span className="text-slate-800 dark:text-slate-200 text-lg font-medium">{item.activity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Gallery */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Galeri</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {tour.images.slice(0, 6).map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-lg"
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <img
                                            src={img}
                                            alt={`Gallery ${idx}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full border border-white/30 text-white">
                                                <Info size={24} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar info */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {school ? (
                                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-8 text-white shadow-2xl shadow-amber-500/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10" />

                                    <h3 className="text-2xl font-bold mb-4 relative z-10">Kayıt Olun</h3>
                                    <p className="mb-6 text-amber-50 relative z-10 text-lg opacity-90">
                                        Bu tura katılmak için veli girişi yaparak öğrenci kaydınızı tamamlayın.
                                    </p>

                                    <Link
                                        href="/parent/login"
                                        className="relative z-10 w-full py-4 bg-white text-amber-600 text-center rounded-xl font-bold text-lg hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 block"
                                    >
                                        Veli Girişi Yap
                                    </Link>

                                    <div className="mt-6 pt-6 border-t border-white/20 relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-white/20 p-2 rounded-lg"><School size={18} /></div>
                                            <div>
                                                <div className="text-xs uppercase tracking-wide opacity-75">Okul</div>
                                                <div className="font-bold">{school.name}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800">
                                    <h3 className="font-bold text-lg mb-2">Genel Bilgi</h3>
                                    <p className="text-slate-400 text-sm">Bu tur detaylarını görüntülüyorsunuz. Kayıt olmak için okulunuza tanımlı turları kontrol ediniz.</p>
                                </div>
                            )}

                            {/* Contact Helper */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Yardıma mı ihtiyacınız var?</h4>
                                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        7/24 Canlı Destek
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                                        Güvenli Ödeme
                                    </li>
                                </ul>
                            </div>

                            {/* Active Survey Section */}
                            {surveys.filter(s => s.isActive).map(survey => (
                                <div key={survey.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-5">
                                        <Info size={100} />
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 relative z-10">{survey.title}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 relative z-10">{survey.description}</p>

                                    <div className="space-y-2 relative z-10">
                                        {survey.options.map((option, idx) => {
                                            const totalVotes = survey.votes.reduce((acc, curr) => acc + curr.count, 0);
                                            const optionVotes = survey.votes.find(v => v.option === option)?.count || 0;
                                            const percentage = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
                                            const hasVoted = votedSurveyIds.includes(survey.id);

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => !hasVoted && handleVote(survey.id, option)}
                                                    disabled={hasVoted}
                                                    className={`w-full text-left p-2 rounded-lg transition-colors relative overflow-hidden group ${hasVoted ? 'cursor-default bg-slate-100 dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                                >
                                                    <div className={`absolute inset-0 w-0 transition-all duration-500 ${!hasVoted && 'group-hover:w-full bg-amber-500/10'}`} />
                                                    <div
                                                        className={`absolute inset-y-0 left-0 transition-all duration-1000 ${hasVoted ? 'bg-green-500/20' : 'bg-amber-500/20'}`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                    <div className="flex justify-between items-center relative z-10">
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{option}</span>
                                                        <span className={`text-xs font-bold ${hasVoted ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-500'}`}>{percentage}%</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-xs text-slate-400">Toplam {survey.votes.reduce((acc, v) => acc + v.count, 0)} oy</p>
                                            {votedSurveyIds.includes(survey.id) && (
                                                <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                                                    <CheckCircle size={12} />
                                                    Oyunuz Kaydedildi
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox for Gallery */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            src={selectedImage}
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            className="absolute top-6 right-6 text-white p-3 hover:bg-white/10 rounded-full transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={24} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
