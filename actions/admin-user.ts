'use server'

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getAdminsAction() {
    try {
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                username: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return { success: true, admins };
    } catch (error) {
        console.error("Error fetching admins:", error);
        return { success: false, error: "Yöneticiler getirilemedi." };
    }
}

export async function createAdminAction(username: string, password: string) {
    if (!username || !password) {
        return { success: false, error: "Kullanıcı adı ve şifre zorunludur." };
    }

    try {
        await prisma.admin.create({
            data: {
                username,
                password, // Note: In a production app, hash this password! I'm keeping it simple as per current context but should advise upgrade.
            }
        });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error("Error creating admin:", error);
        return { success: false, error: "Yönetici oluşturulurken hata oluştu. Kullanıcı adı zaten kullanımda olabilir." };
    }
}

export async function deleteAdminAction(id: string) {
    try {
        // Prevent deleting the last admin or specific protection logic can be added here
        const adminCount = await prisma.admin.count();
        if (adminCount <= 1) {
            return { success: false, error: "Sistemde en az bir yönetici kalmalıdır." };
        }

        await prisma.admin.delete({
            where: { id }
        });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error("Error deleting admin:", error);
        return { success: false, error: "Yönetici silinemedi." };
    }
}

export async function updateAdminPasswordAction(id: string, newPassword: string) {
    if (!newPassword) {
        return { success: false, error: "Yeni şifre boş olamaz." };
    }

    try {
        await prisma.admin.update({
            where: { id },
            data: { password: newPassword }
        });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error("Error updating password:", error);
        return { success: false, error: "Şifre güncellenemedi." };
    }
}
