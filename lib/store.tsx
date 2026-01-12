"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SiteConfig, Tour, School, Student, Survey, Location } from "./types";
import { initialSiteConfig, initialSchools, initialTours, initialStudents, initialSurveys, initialLocations } from "./initial-data";

interface StoreContextType {
    siteConfig: SiteConfig;
    updateSiteConfig: (config: SiteConfig) => void;
    tours: Tour[];
    addTour: (tour: Tour) => void;
    updateTour: (tour: Tour) => void;
    deleteTour: (id: string) => void;
    schools: School[];
    addSchool: (school: School) => void;
    updateSchool: (school: School) => void;
    students: Student[];
    registerStudent: (student: Student) => void;
    updateStudentStatus: (id: string, tourId: string, status: 'pending_payment' | 'approved') => void;
    surveys: Survey[];
    addSurvey: (survey: Survey) => void;
    updateSurvey: (survey: Survey) => void;
    deleteSurvey: (id: string) => void;
    voteSurvey: (id: string, option: string) => void;
    votedSurveyIds: string[];
    locations: Location[];
    addLocation: (location: Location) => void;
    updateLocation: (location: Location) => void;
    deleteLocation: (id: string) => void;
    isAdmin: boolean;
    loginAdmin: () => void;
    logoutAdmin: () => void;
    currentUser: { type: 'admin' | 'school' | 'parent'; id?: string; schoolId?: string } | null;
    loginSchool: (id: string) => void;
    loginParent: (tc: string, schoolId: string) => void;
    logout: () => void;
    isInitialized: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [siteConfig, setSiteConfig] = useState<SiteConfig>(initialSiteConfig);
    const [tours, setTours] = useState<Tour[]>(initialTours);
    const [schools, setSchools] = useState<School[]>(initialSchools);
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [surveys, setSurveys] = useState<Survey[]>(initialSurveys);
    const [locations, setLocations] = useState<Location[]>(initialLocations);
    const [votedSurveyIds, setVotedSurveyIds] = useState<string[]>([]);

    // Auth State
    const [currentUser, setCurrentUser] = useState<{ type: 'admin' | 'school' | 'parent'; id?: string; schoolId?: string } | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from LocalStorage and Check Session
    useEffect(() => {
        // Check session from server/cookie
        const checkSession = async () => {
            try {
                // We'll dynamically import the server action if needed, or better, 
                // since we can't easily import server action in store (context), 
                // we rely on a simpler check or passed prop? 
                // Actually, store.tsx is use client. We CAN import server actions.
                const { getSession } = await import("@/actions/auth");
                const session = await getSession();
                if (session) {
                    if (session.userType === 'admin') setCurrentUser({ type: 'admin', id: session.userId });
                    else if (session.userType === 'school') setCurrentUser({ type: 'school', id: session.userId });
                    else if (session.userType === 'parent') setCurrentUser({ type: 'parent', id: session.userId, schoolId: session.schoolId });
                }
            } catch (e) {
                console.error("Session check failed", e);
            } finally {
                setIsInitialized(true);
            }
        };
        checkSession();

        const loadedConfig = localStorage.getItem("siteConfig");
        const loadedTours = localStorage.getItem("tours");
        const loadedSchools = localStorage.getItem("schools");
        const loadedStudents = localStorage.getItem("students");
        const loadedSurveys = localStorage.getItem("surveys");
        const loadedLocations = localStorage.getItem("locations");

        if (loadedConfig) {
            const parsed = JSON.parse(loadedConfig);
            // Merge with initialSiteConfig to ensure new fields (like contact) are present
            setSiteConfig({ ...initialSiteConfig, ...parsed, contact: { ...initialSiteConfig.contact, ...parsed.contact } });
        }
        if (loadedTours) setTours(JSON.parse(loadedTours));
        if (loadedSchools) {
            const parsedSchools: School[] = JSON.parse(loadedSchools);
            // Merge with initial data to ensure new fields like accessCode are present
            const mergedSchools = parsedSchools.map(s => {
                const initial = initialSchools.find(i => i.id === s.id);
                return {
                    ...s,
                    accessCode: s.accessCode || initial?.accessCode || "", // Use existing, or fallback to initial, or empty
                    iban: s.iban || initial?.iban || ""
                };
            });
            setSchools(mergedSchools);
        } else {
            setSchools(initialSchools); // Fallback if nothing loaded (though initial state handles this too)
        }
        if (loadedStudents) setStudents(JSON.parse(loadedStudents));
        if (loadedSurveys) setSurveys(JSON.parse(loadedSurveys));
        if (loadedLocations) setLocations(JSON.parse(loadedLocations));

        const loadedVotes = localStorage.getItem("votedSurveyIds");
        if (loadedVotes) setVotedSurveyIds(JSON.parse(loadedVotes));
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem("siteConfig", JSON.stringify(siteConfig));
    }, [siteConfig]);

