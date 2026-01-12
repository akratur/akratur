
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ReviewsClient } from "@/components/admin/ReviewsClient";

export default async function AdminReviewsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token");

    if (!token) {
        redirect("/admin/login");
    }

    let session;
    try {
        session = JSON.parse(token.value);
    } catch {
        redirect("/admin/login");
    }

    if (session.userType !== 'admin') {
        redirect("/admin/login");
    }

    // Fetch Reviews
    const reviews = await prisma.review.findMany({
        include: {
            tour: true,
            // We need parent info, but Parent schema only has tcNo.
            // But we ideally want the Parent Name which is actually in the Student data usually?
            // "ParentName" is stored in Student model.
            // A parent can have multiple students. 
            // We can fetch Parent and their Students to display a name.
            parent: true
        },
        orderBy: { createdAt: 'desc' }
    });

    // Format data for client
    const formattedReviews = reviews.map(r => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        parent: {
            parentName: r.parent?.name || r.parent?.tcNo || "Bilinmiyor"
        }
    }));

    return (
        <ReviewsClient reviews={formattedReviews} />
    );
}
