
import { prisma } from "@/lib/db";
import { LocationsClient } from "@/components/admin/LocationsClient";

export default async function AdminLocationsPage() {
    const locations = await prisma.location.findMany({
        orderBy: { title: 'asc' }
    });

    const mappedLocations = locations.map(l => ({
        ...l,
        videoUrl: l.videoUrl || undefined,
        iban: undefined // Location doesn't need iban, ensure exact match if needed or allow excess
    }));

    return (
        <LocationsClient locations={mappedLocations} />
    );
}
