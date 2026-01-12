import { getSession } from "@/actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User } from "lucide-react";
import { prisma } from "@/lib/db";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session || session.userType !== 'parent') {
        redirect("/parent/login");
    }

    // Fetch school info for header if needed
    let schoolName = "Öğrenci Portalı";
    if (session.schoolId) {
        const school = await prisma.school.findUnique({ where: { id: session.schoolId } });
        if (school) schoolName = school.name;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                        <User size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-800 dark:text-white leading-tight">Veli Portalı</h1>
                        <p className="text-xs text-slate-500">{schoolName}</p>
                    </div>
                </div>
                <LogoutButton />
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
