'use server'

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function upsertTourAction(data: any) {
    try {
        const { itinerary, locationIds, images, ...tourData } = data;

        // Prepare JSON strings
        const itineraryJson = JSON.stringify(itinerary || []);
        const imagesJson = JSON.stringify(images || []);

        const tour = await prisma.tour.upsert({
            where: { id: tourData.id || "new" },
            update: {
                title: tourData.title,
                description: tourData.description,
                coverImage: tourData.coverImage,
                images: imagesJson,
                videoUrl: tourData.videoUrl,
                type: tourData.type,
                date: new Date(tourData.date),
                location: tourData.location,
                itinerary: itineraryJson,
                price: Number(tourData.price || 0),
                locations: {
                    set: [], // Clear old ones
                    connect: locationIds?.map((id: string) => ({ id })) || []
                }
            },
            create: {
                title: tourData.title,
                description: tourData.description,
                coverImage: tourData.coverImage,
                images: imagesJson,
                videoUrl: tourData.videoUrl,
                type: tourData.type,
                date: new Date(tourData.date),
                location: tourData.location,
                itinerary: itineraryJson,
                price: Number(tourData.price || 0),
                locations: {
                    connect: locationIds?.map((id: string) => ({ id })) || []
                }
            }
        });

        // Handle Locations?
        // Tour model doesn't have a direct relation to Location model in schema yet (except string `location`).
        // Step 1031 Schema: `model Tour` has `location String` and `assignedSchools`.
        // There is NO `locations Location[]` relation.
        // `app/admin/tours/page.tsx` has `locationIds`. 
        // If I want to persist strict location relations, I need to update Schema.
        // User asked for "resim linkleri videos linkleri test et".
        // Location model has image/video.
        // If the user wants tours to be linked to specific Location records, I need a relation.
        // "Ziyaret Noktaları (Lokasyonlar)" implies this.
        // Current Schema (Step 1031) has `model Location`.
        // I should add `locations Location[]` to `Tour` or a join table `TourLocation`.
        // Given the urgency ("hemen"), and "fix admin changes", I will FIRST fix the basic persistence (Title, Date, Image).
        // Then I will check if `Location` relation is needed for the requested "test video links".
        // `Location` model has `videoUrl`. If a Tour is composed of Locations, displaying the tour should show those locations/videos.
        // I'll add `TourLocation` or Implicit Many-to-Many to Schema now to be safe.

        revalidatePath('/');
        revalidatePath('/admin/tours');
        revalidatePath(`/tours/${tour.id}`);
        return { success: true };
    } catch (error) {
        console.error("Upsert Tour Error:", error);
        return { success: false, error: "Tur kaydedilemedi." };
    }
}

export async function deleteTourAction(id: string) {
    try {
        await prisma.tour.delete({ where: { id } });
        revalidatePath('/');
        revalidatePath('/admin/tours');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Tur silinemedi." };
    }
}
