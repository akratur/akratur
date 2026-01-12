
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { SchoolDashboardClient } from "@/components/school/SchoolDashboardClient";

export default async function SchoolDashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token");

    if (!token) {
        redirect("/school/login");
    }

    let session;
    try {
        session = JSON.parse(token.value);
    } catch {
        redirect("/school/login");
    }

    if (session.userType !== 'school') {
        redirect("/school/login");
    }

    // Fetch School and Data
    const school = await prisma.school.findUnique({
        where: { id: session.userId },
        include: {
            assignedTours: true,
            students: {
                include: {
                    registrations: true
                }
            }
        }
    });

    if (!school) redirect("/school/login");

    const tourIds = school.assignedTours.map(at => at.tourId);
    const tourData = await prisma.tour.findMany({
        where: { id: { in: tourIds } }
    });

    const tours = tourData.map(t => {
        const assignment = school.assignedTours.find(at => at.tourId === t.id);
        return {
            ...t,
            price: assignment?.price,
            date: t.date.toISOString(),
            images: JSON.parse(t.images),
            itinerary: JSON.parse(t.itinerary)
        };
    });

    // Pass all students for now (filtering generally happens on client for active view, 
    // or we could optimize to only fetch relevant students but school usually sees all)
    // Actually, `school.students` is efficient enough for typical school size.

    // We pass serializable data
    const students = school.students.map(s => ({
        ...s,
        registrations: s.registrations.map(r => ({ ...r, date: r.createdAt.toISOString() }))
    }));

    return (
        <SchoolDashboardClient
            school={school}
            tours={tours}
            initialStudentsForTour={students}
        />
    );
}
