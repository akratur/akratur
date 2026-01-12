'use server'

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addExpenseAction(tourId: string, description: string, amount: number) {
    try {
        await prisma.expense.create({
            data: {
                tourId,
                description,
                amount
            }
        });
        revalidatePath('/admin/reports');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Gider eklenemedi." };
    }
}

export async function deleteExpenseAction(expenseId: string) {
    try {
        await prisma.expense.delete({
            where: { id: expenseId }
        });
        revalidatePath('/admin/reports');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Silinemedi." };
    }
}
