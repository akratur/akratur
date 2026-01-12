"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { MapPin, Users, School } from "lucide-react";
import Link from "next/link";

interface ScheduledTour {
    id: string;
    title: string;
    coverImage: string;
    date: Date;
    location: string;
    schoolName: string;
    schoolCity: string;
    schoolDistrict: string;
    schoolId: string;
    registeredCount: number;
}

interface TourListProps {
    tours: ScheduledTour[];
}

export function TourList({ tours }: TourListProps) {
    if (tours.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-100 dark:bg-slate-900 rounded-3xl mt-12">
                <p className="text-xl text-slate-500">Henüz planlanmış bir tur bulunmamaktadır.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {tours.map((tour, idx) => (
                <motion.div
                    key={`${tour.id}-${tour.schoolId}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                    {/* Image Badge */}
                    <div className="relative h-56 overflow-hidden">
                        <img
                            src={tour.coverImage}
                            alt={tour.title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                            {format(new Date(tour.date), "d MMM yyyy", { locale: tr })}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{tour.title}</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-2 text-slate-500 text-sm">
                                <School size={16} className="text-amber-500 mt-0.5 shrink-0" />
                                <div>
                                    <span className="font-medium text-slate-900 dark:text-slate-200 block">{tour.schoolName}</span>
                                    <span className="text-slate-400 text-xs">{tour.schoolCity} / {tour.schoolDistrict}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <MapPin size={16} className="text-amber-500 shrink-0" />
                                <span>{tour.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <Users size={16} className="text-green-500 shrink-0" />
                                <span><span className="font-bold text-green-600 dark:text-green-400">{tour.registeredCount}</span> Kayıtlı Öğrenci</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Link
                                href={`/tours/${tour.id}?schoolId=${tour.schoolId}`}
                                className="block w-full py-3 rounded-xl border border-amber-500 text-amber-500 font-bold text-center hover:bg-amber-500 hover:text-white transition-all"
                            >
                                Detayları İncele
                            </Link>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
