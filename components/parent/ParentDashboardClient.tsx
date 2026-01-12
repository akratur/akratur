"use client";

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CheckCircle, Clock, MapPin, Calendar, CreditCard, ChevronRight, UserPlus, School as SchoolIcon, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StudentForm } from "@/components/profile/StudentForm";
import { registerForTourAction } from "@/actions/student";
import { voteSurveyAction } from "@/actions/survey";
import { submitReviewAction } from "@/actions/review";

interface Props {
    student: any;
    school: any;
    tours: any[];
    surveys: any[];
    parentTc: string;
}

export function ParentDashboardClient({ student, school, tours, surveys, parentTc }: Props) {
    const [activeTab, setActiveTab] = useState<'tours' | 'register' | 'surveys' | 'reviews'>('tours');
    const [votedSurveyIds, setVotedSurveyIds] = useState<string[]>([]);

    // Check local storage for votes
    useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('votedSurveys');
            if (stored) setVotedSurveyIds(JSON.parse(stored));
        }
    });

    const handleRegister = async (tourId: string, price: number) => {
        if (!confirm(`Bu tura kayıt olmak istediğinize emin misiniz?\nFiyat: ${price} TL`)) return;

        const result = await registerForTourAction(student.id, tourId);
        if (result.success) {
            alert("Ön kaydınız alındı. Lütfen ödemeyi okula yapınız.");
            window.location.reload();
        } else {
            alert(result.error);
        }
    };

    const handleVote = async (surveyId: string, option: string) => {
        if (votedSurveyIds.includes(surveyId)) return;

        const result = await voteSurveyAction(surveyId, option);
        if (result.success) {
            const newVoted = [...votedSurveyIds, surveyId];
            setVotedSurveyIds(newVoted);
            localStorage.setItem('votedSurveys', JSON.stringify(newVoted));
            alert("Oyunuz kaydedildi!");
        }
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">
                            Hoşgeldiniz{student?.parentName ? `, ${student.parentName}` : ''}
                        </h2>
                        <div className="flex items-center gap-2 opacity-90 text-sm">
                            <span className="font-medium bg-white/20 px-2 py-0.5 rounded flex items-center gap-1">
                                <SchoolIcon size={14} />
                                {school?.name}
                            </span>
                            <span>•</span>
                            <span>{school?.district}, {school?.city}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                    <p className="opacity-90 text-sm mb-2 font-medium flex items-center gap-2">
                        <CreditCard size={16} />
                        Ödeme Bilgileri (Okul Hesabı)
                    </p>
                    <div className="font-mono bg-black/20 p-2 rounded text-sm select-all">
                        {school?.iban || 'IBAN bilgisi girilmemiştir. Lütfen okul yönetimi ile iletişime geçiniz.'}
                    </div>
                    <p className="text-[10px] mt-1 opacity-70">
                        *Havale/EFT yaparken açıklama kısmına <strong>Öğrenci Adı Soyadı</strong> ve <strong>Tur Adı</strong> yazmayı unutmayınız.
                    </p>
                </div>

                <p className="text-sm opacity-80 border-t border-white/20 pt-3">
                    {student
                        ? `Kayıtlı Öğrenci: ${student.name} (${student.classGrade} - ${student.schoolNo})`
                        : "Henüz öğrenci kaydı oluşturmadınız. Lütfen 'Öğrenci Kaydı Oluştur' sekmesinden bilgilerinizi giriniz."}
                </p>
            </div>

            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('tours')}
                    className={`px-4 py-2 font-medium bg-transparent border-b-2 transition-colors whitespace-nowrap ${activeTab === 'tours' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Okul Turları
                </button>
                <button
                    onClick={() => setActiveTab('register')}
                    className={`px-4 py-2 font-medium bg-transparent border-b-2 transition-colors whitespace-nowrap ${activeTab === 'register' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    {student ? 'Bilgileri Güncelle' : 'Öğrenci Kaydı Oluştur'}
                </button>
                <button
                    onClick={() => setActiveTab('surveys')}
                    className={`px-4 py-2 font-medium bg-transparent border-b-2 transition-colors whitespace-nowrap ${activeTab === 'surveys' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Anketler
                </button>
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-4 py-2 font-medium bg-transparent border-b-2 transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Değerlendirmeler
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'tours' && (
                    <motion.div
                        key="tours"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="grid gap-6"
                    >
                        {tours.map(tour => {
                            const registration = student?.registrations.find((r: any) => r.tourId === tour.id);

                            return (
                                <div key={tour.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row">
                                    <div className="md:w-1/3 h-48 md:h-auto relative">
                                        <img src={tour.coverImage} className="w-full h-full object-cover" />
                                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur text-slate-900 dark:text-white px-3 py-1 rounded-full font-bold text-sm shadow-sm">
                                            {tour.price} TL
                                        </div>
                                    </div>
                                    <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tour.title}</h3>
                                                {registration && (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1
                                            ${registration.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                                           `}>
                                                        {registration.status === 'approved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                        {registration.status === 'approved' ? 'Onaylandı' : 'Ödeme Bekleniyor'}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-500 mb-4 line-clamp-2">{tour.description}</p>
                                            <div className="flex gap-4 text-sm text-slate-500 mb-6">
                                                <span className="flex items-center gap-1"><Calendar size={14} /> {format(new Date(tour.date), "d MMM yyyy", { locale: tr })}</span>
                                                <span className="flex items-center gap-1"><MapPin size={14} /> {tour.location}</span>
                                            </div>
                                        </div>

                                        {student ? (
                                            !registration ? (
                                                <button
                                                    onClick={() => handleRegister(tour.id, tour.price)}
                                                    className="self-start px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
                                                >
                                                    Kayıt Ol <ChevronRight size={18} />
                                                </button>
                                            ) : (
                                                <div className="self-start text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
                                                    {registration.status === 'approved'
                                                        ? "Kayıt işleminiz tamamlanmıştır. İyi eğlenceler!"
                                                        : "Kaydınız alındı. Lütfen okula giderek ödeme yapınız. Ödeme sonrası buradaki durum 'Onaylandı' olacaktır."}
                                                </div>
                                            )
                                        ) : (
                                            <div className="text-amber-600 text-sm font-medium bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg flex items-center gap-2">
                                                <UserPlus size={16} />
                                                Kayıt olmak için önce 'Öğrenci Kaydı Oluştur' sekmesinden bilgilerinizi giriniz.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {tours.length === 0 && (
                            <div className="text-center py-10 text-slate-400">Bu okul için henüz tur planlanmamış.</div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'register' && (
                    <motion.div
                        key="register"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg max-w-2xl mx-auto"
                    >
                        <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Öğrenci & Veli Bilgileri</h3>
                        <StudentForm
                            initialData={student}
                            schoolId={school?.id || ""}
                            parentTc={parentTc}
                            onSuccess={() => {
                                alert("Bilgiler kaydedildi!");
                                setActiveTab('tours');
                            }}
                        />
                    </motion.div>
                )}


                {activeTab === 'surveys' && (
                    <motion.div
                        key="surveys"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold mb-4 px-1 text-slate-800 dark:text-white">Geziler Hakkında Fikriniz Önemli</h3>

                        {surveys.length === 0 && (
                            <div className="text-center py-10 text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                                Aktif anket bulunmuyor.
                            </div>
                        )}

                        {surveys.map(survey => {
                            const hasVoted = votedSurveyIds.includes(survey.id);

                            return (
                                <div key={survey.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{survey.title}</h4>
                                    <p className="text-slate-500 mb-6">{survey.description}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {survey.options.map((option: string, idx: number) => (
                                            <button
                                                key={idx}
                                                disabled={!!hasVoted}
                                                onClick={() => handleVote(survey.id, option)}
                                                className={`active:scale-95 transition-all text-left p-4 rounded-xl border relative overflow-hidden group
                                                    ${hasVoted
                                                        ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed'
                                                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-900/10 border-slate-200 dark:border-slate-700 hover:border-green-500 cursor-pointer'
                                                    }`}
                                            >
                                                <span className={`font-bold block mb-1 ${hasVoted ? 'text-slate-500' : 'text-slate-700 dark:text-slate-300 group-hover:text-green-600'}`}>
                                                    {option}
                                                </span>
                                                {hasVoted && (
                                                    <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                                                        <CheckCircle size={12} /> Oy Kullanıldı
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {activeTab === 'reviews' && (
                    <ReviewsSection tours={tours} student={student} parentTc={parentTc} />
                )}
            </AnimatePresence>
        </div>
    );
}

function ReviewsSection({ tours, student, parentTc }: { tours: any[], student: any, parentTc: string }) {
    const [reviewForm, setReviewForm] = useState<{ tourId: string, rating: number, comment: string } | null>(null);

    // Identify completetd tours
    // A tour is completed if date is passed? Or status?
    // Let's check date.
    const completedTours = tours.filter(t => new Date(t.date) < new Date());

    // Check if user attended? registration.status === 'approved'
    // If student is null, can't review?
    // Let's filter by: Student registered and approved.

    const attendTours = completedTours.filter(t =>
        student?.registrations.some((r: any) => r.tourId === t.id && r.status === 'approved')
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewForm) return;

        const result = await submitReviewAction(reviewForm.tourId, parentTc, reviewForm.rating, reviewForm.comment);
        if (result.success) {
            alert("Yorumunuz gönderildi. Onaylandıktan sonra yayınlanacaktır.");
            setReviewForm(null);
        } else {
            alert(result.error);
        }
    };

    if (attendTours.length === 0) {
        return (
            <div className="text-center py-10 text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                Henüz tamamlanmış ve katıldığınız bir tur bulunmuyor.
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            {attendTours.map(tour => (
                <div key={tour.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white">{tour.title}</h4>
                            <p className="text-xs text-slate-500">{format(new Date(tour.date), "d MMMM yyyy", { locale: tr })}</p>
                        </div>
                        <button
                            onClick={() => setReviewForm({ tourId: tour.id, rating: 5, comment: "" })}
                            className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                        >
                            Değerlendir
                        </button>
                    </div>

                    {reviewForm?.tourId === tour.id && (
                        <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <div className="flex gap-2 mb-3">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star} type="button"
                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                        className={`${star <= reviewForm.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                                    >
                                        <Star size={24} className={star <= reviewForm.rating ? 'fill-current' : ''} />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm mb-3"
                                rows={3}
                                placeholder="Deneyiminizi paylaşın..."
                                value={reviewForm.comment}
                                onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            />
                            <div className="flex gap-2 justify-end">
                                <button type="button" onClick={() => setReviewForm(null)} className="text-slate-500 text-sm px-3">İptal</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Gönder</button>
                            </div>
                        </form>
                    )}
                </div>
            ))}
        </div>
    );
}
