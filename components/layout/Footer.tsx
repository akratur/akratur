"use client";

import { useStore } from "@/lib/store";
import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const { siteConfig } = useStore();
    const { contact } = siteConfig;

    if (!contact) return null;

    return (
        <footer className="bg-slate-900 pt-20 pb-10 text-slate-400 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Text */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 text-white font-bold text-2xl">
                            <div className="bg-amber-500 rounded-lg p-1.5 ">
                                <span className="text-white">AT</span>
                            </div>
                            AKRA TUR
                        </Link>
                        <p className="leading-relaxed text-sm">
                            {contact.footerText || "Okullar için özel turlar."}
                        </p>
                        <div className="flex gap-4">
                            {contact.socials?.facebook && (
                                <a href={contact.socials.facebook} className="p-2 bg-slate-800 rounded-full hover:bg-amber-500 hover:text-white transition-colors">
                                    <Facebook size={18} />
                                </a>
                            )}
                            {contact.socials?.instagram && (
                                <a href={contact.socials.instagram} className="p-2 bg-slate-800 rounded-full hover:bg-amber-500 hover:text-white transition-colors">
                                    <Instagram size={18} />
                                </a>
                            )}
                            {contact.socials?.twitter && (
                                <a href={contact.socials.twitter} className="p-2 bg-slate-800 rounded-full hover:bg-amber-500 hover:text-white transition-colors">
                                    <Twitter size={18} />
                                </a>
                            )}
                            {contact.socials?.linkedin && (
                                <a href={contact.socials.linkedin} className="p-2 bg-slate-800 rounded-full hover:bg-amber-500 hover:text-white transition-colors">
                                    <Linkedin size={18} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Hızlı Linkler</h3>
                        <ul className="space-y-4">
                            <li><Link href="/" className="hover:text-amber-500 transition-colors">Ana Sayfa</Link></li>
                            <li><Link href="/about" className="hover:text-amber-500 transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/parent/login" className="hover:text-amber-500 transition-colors">Veli Girişi</Link></li>
                            <li><Link href="/school/login" className="hover:text-amber-500 transition-colors">Okul Girişi</Link></li>
                            <li><Link href="/tours" className="hover:text-amber-500 transition-colors">Turlarımız</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">İletişim</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Phone className="mt-1 text-amber-500" size={18} />
                                <span>{contact.phone}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="mt-1 text-amber-500" size={18} />
                                <span>{contact.email}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-1 text-amber-500" size={18} />
                                <span>{contact.address}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter (Visual Only) */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Bülten</h3>
                        <p className="text-sm mb-4">Yeni turlar ve kampanyalardan haberdar olun.</p>
                        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="E-posta adresiniz"
                                className="bg-white px-4 py-2 rounded-lg text-slate-900 w-full outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <button className="bg-amber-500 text-white p-2 rounded-lg hover:bg-amber-600 transition-colors">
                                <ArrowRight size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p>&copy; {new Date().getFullYear()} AKRA TUR. Tüm hakları saklıdır.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
                        <Link href="#" className="hover:text-white transition-colors">Kullanım Şartları</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
