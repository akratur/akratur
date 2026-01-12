
import { prisma } from "@/lib/db";
import { TourDetailView } from "@/components/tour/TourDetailView";
import Link from "next/link";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ schoolId?: string }>;
}

export const dynamic = 'force-dynamic';

export default async function TourDetailPage({ params, searchParams }: Props) {
    const { id } = await params;
    const { schoolId } = await searchParams;

    const tourData = await prisma.tour.findUnique({
        where: { id },
        include: { locations: true }
    });

    if (!tourData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
                <h2 className="text-2xl font-bold">Tur Bulunamadı</h2>
                <Link href="/" className="text-amber-500 hover:underline">Ana Sayfaya Dön</Link>
            </div>
        );
    }

    // Parse JSON fields
    const tour = {
        ...tourData,
        date: tourData.date.toISOString(),
        images: JSON.parse(tourData.images) as string[],
        itinerary: JSON.parse(tourData.itinerary) as { time: string; activity: string }[],
    };

    let school = null;
    let registeredCount = 0;

    if (schoolId) {
        const schoolData = await prisma.school.findUnique({
            where: { id: schoolId },
            include: {
                assignedTours: true,
                students: {
                    include: {
                        registrations: true
                    }
                }
            }
        });

        if (schoolData) {
            school = {
                id: schoolData.id,
                name: schoolData.name,
                city: schoolData.city,
                district: schoolData.district
            };

            // Calculate registered count for this specific tour
            registeredCount = schoolData.students.filter(s =>
                s.registrations.some(r => r.tourId === id && r.status === 'approved')
            ).length;
        }
    }

    // Locations are now fetched via relation
    // Sanitizing videoUrl for client component
    const tourLocations = tourData.locations.map(l => ({
        ...l,
        videoUrl: l.videoUrl || null
    }));

    // Active Surveys
    const surveyData = await prisma.survey.findMany({
        where: { isActive: true }
    });

    const surveys = surveyData.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        options: JSON.parse(s.options) as string[],
        votes: JSON.parse(s.votes) as { option: string; count: number }[],
        isActive: s.isActive
    }));

    return (
        <TourDetailView
            tour={tour}
            school={school}
            locations={tourLocations}
            registeredCount={registeredCount}
            surveys={surveys}
        />
    );
}
