
import { prisma } from "@/lib/db";
import { SchoolsClient } from "@/components/admin/SchoolsClient";

export default async function AdminSchoolsPage() {
    // Fetch data using Prisma
    const schools = await prisma.school.findMany({
        include: {
            assignedTours: true,
            _count: {
                select: { students: true }
            }
        },
        orderBy: { name: 'asc' }
    });

    const tours = await prisma.tour.findMany({
        orderBy: { date: 'asc' }
    });

    return (
        <SchoolsClient
            schools={schools}
            tours={tours}
        />
    );
}
