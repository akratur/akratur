"use client";

import { motion } from "framer-motion";
import { Shield, BookOpen, Smile, MapPin, Phone, Mail, Award, Users, Globe } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="bg-slate-950 min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
                <div className="relative z-10 text-center max-w-4xl px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-6"
                    >
                        AKRA TUR
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed"
                    >
                        Öğrencilerimiz için sadece bir gezi değil, <span className="text-white font-medium">unutulmaz bir keşif yolculuğu</span> tasarlıyoruz.
                    </motion.p>
                </div>
            </section>

            {/* Mission / Vision */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-amber-500 mb-2">
                            <Award size={32} />
                            <span className="text-sm font-bold tracking-widest uppercase">Hakkımızda</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white leading-tight">Geçmişten Geleceğe Köprü Kuruyoruz</h2>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            Akra Tur olarak firmamız; "Öğrenci Gezileri Sadece Gezi Değildir" Bu kapsamda düzenlediğimiz turlar, sadece turistik birer faaliyet değil, aynı zamanda öğrencilerin vizyonunu genişleten birer eğitim materyalidir.
                        </p>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            Amacımız, öğrencilerimize ülkemizin tarihi ve doğal güzelliklerini tanıtırken, aynı zamanda bilim ve teknoloji ile buluşmalarını sağlamaktır. Uzman rehber kadromuz ve pedagojik yaklaşımımız ile her geziyi bir okula dönüştürüyoruz.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <img src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop" className="w-full h-64 object-cover rounded-2xl shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500" />
                        <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop" className="w-full h-64 object-cover rounded-2xl shadow-2xl -skew-y-3 hover:skew-y-0 transition-transform duration-500 mt-12" />
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-10 bg-slate-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center hover:border-amber-500/50 transition-colors group">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-500/20 group-hover:text-amber-500 transition-colors">
                                <Shield size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Güvenlik Önceliğimiz</h3>
                            <p className="text-slate-400">Tüm araçlarımız D2 belgeli olup, seyahat sigortası ve profesyonel sürücüler ile maksimum güvenlik sağlıyoruz.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center hover:border-blue-500/50 transition-colors group">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/20 group-hover:text-blue-500 transition-colors">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Eğitici İçerik</h3>
                            <p className="text-slate-400">Her turumuz müfredata uygun olarak planlanır. Rehberlerimiz konuları öğrencilerin seviyesine uygun anlatır.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center hover:border-green-500/50 transition-colors group">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/20 group-hover:text-green-500 transition-colors">
                                <Smile size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Eğlence ve Motivasyon</h3>
                            <p className="text-slate-400">Öğrenirken eğlenmek en kalıcı metoddur. Aktivitelerimiz ve yarışmalarımızla gezileri keyifli hale getiriyoruz.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-16 border border-slate-700 relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">İletişime Geçin</h2>
                            <p className="text-slate-400 mb-8">Okul turları, projeler ve işbirlikleri için bizimle her zaman iletişime geçebilirsiniz.</p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-amber-500">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500">Telefon</div>
                                        <div className="font-bold">+90 533 777 76 58 - 532 165 99 66 </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-amber-500">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500">E-posta</div>
                                        <div className="font-bold">info@ankatur.com</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-amber-500">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500">Adres</div>
                                        <div className="font-bold">Atatürk Bulvarı No:173 Muratpaşa, ANTALYA</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-full min-h-[300px] bg-slate-900 rounded-2xl overflow-hidden relative">
                            {/* Map Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50">
                                <div className="text-center">
                                    <Globe size={48} className="mx-auto mb-2 text-slate-600" />
                                    <p className="text-slate-500 font-bold">Harita Yükleniyor...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
