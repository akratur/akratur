'use server'

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "session_token";

export async function loginParentAction(tcNo: string, schoolCode: string) {
    // Verify school details
    const school = await prisma.school.findUnique({
        where: { accessCode: schoolCode.trim().toUpperCase() }
    });

    if (!school) {
        return { success: false, error: "Hatalı okul kodu." };
    }

    // Usually we check if parent exists, or create one?
    // In strict mode, parent might need to be pre-registered.
    // Spec says: "Veli öğrenci tc kimlik numarasını veli girişinden yaparken burası sorgulansın ve kayıt varsa otomatik gelsin. yoksa veli kendi girsin."
    // This implies Parent Login is actually "Student Verification" + "Parent Session".
    // For now, let's treat Login as "Authenticating against a School Code + TC".
    // We will create/find a Parent record.

    let parent = await prisma.parent.findUnique({
        where: { tcNo }
    });

    if (!parent) {
        // Create parent if not exists (Lazy registration)
        parent = await prisma.parent.create({
            data: { tcNo }
        });
    }

    // Create session
    const sessionData = {
        userId: parent.id,
        userType: 'parent',
        schoolId: school.id // Store school context in session for parents
    };

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, JSON.stringify(sessionData), {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return { success: true };
}

export async function loginSchoolAction(credential: string, password: string) {
    // credential can be username or accessCode
    const code = credential.trim().toUpperCase();

    // Try finding by username OR accessCode
    const school = await prisma.school.findFirst({
        where: {
            OR: [
                { username: credential },
                { accessCode: code }
            ]
        }
    });

    if (!school || school.password !== password) {
        return { success: false, error: "Hatalı kullanıcı adı/kod veya şifre." };
    }

    const sessionData = {
        userId: school.id,
        userType: 'school'
    };

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, JSON.stringify(sessionData), {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7
    });

    return { success: true };
}

export async function loginAdminAction(username: string, password: string) {
    let admin = await prisma.admin.findUnique({
        where: { username }
    });

    // Fallback: If no admin exists at all (e.g. migration reset), allow first login with default credentials to seed the DB
    if (!admin && username === "admin" && password === "admin123") {
        const adminCount = await prisma.admin.count();
        if (adminCount === 0) {
            admin = await prisma.admin.create({
                data: {
                    username: "admin",
                    password: "admin123"
                }
            });
        }
    }

    if (admin && admin.password === password) {
        const sessionData = {
            userId: admin.id,
            userType: 'admin',
            // Store username in session if needed, but userId is enough usually
            username: admin.username
        };

        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, JSON.stringify(sessionData), {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24
        });

        // Critical: Set the isLoggedIn cookie for middleware/client checks
        cookieStore.set("isLoggedIn", "true", {
            path: '/',
            maxAge: 60 * 60 * 24
        });

        return { success: true };
    }

    return { success: false, error: "Hatalı kullanıcı adı veya şifre." };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    redirect('/');
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    if (!token) return null;
    try {
        return JSON.parse(token.value);
    } catch {
        return null;
    }
}
