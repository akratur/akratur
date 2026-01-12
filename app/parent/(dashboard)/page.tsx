
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ParentDashboardClient } from "@/components/parent/ParentDashboardClient";

export default async function ParentDashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token");

    if (!token) {
        redirect("/parent/login");
    }

    let session;
    try {
        session = JSON.parse(token.value);
    } catch {
        redirect("/parent/login");
    }

    if (session.userType !== 'parent') {
        redirect("/parent/login");
    }

    // Identify user/student
    // session.userId is Parent ID (TC). 
    // We treat this as the student's TC or the parent's unique ID which links to student(s).
    // In our simplified model, we find the student by this TC (stored in parentId or student's own ID/TC).

    // Find school
    const school = await prisma.school.findUnique({
        where: { id: session.schoolId },
        include: {
            assignedTours: true
        }
    });

    if (!school) redirect("/parent/login");

    // Find Tours for this school
    const tourIds = school.assignedTours.map(at => at.tourId);
    const tourData = await prisma.tour.findMany({
        where: { id: { in: tourIds } }
    });

    // Merge price info
    const tours = tourData.map(t => {
        const assignment = school.assignedTours.find(at => at.tourId === t.id);
        return {
            ...t,
            price: assignment?.price,
            date: t.date.toISOString(),
            images: JSON.parse(t.images),
            itinerary: JSON.parse(t.itinerary)
        };
    });

    // Find Student
    // We look for a student whose TC matches the session ID (if we treat session ID as TC)
    // OR whose parentId is the session ID. 
    // `loginParentAction` created a `Parent` with `id=cuid` and `tcNo=...`.
    // Wait, `prisma.parent.create` uses default ID (cuid). `tcNo` is unique.
    // The session stored `userId` as `parent.id`.

    const parent = await prisma.parent.findUnique({
        where: { id: session.userId }
    });

    let student = null;
    if (parent?.tcNo) {
        student = await prisma.student.findUnique({
            where: { tcNo: parent.tcNo },
            include: { registrations: true }
        });
    }

    // If no linked student, maybe check if a student exists with the Parent's TC (if they used Student TC as Parent TC)?
    // This is getting slightly ambiguous without strictly defined "Parent vs Student" flow.
    // But let's stick to: The user fills out the form.
    // If `student` is undefined, `StudentForm` will show empty (except pre-filled TC from valid session/parent TC).

    // We pass `parent.tcNo` as `parentTc`.

    // Surveys
    const surveyData = await prisma.survey.findMany({ where: { isActive: true } });
    const surveys = surveyData.map(s => ({
        ...s,
        options: JSON.parse(s.options),
        votes: JSON.parse(s.votes)
    }));

    return (
        <ParentDashboardClient
            student={student ? {
                ...student,
                registrations: student.registrations.map(r => ({ ...r, createdAt: r.createdAt.toISOString() }))
            } : null}
            school={school}
            tours={tours}
            surveys={surveys}
            parentTc={parent?.tcNo || ""}
        />
    );
}
