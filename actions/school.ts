'use server'

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import * as XLSX from 'xlsx';

export async function updateRegistrationStatusAction(studentId: string, tourId: string, status: string) {
    try {
        // Find registration
        const registration = await prisma.registration.findFirst({
            where: { studentId, tourId }
        });

        if (!registration) return { success: false, error: "Kayıt bulunamadı" };

        await prisma.registration.update({
            where: { id: registration.id },
            data: { status }
        });

        revalidatePath('/school');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Güncellenemedi" };
    }
}

export async function uploadStudentListAction(formData: FormData, schoolId: string) {
    try {
        const file = formData.get('file') as File;
        if (!file) return { success: false, error: "Dosya yüklenmedi." };

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const workbook = XLSX.read(buffer, { type: 'buffer' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Expect headers: TC No, Ad, Soyad, Sınıf, Okul No
        // We convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        let count = 0;
        for (const row of jsonData) {
            const tc = row['TC No'] || row['TC'] || row['tc'];
            const name = row['Ad'] ? `${row['Ad']} ${row['Soyad'] || ''}`.trim() : (row['Ad Soyad'] || row['İsim']);
            const classGrade = row['Sınıf'] || row['Sinif'];
            const schoolNo = row['Okul No'] || row['Numara'];

            if (tc && name) {
                // Upsert Student
                await prisma.student.upsert({
                    where: { tcNo: String(tc) },
                    update: {
                        name: String(name),
                        grade: String(classGrade || ''),
                        schoolNo: String(schoolNo || ''),
                        schoolId: schoolId // Ensure they belong to this school
                    },
                    create: {
                        tcNo: String(tc),
                        name: String(name),
                        grade: String(classGrade || ''),
                        schoolNo: String(schoolNo || ''),
                        schoolId: schoolId,
                    }
                });
                count++;
            }
        }

        revalidatePath('/school');
        return { success: true, count };

    } catch (error) {
        console.error(error);
        return { success: false, error: "Dosya işlenirken hata oluştu." };
    }
}

export async function upsertSchoolAction(data: any) {
    try {
        const { assignedTours, ...schoolData } = data;

        // Upsert School
        const school = await prisma.school.upsert({
            where: { id: schoolData.id || "new" },
            update: {
                name: schoolData.name,
                city: schoolData.city,
                district: schoolData.district,
                contactName: schoolData.contactName,
                phone: schoolData.phone,
                username: schoolData.username,
                password: schoolData.password,
                accessCode: schoolData.accessCode,
                iban: schoolData.iban
            },
            create: {
                name: schoolData.name,
                city: schoolData.city,
                district: schoolData.district,
                contactName: schoolData.contactName,
                phone: schoolData.phone,
                username: schoolData.username,
                password: schoolData.password,
                accessCode: schoolData.accessCode,
                iban: schoolData.iban
            }
        });

        // Handle Assigned Tours (SchoolTour)
        if (assignedTours && Array.isArray(assignedTours)) {
            await prisma.schoolTour.deleteMany({
                where: { schoolId: school.id }
            });

            for (const at of assignedTours) {
                await prisma.schoolTour.create({
                    data: {
                        schoolId: school.id,
                        tourId: at.tourId,
                        price: at.price,
                    }
                });
            }
        }

        revalidatePath('/admin/schools');
        revalidatePath('/school');
        return { success: true };
    } catch (error) {
        console.error("Upsert School Error:", error);
        return { success: false, error: "Okul kaydedilemedi. Kod veya Kullanıcı adı çakışıyor olabilir." };
    }
}

export async function deleteSchoolAction(schoolId: string) {
    try {
        await prisma.school.delete({ where: { id: schoolId } });
        revalidatePath('/admin/schools');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Okul silinemedi." };
    }
}
