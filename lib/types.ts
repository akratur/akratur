// Types definition
export interface Tour {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    images: string[];
    videoUrl?: string; // YouTube or similar
    type: string; // 'culture', 'science', 'education', 'fun'
    date: string; // YYYY-MM-DD
    location: string;
    itinerary: { time: string; activity: string }[];
    locationIds: string[]; // references to Location.id
}

export interface Location {
    id: string;
    title: string;
    description: string;
    image: string;
    videoUrl?: string;
}

export interface School {
    id: string;
    name: string;
    city: string;
    district: string;
    contactName: string;
    phone: string;
    username: string;
    password?: string;
    assignedTours: { tourId: string; price: number; locationIds?: string[] }[];
    accessCode: string;
    iban?: string;
}

export interface Student {
    id: string; // TC Number
    name: string;
    schoolNo: string;
    classGrade: string;
    schoolId: string;
    parentName: string;
    parentPhone: string;
    allergies: string;
    registrations: {
        tourId: string;
        status: 'pending_payment' | 'approved';
        date: string;
    }[];
}

export interface SliderItem {
    id: string;
    image: string;
    title: string;
    subtitle: string;
}

export interface SiteConfig {
    logo: string;
    slider: SliderItem[];
    stats: { label: string; value: string }[];
    contact: {
        phone: string;
        email: string;
        address: string;
        footerText?: string;
        socials?: {
            facebook?: string;
            instagram?: string;
            twitter?: string;
            linkedin?: string;
        }
    };
}

export interface Survey {
    id: string;
    title: string;
    description: string;
    options: string[];
    votes: { option: string; count: number }[];
    isActive: boolean;
}
