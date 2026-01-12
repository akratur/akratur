
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ReportsClient } from "@/components/admin/ReportsClient";

export default async function AdminReportsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token");

    if (!token) {
        redirect("/admin/login");
    }

    let session;
    try {
        session = JSON.parse(token.value);
    } catch {
        redirect("/admin/login");
    }

    if (session.userType !== 'admin') {
        redirect("/admin/login");
    }

    // Fetch Data
    const tours = await prisma.tour.findMany({
        include: {
            expenses: true,
            assignedSchools: true
        },
        orderBy: { date: 'desc' }
    });

    const reports = await Promise.all(tours.map(async (tour) => {
        // Calculate Revenue
        // 1. Get all approved registrations for this tour
        // 2. For each, find the school and price

        // We can do a raw query or better filtering
        const registrations = await prisma.registration.findMany({
            where: {
                tourId: tour.id,
                status: 'approved'
            },
            include: {
                student: {
                    select: { schoolId: true }
                }
            }
        });

        let totalRevenue = 0;

        // Create a map of schoolId -> price
        const priceMap = new Map<string, number>();
        tour.assignedSchools.forEach(st => priceMap.set(st.schoolId, st.price));

        registrations.forEach(r => {
            const price = priceMap.get(r.student.schoolId) || 0;
            totalRevenue += price;
        });

        const totalExpenses = tour.expenses.reduce((sum, exp) => sum + exp.amount, 0);

        return {
            id: tour.id,
            title: tour.title,
            date: tour.date.toISOString(),
            totalRevenue,
            totalExpenses,
            profit: totalRevenue - totalExpenses,
            expenses: tour.expenses,
            registeredCount: registrations.length // Approved count
        };
    }));

    return (
        <ReportsClient reports={reports} />
    );
}
