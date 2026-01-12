'use server'

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Site Config Actions - Trigger Recompile
export async function updateSiteConfigAction(data: any) {
    try {
        // SiteConfig has a fixed ID "config"
        await prisma.siteConfig.upsert({
            where: { id: "config" },
            update: {
                logo: data.logo,
                phone: data.contact?.phone,
                email: data.contact?.email,
                address: data.contact?.address,
                footerText: data.contact?.footerText,
                stats: JSON.stringify(data.stats || []),
            },
            create: {
                id: "config",
                logo: data.logo,
                phone: data.contact?.phone,
                email: data.contact?.email,
                address: data.contact?.address,
                footerText: data.contact?.footerText,
                stats: JSON.stringify(data.stats || []),
            }
        });
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error("SiteConfig Update Error:", error);
        return { success: false, error: "Site Config Hatası: " + (error.message || String(error)) };
    }
}

// Slider Actions
export async function updateSliderAction(sliders: any[]) {
    try {
        // Full replace logic: Delete all, create all?
        // Or upsert?
        // Slider model has ID. if we preserve IDs, we can update.
        // Easiest for "Slider Management" is usually delete all and recreate if the list is small (it is).
        // But `cuid`s might change.
        // Let's try transaction: deleteMany -> createMany

        await prisma.$transaction([
            prisma.slider.deleteMany(),
            prisma.slider.createMany({
                data: sliders.map((s, idx) => ({
                    image: s.image,
                    title: s.title,
                    subtitle: s.subtitle,
                    order: idx
                }))
            })
        ]);

        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error("Slider Update Error:", error);
        return { success: false, error: "Slider Hatası: " + (error.message || String(error)) };
    }
}

export async function getAdminSettingsAction() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "config" } });
    const sliders = await prisma.slider.findMany({ orderBy: { order: 'asc' } });

    return { config, sliders };
}
