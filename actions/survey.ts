'use server'

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function voteSurveyAction(surveyId: string, option: string) {
    try {
        const survey = await prisma.survey.findUnique({ where: { id: surveyId } });
        if (!survey) return { success: false, error: "Survey not found" };

        const currentVotes = JSON.parse(survey.votes) as { option: string, count: number }[];

        // Update vote count
        const updatedVotes = currentVotes.map(v =>
            v.option === option ? { ...v, count: v.count + 1 } : v
        );

        // If option didn't exist (shouldn't happen), add it
        if (!currentVotes.find(v => v.option === option)) {
            updatedVotes.push({ option, count: 1 });
        }

        await prisma.survey.update({
            where: { id: surveyId },
            data: { votes: JSON.stringify(updatedVotes) }
        });

        revalidatePath('/tours/[id]');
        revalidatePath('/'); // If surveys are shown elsewhere
        return { success: true };
    } catch (error) {
        console.error("Vote error:", error);
        return { success: false, error: "Failed to vote" };
    }
}
