
import { prisma } from "@/lib/db";
import { ToursClient } from "@/components/admin/ToursClient";

export default async function AdminToursPage() {
    // Fetch data using Prisma
    const tours = await prisma.tour.findMany({
        orderBy: { date: 'asc' },
        include: { locations: true }
    });

    const locations = await prisma.location.findMany({
        orderBy: { title: 'asc' }
    });

    // Serialize and sanitize data for Client Components
    const sanitizedTours = tours.map(t => ({
        ...t,
        date: t.date.toISOString(), // Ensure Date is string
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        videoUrl: t.videoUrl || undefined,
        // Map relation to locationIds if not already done by client mapping logic,
        // but here we just ensure clean data.
        locations: t.locations.map(l => ({ ...l, videoUrl: l.videoUrl || undefined }))
    }));

    const sanitizedLocations = locations.map(l => ({
        ...l,
        videoUrl: l.videoUrl || undefined
    }));

    return (
        <ToursClient
            tours={sanitizedTours}
            locations={sanitizedLocations}
        />
    );
}
