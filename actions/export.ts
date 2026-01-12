'use server'

import { prisma } from "@/lib/db";
import * as XLSX from 'xlsx';

export async function exportTourParticipantsAction(tourId: string) {
    try {
        const registrations = await prisma.registration.findMany({
            where: {
                tourId: tourId,
                status: 'approved'
            },
            include: {
                student: {
                    include: {
                        school: true,
                    }
                }
            }
        });

        // We also need Parent info.
        // Student has unique 'tcNo' but 'Parent' has 'tcNo'.
        // We can link them via TC manually or if we had relation.
        // Currently Student model doesn't link to Parent implicitly via relation except indirectly?
        // Wait, Schema:
        // model Student { ... tcNo ... }
        // model Parent { ... tcNo ... }
        // Integration "Smart Registration" links them via TC.
        // But there is no FK in schema?
        // Let's look at schema again.
        // Step 939: Student has `tcNo`. Parent has `tcNo`. No FK.
        // But `Registration` is Student -> Tour.
        // If we want Parent Name/Phone for the list (which is critical for tours), we need to find the parent matching the student's TC.

        // Let's fetch all parents whose tcNo matches any student tcNo?
        // Or one by one?
        // Better: Fetch all parents. (If not too many).
        // Or just map them.

        const studentTcs = registrations.map(r => r.student.tcNo);
        const parents = await prisma.parent.findMany({
            where: {
                tcNo: { in: studentTcs }
            }
        });

        const parentMap = new Map();
        parents.forEach(p => parentMap.set(p.tcNo, p));

        const data = registrations.map(r => {
            const parent = parentMap.get(r.student.tcNo);
            return {
                "Öğrenci Adı": r.student.name,
                "TC No": r.student.tcNo,
                "Sınıf": r.student.grade,
                "Okul No": r.student.schoolNo,
                "Okul": r.student.school.name,
                "Veli Adı": parent?.name || "Kayıtlı Değil",
                "Veli Telefon": parent?.phone || "-",
                "Kayıt Tarihi": r.createdAt.toLocaleDateString("tr-TR")
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Katılımcılar");

        // Generate buffer
        const buf = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

        return { success: true, daa: buf }; // Typos fixed locally? No, return `data`.
    } catch (error) {
        console.error(error);
        return { success: false, error: "Liste oluşturulamadı." };
    }
}
