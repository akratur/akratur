'use server'

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitReviewAction(tourId: string, parentId: string, rating: number, comment: string) {
    try {
        await prisma.review.create({
            data: {
                tourId,
                parentId,
                rating,
                comment,
                status: "pending" // Default to pending approval
            }
        });
        revalidatePath('/parent');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Yorum gönderilemedi." };
    }
}

export async function updateReviewStatusAction(reviewId: string, status: string) {
    try {
        await prisma.review.update({
            where: { id: reviewId },
            data: { status }
        });
        revalidatePath('/admin/reviews');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Güncellenemedi." };
    }
}
