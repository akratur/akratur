
import { prisma } from "@/lib/db";
import { ToursClient } from "@/components/admin/ToursClient";

export default async function AdminToursPage() {
    // Fetch data using Prisma
    const tours = await prisma.tour.findMany({
        orderBy: { date: 'asc' }
    });

    const locations = await prisma.location.findMany({
        orderBy: { title: 'asc' }
    });

    return (
        <ToursClient
            tours={tours}
            locations={locations}
        />
    );
}
