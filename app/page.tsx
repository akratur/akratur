
import { prisma } from "@/lib/db";
import { HeroSlider } from "@/components/home/HeroSlider";
import { AnimatedStats } from "@/components/home/AnimatedStats";
import { TourList } from "@/components/home/TourList";

export const dynamic = 'force-dynamic'; // Ensure we always fetch fresh data

export default async function Home() {

  // Fetch data in parallel
  const [sliders, schools, tours, siteConfig] = await Promise.all([
    prisma.slider.findMany({ orderBy: { order: 'asc' } }),
    prisma.school.findMany({
      include: {
        assignedTours: true,
        students: {
          include: {
            registrations: true
          }
        }
      }
    }),
    prisma.tour.findMany(),
    prisma.siteConfig.findUnique({ where: { id: "config" } })
  ]);

  let featuresStats = [];
  try {
    if (siteConfig?.stats) {
      featuresStats = JSON.parse(siteConfig.stats);
    }
  } catch (e) {
    console.error("Failed to parse stats", e);
  }

  // Process School-Assigned Tours
  const scheduledTours = [];

  for (const school of schools) {
    if (school.assignedTours) {
      for (const assigned of school.assignedTours) {
        const tour = tours.find(t => t.id === assigned.tourId);
        if (tour) {
          // Calculate registrations for this specific school-tour pair
          const regCount = school.students.filter(student =>
            student.registrations.some(r => r.tourId === tour.id && r.status === 'approved')
          ).length;

          scheduledTours.push({
            id: tour.id,
            title: tour.title,
            coverImage: tour.coverImage,
            date: tour.date,
            location: tour.location,
            schoolName: school.name,
            schoolCity: school.city,
            schoolDistrict: school.district,
            schoolId: school.id,
            registeredCount: regCount
          });
        }
      }
    }
  }

  // Also include generic tours that might not be assigned to any school yet? 
  // User request implies they want to see the school info. 
  // If we only show assigned ones, unassigned tours disappear from home.
  // Strategy: Add unique tours that are NOT in scheduledTours (optional, but requested behavior emphasizes school info).
  // For now, let's mix them. If a tour is not assigned to ANY school, we display it as generic.

  const assignedTourIds = new Set(scheduledTours.map(st => st.id));
  const genericTours = tours.filter(t => !assignedTourIds.has(t.id)).map(tour => ({
    id: tour.id,
    title: tour.title,
    coverImage: tour.coverImage,
    date: tour.date,
    location: tour.location,
    // No school info
  }));

  const finalTours = [...scheduledTours, ...genericTours].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <HeroSlider items={sliders} />

      <main className="max-w-7xl mx-auto px-4 py-16">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Yaklaşan Turlarımız</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Okullarımız için özel olarak planlanan, bilim, kültür ve eğlence dolu etkinliklerimizi keşfedin.
          </p>
        </div>

        <TourList tours={finalTours} />

        <AnimatedStats stats={featuresStats} />
      </main>
    </div>
  );
}
