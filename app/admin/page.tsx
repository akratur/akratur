import { prisma } from "@/lib/db";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboard() {
    // Fetch all required data in parallel
    const [schools, totalStudents, totalRegistrations, pendingPayments] = await Promise.all([
        prisma.school.findMany({
            include: {
                _count: {
                    select: { students: true }
                },
                students: {
                    select: {
                        registrations: {
                            select: { id: true }
                        }
                    }
                }
            },
            orderBy: { name: 'asc' }
        }),
        prisma.student.count(),
        prisma.registration.count(),
        prisma.registration.count({ where: { status: 'pending_payment' } })
    ]);

    // Process school stats
    const schoolStats = schools.map(school => {
        // Count students who have at least one registration
        // Or simpler: count total registrations for this school (if a student registered for 2 tours, counts as 2)
        // User asked for "Kayıt yaptıran öğrenci". Usually implies unique students.
        // But for capacity planning, total registrations matter.
        // Let's count unique students who have >0 registrations.
        const registeredStudentCount = school.students.filter(s => s.registrations.length > 0).length;

        return {
            id: school.id,
            name: school.name,
            totalStudents: school._count.students,
            registeredStudents: registeredStudentCount
        };
    });

    return (
        <AdminDashboardClient
            totalSchools={schools.length}
            totalStudents={totalStudents}
            totalRegistrations={totalRegistrations} // This is total registration records
            pendingPayments={pendingPayments}
            schoolStats={schoolStats}
        />
    );
}
