'use server'

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function upsertStudentAction(data: any, parentTc: string, schoolId: string) {
    try {
        // 1. Update Parent Info
        // parentTc is the TC number of the logged in parent.
        await prisma.parent.update({
            where: { tcNo: parentTc },
            data: {
                name: data.parentName,
                phone: data.parentPhone
            }
        });

        // 2. Upsert Student Info
        // We identify student by TC No provided in form (data.tcNo), or fallback to parentTc if not provided (should be provided)
        const studentTc = data.tcNo || parentTc; // Fallback if needed, but form should have it

        const existingStudent = await prisma.student.findUnique({
            where: { tcNo: studentTc }
        });

        if (existingStudent) {
            await prisma.student.update({
                where: { id: existingStudent.id },
                data: {
                    name: data.name,
                    schoolNo: data.schoolNo,
                    grade: data.classGrade, // Map classGrade -> grade
                    allergies: data.allergies,
                    schoolId: schoolId
                }
            });
        } else {
            await prisma.student.create({
                data: {
                    tcNo: studentTc,
                    name: data.name,
                    schoolNo: data.schoolNo,
                    grade: data.classGrade, // Map classGrade -> grade
                    allergies: data.allergies,
                    schoolId: schoolId
                }
            });
        }

        revalidatePath('/parent');
        return { success: true };
    } catch (error: any) {
        console.error("Upsert student error", error);
        return { success: false, error: "Kaydedilemedi: " + (error.message || String(error)) };
    }
}

export async function registerForTourAction(studentId: string, tourId: string) {
    try {
        await prisma.registration.create({
            data: {
                studentId,
                tourId,
                status: "pending_payment"
            }
        });
        revalidatePath('/parent');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Kayıt oluşturulamadı." };
    }
}
