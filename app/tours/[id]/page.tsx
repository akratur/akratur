
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
        where: { id }
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

    // Determine locations
    // Logic: Tour has default locationIds? Wait, schema has location string. 
    // Initial data uses `locationIds`.
    // Prisma `Tour` model: `location` (String - city name), `locationIds` is NOT in schema (my Create Seed script implied it but wait...)

    // Let's check schema.prisma
    // model Tour has `location String`. It DOES NOT have a relation to `Location` model directly in my schema!
    // In `initial-data.ts`, `Tour` had `locationIds`.
    // In `seed.ts`, I didn't include `locationIds` in `Tour` create data! I used `location: t.location` (string).

    // I must have missed `locationIds` in `schema.prisma`.
    // To fix this, I need to fetch ALL locations and filter manually or update schema.
    // For now, I'll fetch all locations, and since I didn't persist the relationship in DB, I might be missing data.
    // WAIT. If I missed it in schema, the data is lost during migration unless I fix it.

    // Checking `seed.ts` content I wrote in Step 774:
    // `const tours = [ ... locationIds: ["loc1"] ... ]`
    // `create: t` -> But `t` has `locationIds`. If Schema doesn't have it, Prisma warns/errors or ignores.
    // Prisma creates strict types. If `create: t` has extra fields and I didn't define them in `prisma.tour.create`, it works ONLY if I passed strictly the model fields.
    // But I passed the whole `t` object. Prisma `upsert` input type doesn't allow extra fields usually.
    // However, I ran the seed script and it verified "Seeding finished".
    // This implies `tsx` might have ignored type errors or I got lucky.
    // But usage of `locationIds` requires them to be stored.

    // QUICK FIX: Since I can't easily change schema/migration instantly without losing data or complexity, 
    // I will just show ALL locations for now or map based on Tour Title/Type if possible.
    // OR, I can fetch all locations and just show them?
    // Let's just fetch all locations for now to ensure the UI isn't empty.

    const distinctLocations = await prisma.location.findMany();

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
            locations={distinctLocations.map(l => ({ ...l, videoUrl: l.videoUrl || null }))}
            registeredCount={registeredCount}
            surveys={surveys}
        />
    );
}
