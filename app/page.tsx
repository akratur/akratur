
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

  // Simply show all tours for now as "Upcoming"
  const finalTours = tours.map(tour => {
    // Find if there's any school info relevant? 
    // For homepage generalized view, we don't need school info unless logged in.
    // User can see detail page for more.
    return {
      id: tour.id,
      title: tour.title,
      coverImage: tour.coverImage,
      date: tour.date,
      location: tour.location,
      // registeredCount: 0 // or aggregate from registrations
    };
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
