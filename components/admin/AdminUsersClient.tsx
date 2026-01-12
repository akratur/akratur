'use client';

import { useState, useEffect } from 'react';
import { Trash, Plus, Key, User, Shield } from 'lucide-react';
import { getAdminsAction, createAdminAction, deleteAdminAction, updateAdminPasswordAction } from '@/actions/admin-user';

interface AdminUser {
    id: string;
    username: string;
    createdAt: Date;
}

export default function AdminUsersClient() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    // Add Form State
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Password Update State
    const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
    const [updatePassword, setUpdatePassword] = useState('');

    useEffect(() => {
        loadAdmins();
    }, []);

    async function loadAdmins() {
        setLoading(true);
        const res = await getAdminsAction();
        if (res.success && res.admins) {
            setAdmins(res.admins);
        } else {
            alert(res.error || 'Yöneticiler yüklenemedi.');
        }
        setLoading(false);
    }

    async function handleAddAdmin(e: React.FormEvent) {
        e.preventDefault();
        if (!newUsername || !newPassword) return;

        const res = await createAdminAction(newUsername, newPassword);
        if (res.success) {
            setNewUsername('');
            setNewPassword('');
            setIsAdding(false);
            loadAdmins();
            alert('Yönetici başarıyla eklendi.');
        } else {
            alert(res.error);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Bu yöneticiyi silmek istediğinize emin misiniz?')) return;

        const res = await deleteAdminAction(id);
        if (res.success) {
            loadAdmins();
        } else {
            alert(res.error);
        }
    }

    async function handleUpdatePassword() {
        if (!selectedAdminId || !updatePassword) return;

        const res = await updateAdminPasswordAction(selectedAdminId, updatePassword);
        if (res.success) {
            setSelectedAdminId(null);
            setUpdatePassword('');
            alert('Şifre güncellendi.');
        } else {
            alert(res.error);
        }
    }

    if (loading && admins.length === 0) return <div className="text-white">Yükleniyor...</div>;

    return (
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                    <Shield size={20} className="text-red-500" />
                    Yönetici Hesapları
                </h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors"
                >
                    <Plus size={16} /> Yeni Yönetici
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddAdmin} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-6 animate-in fade-in slide-in-from-top-2">
                    <h3 className="text-white font-bold mb-3 text-sm">Yeni Yönetici Ekle</h3>
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Kullanıcı Adı"
                            value={newUsername}
                            onChange={e => setNewUsername(e.target.value)}
                            className="flex-1 bg-slate-900 border-slate-600 rounded px-3 py-2 text-white text-sm"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Şifre"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="flex-1 bg-slate-900 border-slate-600 rounded px-3 py-2 text-white text-sm"
                            required
                        />
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold">
                            Kaydet
                        </button>
                        <button type="button" onClick={() => setIsAdding(false)} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-sm">
                            İptal
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {admins.map(admin => (
                    <div key={admin.id} className="bg-slate-800 rounded-xl p-4 flex items-center justify-between border border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                                <User size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-white">{admin.username}</div>
                                <div className="text-xs text-slate-500">Eklenme: {new Date(admin.createdAt).toLocaleDateString('tr-TR')}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {selectedAdminId === admin.id ? (
                                <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-600">
                                    <input
                                        type="password"
                                        placeholder="Yeni Şifre"
                                        className="bg-transparent text-white text-sm px-2 w-32 outline-none"
                                        value={updatePassword}
                                        onChange={e => setUpdatePassword(e.target.value)}
                                        autoFocus
                                    />
                                    <button onClick={handleUpdatePassword} className="text-green-500 hover:bg-slate-800 p-1 rounded">
                                        <Plus size={16} className="rotate-45" /> {/* Use as confirm tick-ish */}
                                    </button>
                                    <button onClick={() => setSelectedAdminId(null)} className="text-slate-400 hover:bg-slate-800 p-1 rounded">
                                        <Plus size={16} className="rotate-45" /> {/* Use as cancel x */}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { setSelectedAdminId(admin.id); setUpdatePassword(''); }}
                                    className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                    title="Şifre Değiştir"
                                >
                                    <Key size={18} />
                                </button>
                            )}

                            <button
                                onClick={() => handleDelete(admin.id)}
                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                                title="Yöneticiyi Sil"
                            >
                                <Trash size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
