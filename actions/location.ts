'use server'

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function upsertLocationAction(data: any) {
    try {
        // Ensure data.id is undefined or empty string, not "new" for create if possible, 
        // but prisma.upsert requires a where clause that matches a unique field.
        // Usually we handle "new" by checking if it exists or just using update/create logic manually if ID is not reliable.
        // But here, let's treat strictly: if ID exists -> upsert/update. If not -> create.

        if (data.id && data.id.length > 5) { // Simple check if it looks like a real ID
            await prisma.location.upsert({
                where: { id: data.id },
                update: {
                    title: data.title,
                    description: data.description,
                    image: data.image,
                    videoUrl: data.videoUrl
                },
                create: {
                    title: data.title,
                    description: data.description,
                    image: data.image,
                    videoUrl: data.videoUrl
                }
            });
        } else {
            await prisma.location.create({
                data: {
                    title: data.title,
                    description: data.description,
                    image: data.image,
                    videoUrl: data.videoUrl
                }
            });
        }

        revalidatePath('/admin/locations');
        revalidatePath('/admin/tours');
        return { success: true };
    } catch (error) {
        console.error("Upsert Location Error:", error);
        return { success: false, error: "Lokasyon kaydedilemedi." };
    }
}

export async function deleteLocationAction(id: string) {
    try {
        await prisma.location.delete({ where: { id } });
        revalidatePath('/admin/locations');
        revalidatePath('/admin/tours');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Lokasyon silinemedi." };
    }
}
