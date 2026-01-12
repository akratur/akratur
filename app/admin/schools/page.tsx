
import { prisma } from "@/lib/db";
import { SchoolsClient } from "@/components/admin/SchoolsClient";

export const dynamic = 'force-dynamic';

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

    // Sanitize data
    const sanitizedSchools = schools.map(s => ({
        ...s,
        assignedTours: s.assignedTours.map(at => ({
            ...at,
            createdAt: at.createdAt ? at.createdAt.toISOString() : undefined // Handle extra fields if any
        }))
    }));

    const sanitizedTours = tours.map(t => ({
        ...t,
        date: t.date.toISOString(),
        location: t.location,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        videoUrl: t.videoUrl || undefined
    }));

    return (
        <SchoolsClient
            schools={sanitizedSchools}
            tours={sanitizedTours}
        />
    );
}