    useEffect(() => {
        localStorage.setItem("tours", JSON.stringify(tours));
    }, [tours]);

    useEffect(() => {
        localStorage.setItem("schools", JSON.stringify(schools));
    }, [schools]);

    useEffect(() => {
        localStorage.setItem("students", JSON.stringify(students));
    }, [students]);

    useEffect(() => {
        localStorage.setItem("surveys", JSON.stringify(surveys));
    }, [surveys]);

    useEffect(() => {
        localStorage.setItem("locations", JSON.stringify(locations));
    }, [locations]);

    useEffect(() => {
        localStorage.setItem("votedSurveyIds", JSON.stringify(votedSurveyIds));
    }, [votedSurveyIds]);


    // Actions
    const updateSiteConfig = (config: SiteConfig) => setSiteConfig(config);

    const addTour = (tour: Tour) => setTours([...tours, tour]);
    const updateTour = (tour: Tour) => setTours(tours.map(t => t.id === tour.id ? tour : t));
    const deleteTour = (id: string) => setTours(tours.filter(t => t.id !== id));

    const addSchool = (school: School) => setSchools([...schools, school]);
    const updateSchool = (school: School) => setSchools(schools.map(s => s.id === school.id ? school : s));

    const registerStudent = (student: Student) => {
        // Check if exists
        const existing = students.find(s => s.id === student.id);
        if (existing) {
            // Update registration
            setStudents(students.map(s => s.id === student.id ? student : s));
        } else {
            setStudents([...students, student]);
        }
    };

    const updateStudentStatus = (id: string, tourId: string, status: 'pending_payment' | 'approved') => {
        setStudents(students.map(s => {
            if (s.id === id) {
                return {
                    ...s,
                    registrations: s.registrations.map(r => r.tourId === tourId ? { ...r, status } : r)
                };
            }
            return s;
        }));
    };

    const addSurvey = (survey: Survey) => setSurveys([...surveys, survey]);
    const updateSurvey = (survey: Survey) => setSurveys(surveys.map(s => s.id === survey.id ? survey : s));
    const deleteSurvey = (id: string) => setSurveys(surveys.filter(s => s.id !== id));
    const voteSurvey = (id: string, option: string) => {
        if (votedSurveyIds.includes(id)) return; // Prevent multiple votes

        setSurveys(surveys.map(s => {
            if (s.id === id) {
                const existingVote = s.votes.find(v => v.option === option);
                let newVotes;
                if (existingVote) {
                    newVotes = s.votes.map(v => v.option === option ? { ...v, count: v.count + 1 } : v);
                } else {
                    newVotes = [...s.votes, { option, count: 1 }];
                }
                return { ...s, votes: newVotes };
            }
            return s;
        }));
        setVotedSurveyIds([...votedSurveyIds, id]);
    };

    const addLocation = (location: Location) => setLocations([...locations, location]);
    const updateLocation = (location: Location) => setLocations(locations.map(l => l.id === location.id ? location : l));
    const deleteLocation = (id: string) => setLocations(locations.filter(l => l.id !== id));

    const loginAdmin = () => setCurrentUser({ type: 'admin' });
    const logoutAdmin = () => setCurrentUser(null);

    const loginSchool = (id: string) => setCurrentUser({ type: 'school', id });
    const loginParent = (tc: string, schoolId: string) => setCurrentUser({ type: 'parent', id: tc, schoolId });
    const logout = () => setCurrentUser(null);


    return (
        <StoreContext.Provider value={{
            siteConfig, updateSiteConfig,
            tours, addTour, updateTour, deleteTour,
            schools, addSchool, updateSchool,
            students, registerStudent, updateStudentStatus,
            surveys, addSurvey, updateSurvey, deleteSurvey, voteSurvey, votedSurveyIds,
            locations, addLocation, updateLocation, deleteLocation,
            isAdmin: currentUser?.type === 'admin',
            currentUser,
            isInitialized,
            loginAdmin, logoutAdmin,
            loginSchool, loginParent, logout
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}
