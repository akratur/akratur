"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { upsertStudentAction } from "@/actions/student";

interface StudentFormProps {
    initialData?: any;
    schoolId: string;
    parentTc: string; // The session userId is the Parent TC
    onSuccess: () => void;
}

export function StudentForm({ initialData, schoolId, parentTc, onSuccess }: StudentFormProps) {
    const [formData, setFormData] = useState(initialData || {
        name: "",
        schoolNo: "",
        classGrade: "",
        parentName: "",
        parentPhone: "",
        allergies: "",
        tcNo: parentTc // Default to parent TC if they are same or this is student TC login
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Ensure TC is passed
        const data = { ...formData, tcNo: parentTc };
        const result = await upsertStudentAction(data, parentTc, schoolId); // parentTc as parentId? logic discussed in thought
        setLoading(false);
        if (result.success) {
            onSuccess();
        } else {
            alert(result.error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Öğrenci Adı Soyadı</label>
                    <input required type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">TC Kimlik No</label>
                    <input disabled type="text" value={formData.tcNo || parentTc} className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 opacity-70 cursor-not-allowed" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Okul Numarası</label>
                    <input required type="text" value={formData.schoolNo || ''} onChange={e => setFormData({ ...formData, schoolNo: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Sınıfı</label>
                    <input required type="text" value={formData.classGrade || ''} onChange={e => setFormData({ ...formData, classGrade: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Veli Adı Soyadı</label>
                    <input required type="text" value={formData.parentName || ''} onChange={e => setFormData({ ...formData, parentName: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Veli Telefon</label>
                    <input required type="text" value={formData.parentPhone || ''} onChange={e => setFormData({ ...formData, parentPhone: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Alerji / Özel Durum</label>
                <textarea rows={3} value={formData.allergies || ''} onChange={e => setFormData({ ...formData, allergies: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2" placeholder="Yoksa boş bırakınız." />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Save size={18} />
                {loading ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}
            </button>
        </form>
    );
}
