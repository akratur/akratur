"use client";

import { useStore } from "@/lib/store";
import { format } from "date-fns";
import { tr } from "date-fns/locale"; // Turkish locale
import { Calendar, MapPin, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function UpcomingEvents() {
    const { schools, tours } = useStore();

    // Flatten the data: School -> Assigned Tours -> Tour Details
    const events = schools.flatMap((school) => {
        return school.assignedTours.map((assignment) => {
            const tour = tours.find((t) => t.id === assignment.tourId);
            if (!tour) return null;
            return {
                school,
                tour,
                // We assume the tour date is fixed per tour definition for this MVP, 
                // or we could assume the assignment might override date in a complex app. 
                // For now using tour.date.
                date: new Date(tour.date),
            };
        });
    }).filter((e): e is { school: typeof schools[0]; tour: typeof tours[0]; date: Date } => e !== null);

    // Sort by date ascending (nearest first)
    // Filter out past events if needed, but for demo we might want to keep them or just next upcoming
    const now = new Date();
    const upcomingEvents = events
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    // .filter(e => e.date >= now); // Optional: hide past events

    if (upcomingEvents.length === 0) {
        return (
            <div className="py-20 text-center text-slate-400">
                <p>Planlanmış yaklaşan etkinlik bulunmamaktadır.</p>
            </div>
        );
    }

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent inline-block mb-4"
                    >
                        Yaklaşan Etkinlikler
                    </motion.h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-red-500 mx-auto rounded-full" />
                    <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Öğrencilerimiz için planlanan kültür, bilim ve eğlence dolu gezilerimiz.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingEvents.map((event, index) => (
                        <motion.div
                            key={`${event.school.id}-${event.tour.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Image Container */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={event.tour.coverImage}
                                    alt={event.tour.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    {event.tour.type === 'culture' ? 'Kültür' :
                                        event.tour.type === 'science' ? 'Bilim' :
                                            event.tour.type === 'education' ? 'Eğitim' : 'Eğlence'}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 text-sm font-medium mb-3">
                                    <Calendar size={16} />
                                    <time>{format(event.date, "d MMMM yyyy", { locale: tr })}</time>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-amber-500 transition-colors">
                                    {event.tour.title}
                                </h3>

                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-4">
                                    <Building2 size={16} className="text-slate-400" />
                                    <span className="line-clamp-1">{event.school.name}</span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                                        <MapPin size={14} />
                                        {event.tour.location}
                                    </div>
                                    <Link
                                        href={`/tours/${event.tour.id}`}
                                        className="flex items-center gap-1 text-amber-600 font-medium hover:gap-2 transition-all p-2 rounded-md hover:bg-amber-50 dark:hover:bg-slate-800"
                                    >
                                        İncele <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
