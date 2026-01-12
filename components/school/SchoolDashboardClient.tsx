"use client";

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CheckCircle, Clock, FileDown, User, Bus, Upload, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { updateRegistrationStatusAction, uploadStudentListAction } from "@/actions/school";

interface Props {
    school: any;
    tours: any[];
    initialStudentsForTour: any[]; // Map of tourId -> students
}

export function SchoolDashboardClient({ school, tours, initialStudentsForTour }: Props) {
    const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Derived state for students (we could fetch fresh on selection, or pass all)
    // For simplicity, let's assume initialStudentsForTour contains ALL students with their registrations, 
    // and we filter on client? 
    // Or we pass a big list of unique students, and filter by registration.

    // Let's assume `initialStudentsForTour` is actually "all students of the school", and we filter.
    const allStudents = initialStudentsForTour;

    const studentsForTour = selectedTourId
        ? allStudents.filter((s: any) => s.registrations.some((r: any) => r.tourId === selectedTourId))
        : [];

    const handlePrint = () => {
        window.print();
    };

    const handleStatusUpdate = async (studentId: string, tourId: string, status: string) => {
        if (!confirm("Durumu değiştirmek istediğinize emin misiniz?")) return;
        const result = await updateRegistrationStatusAction(studentId, tourId, status);
        if (result.success) {
            // We rely on server revalidation to update UI?
            // Or simpler: alert and refresh
            // Next.js Server Action revalidatePath updates the server component, but client state might need refresh.
            // Usually router.refresh() is needed if we want to re-render server component.
            // But if we passed data as props, we need to refresh.
            window.location.reload(); // Simple brute force refresh for MVP
        } else {
            alert("Hata: " + result.error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        const result = await uploadStudentListAction(formData, school.id);
        setUploading(false);

        if (result.success) {
            alert(`${result.count} öğrenci başarıyla yüklendi/güncellendi.`);
            window.location.reload();
        } else {
            alert("Hata: " + result.error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header / Upload Section */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Hoşgeldiniz, {school.name}</h2>
                    <p className="text-slate-500 text-sm">Turları yönetin veya öğrenci listesi yükleyin.</p>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <label className={`cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        {uploading ? <RefreshCw className="animate-spin" size={18} /> : <Upload size={18} />}
                        {uploading ? 'Yükleniyor...' : 'Öğrenci Listesi Yükle (Excel)'}
                        <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                    <p className="text-xs text-slate-400">
                        Format: TC No, Ad, Soyad, Sınıf, Okul No
                    </p>
                    <div className="text-right mt-1">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            Sisteme Yüklü Toplam Öğrenci: <span className="text-slate-900 dark:text-white text-sm">{allStudents.length}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Tours List */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <Bus size={24} className="text-blue-500" />
                    Okulunuza Tanımlı Turlar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tours.map((tour) => (
                        <motion.div
                            key={tour.id}
                            onClick={() => setSelectedTourId(tour.id)}
                            className={`cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 relative group
                        ${selectedTourId === tour.id
                                    ? "border-blue-500 shadow-lg ring-2 ring-blue-500/20"
                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400"
                                }
                    `}
                        >
                            <div className="h-32 overflow-hidden">
                                <img src={tour.coverImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{tour.title}</h3>
                                <p className="text-slate-500 text-sm mb-3">{format(new Date(tour.date), "d MMMM yyyy", { locale: tr })}</p>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-blue-600 dark:text-blue-400">{tour.price} TL</span>
                                    {selectedTourId === tour.id && <span className="text-blue-500 flex items-center gap-1"><CheckCircle size={14} /> Seçildi</span>}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Students List for Selected Tour */}
            {selectedTourId ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Kayıtlı Öğrenci Listesi</h3>
                            <p className="text-slate-500 text-sm">
                                {tours.find(t => t.id === selectedTourId)?.title} - {studentsForTour.length} Öğrenci
                            </p>
                        </div>
                        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 print:hidden">
                            <FileDown size={18} />
                            Listeyi Yazdır
                        </button>
                    </div>

                    {studentsForTour.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            Bu etkinlik için henüz kayıt bulunmamaktadır.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
                                        <th className="p-4 font-medium">Öğrenci Bilgisi</th>
                                        <th className="p-4 font-medium">Veli Bilgisi</th>
                                        <th className="p-4 font-medium">Sağlık / Alerji</th>
                                        <th className="p-4 font-medium text-center">Ödeme Durumu</th>
                                        <th className="p-4 font-medium text-right print:hidden">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {studentsForTour.map((student: any) => {
                                        const registration = student.registrations.find((r: any) => r.tourId === selectedTourId);
                                        if (!registration) return null;

                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-medium text-slate-900 dark:text-white">{student.name}</div>
                                                    <div className="text-xs text-slate-500">{student.classGrade} - {student.schoolNo}</div>
                                                    <div className="text-xs text-slate-400">TC: {student.tcNo}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-slate-700 dark:text-slate-300">{student.parentName}</div>
                                                    <div className="text-xs text-slate-500">{student.parentPhone}</div>
                                                </td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400 text-sm max-w-xs">{student.allergies || '-'}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
                                                ${registration.status === 'approved'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                                        }`}
                                                    >
                                                        {registration.status === 'approved' ? (
                                                            <><CheckCircle size={12} /> Ödendi</>
                                                        ) : (
                                                            <><Clock size={12} /> Bekliyor</>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right print:hidden">
                                                    {registration.status === 'pending_payment' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(student.id, selectedTourId, 'approved')}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            Onayla
                                                        </button>
                                                    )}
                                                    {registration.status === 'approved' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(student.id, selectedTourId, 'pending_payment')}
                                                            className="text-xs text-slate-400 hover:text-slate-600 underline"
                                                        >
                                                            İptal
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            ) : (
                <div className="text-center py-20 text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                    <Bus size={48} className="mx-auto text-slate-300 mb-4" />
                    Detaylarını görmek için yukarıdan bir tur seçiniz.
                </div>
            )}
        </div>
    );
}
