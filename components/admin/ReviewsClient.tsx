"use client";

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageSquare, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { updateReviewStatusAction } from "@/actions/review";

interface Review {
    id: string;
    tourId: string;
    parentId: string;
    rating: number;
    comment: string;
    status: string; // 'pending', 'approved', 'rejected'
    createdAt: string;
    tour: { title: string };
    parent: { parentName: string }; // Assuming we assume parentName from link?
    // Wait, Schema for Parent doesn't have name? Parent has 'students'. 
    // Review linked to Parent.
    // Parent Schema: id, tcNo. (No Name).
    // Review Schema: parentId.
    // We might need to fetch students of parent to get name? Or just show TC?
    // Let's passed serialized data.
}

interface Props {
    reviews: Review[];
}

export function ReviewsClient({ reviews }: Props) {
    const handleStatus = async (id: string, status: string) => {
        if (!confirm(`Bu yorumu ${status === 'approved' ? 'onaylamak' : 'reddetmek'} istediğinize emin misiniz?`)) return;

        const result = await updateReviewStatusAction(id, status);
        if (result.success) {
            window.location.reload();
        } else {
            alert("Hata oluştu.");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <MessageSquare className="text-purple-500" />
                Yorum Yönetimi
            </h1>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
                            <th className="p-4 font-medium">Tur</th>
                            <th className="p-4 font-medium">Veli / TC</th>
                            <th className="p-4 font-medium">Yorum & Puan</th>
                            <th className="p-4 font-medium">Durum</th>
                            <th className="p-4 font-medium text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {reviews.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">Görüntülenecek yorum bulunmuyor.</td>
                            </tr>
                        )}
                        {reviews.map(review => (
                            <tr key={review.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-slate-900 dark:text-white">{review.tour.title}</div>
                                    <div className="text-xs text-slate-500">{format(new Date(review.createdAt), "d MMM yyyy", { locale: tr })}</div>
                                </td>
                                <td className="p-4 text-sm text-slate-700 dark:text-slate-300">
                                    {review.parent.parentName || `TC: ${review.parentId}`}
                                    {/* Note: I need to handle name properly in page.tsx */}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                                        {Array.from({ length: review.rating }).map((_, i) => (
                                            <span key={i}>★</span>
                                        ))}
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md">{review.comment}</p>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold
                                        ${review.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-amber-100 text-amber-700'}`}>
                                        {review.status === 'approved' ? 'Onaylandı' :
                                            review.status === 'rejected' ? 'Reddedildi' : 'Onay Bekliyor'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {review.status === 'pending' && (
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => handleStatus(review.id, 'approved')}
                                                className="text-green-600 hover:bg-green-50 p-1 rounded transition-colors"
                                                title="Onayla"
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleStatus(review.id, 'rejected')}
                                                className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                                title="Reddet"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    )}
                                    {review.status !== 'pending' && (
                                        <button
                                            onClick={() => handleStatus(review.id, 'pending')} // Allow reset? or delete
                                            className="text-slate-400 hover:text-slate-600 p-1"
                                            title="Geri al / Beklemeye a"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
