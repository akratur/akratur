import { SiteConfig, Tour, School, Student, Survey, Location } from "./types";




export const initialSurveys: Survey[] = [
    {
        id: "srv1",
        title: "Gelecek Tur Rotası",
        description: "Sonbahar dönemi için hangi şehre gezi düzenlenmesini istersiniz?",
        options: ["Kapadokya", "Çanakkale", "Pamukkale", "Safranbolu"],
        votes: [
            { option: "Kapadokya", count: 12 },
            { option: "Çanakkale", count: 8 }
        ],
        isActive: true
    }
];

export const initialLocations: Location[] = [
    {
        id: "loc1",
        title: "Feza Gürsey Bilim Merkezi",
        description: "Türkiye'nin en büyük bilim merkezlerinden biri olan Feza Gürsey Bilim Merkezi, 10.000 m² kapalı alanda 250'den fazla interaktif deney düzeneği ile öğrencilere eğlenceli ve öğretici bir deneyim sunmaktadır.",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
        videoUrl: "" // Optional
    },
    {
        id: "loc2",
        title: "Rahmi M. Koç Müzesi",
        description: "Endüstri, ulaşım ve iletişim tarihine ışık tutan Rahmi M. Koç Müzesi, tarihi Lengerhane binasında konumlanan Türkiye'nin ilk büyük sanayi müzesidir. Koleksiyonunda binlerce tarihi eser bulunmaktadır.",
        image: "https://images.unsplash.com/photo-1566808779956-628d086576cb?auto=format&fit=crop&q=80&w=600",
        videoUrl: ""
    }
];


export const initialSiteConfig: SiteConfig = {
    logo: "/logo.png",
    slider: [
        {
            id: "1",
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
            title: "Bilim ve Teknoloji Turları",
            subtitle: "Geleceğin mucitleri için ilham verici geziler."
        },
        {
            id: "2",
            image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop",
            title: "Kültürel Miras Turları",
            subtitle: "Tarihimizi yerinde öğreniyoruz."
        },
        {
            id: "3",
            image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2072&auto=format&fit=crop",
            title: "Doğa ve Kamp Turları",
            subtitle: "Doğayla iç içe eşsiz bir deneyim."
        },
        {
            id: "4",
            image: "https://images.unsplash.com/photo-1560523160-754a9e25c68f?q=80&w=2036&auto=format&fit=crop",
            title: "Eğlence ve Macera",
            subtitle: "Öğrencilerimiz için unutulmaz anlar."
        }
    ],
    stats: [
        { label: "Mutlu Öğrenci", value: "15000+" },
        { label: "Düzenlenen Tur", value: "450+" },
        { label: "Anlaşmalı Okul", value: "80+" },
        { label: "Tecrübeli Rehber", value: "30+" }
    ],
    contact: {
        phone: "+90 (212) 123 45 67",
        email: "info@akratur.com",
        address: "Atatürk Bulvarı No:173 Çankaya, Ankara",
        footerText: "Okullar için kültür, bilim, eğitim ve eğlence odaklı turlar düzenliyoruz. Öğrencilerinizin güvenli ve eğitici bir deneyim yaşaması için buradayız.",
        socials: {
            facebook: "https://facebook.com",
            instagram: "https://instagram.com",
            twitter: "https://twitter.com",
            linkedin: "https://linkedin.com"
        }
    }
};

export const initialTours: Tour[] = [
    {
        id: "t1",
        title: "Ankara Bilim ve Kültür Gezisi",
        description: "Anıtkabir ziyareti, I. ve II. Meclis, ve Bilim Merkezi gezisi içeren kapsamlı bir tur.",
        coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/An%C4%B1tkabir_Front_View.jpg/1200px-An%C4%B1tkabir_Front_View.jpg",
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/An%C4%B1tkabir_Front_View.jpg/1200px-An%C4%B1tkabir_Front_View.jpg",
            "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fc/0e/mta-sehit-cuma-dag-tabiat.jpg?w=1200&h=-1&s=1"
        ],
        type: "culture",
        date: "2026-04-23",
        location: "Ankara",
        itinerary: [
            { time: "07:00", activity: "Okul önünden hareket" },
            { time: "11:00", activity: "Anıtkabir Ziyareti" },
            { time: "13:00", activity: "Öğle Yemeği" },
            { time: "14:30", activity: "MTA Tabiat Tarihi Müzesi" },
            { time: "17:00", activity: "Dönüş yolculuğu" }
        ],
        locationIds: ["loc1"]
    },
    {
        id: "t2",
        title: "Eskişehir Uzay Evi ve Sazova Parkı",
        description: "Bilim Deney Merkezi, Sabancı Uzay Evi ve Sazova Parkı'nda eğlenceli bir gün.",
        coverImage: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Masal_Satosu_Eskisehir.jpg",
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/9/9d/Masal_Satosu_Eskisehir.jpg",
            "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/f2/86/5a/sazova-parki.jpg?w=1200&h=-1&s=1"
        ],
        type: "science",
        date: "2026-05-15",
        location: "Eskişehir",
        itinerary: [
            { time: "08:00", activity: "Hareket" },
            { time: "11:00", activity: "Sazova Parkı ve Masal Şatosu" },
            { time: "13:00", activity: "Yemek Molası" },
            { time: "14:30", activity: "Bilim Deney Merkezi ve Uzay Evi" },
            { time: "18:00", activity: "Dönüş" }
        ],
        locationIds: ["loc2"]
    }
];

export const initialSchools: School[] = [
    {
        id: "s1",
        name: "Cumhuriyet Koleji",
        city: "İstanbul",
        district: "Kadıköy",
        contactName: "Ayşe Yılmaz",
        phone: "0555 123 45 67",
        username: "cumhuriyet",
        password: "123", // Demo password
        assignedTours: [
            { tourId: "t1", price: 1500 },
            { tourId: "t2", price: 1200 }
        ],
        accessCode: "CK2024",
        iban: "TR12 3456 7890 1234 5678 9012 34"
    },
    {
        id: "s2",
        name: "Atatürk Fen Lisesi",
        city: "İzmir",
        district: "Bornova",
        contactName: "Mehmet Demir",
        phone: "0532 987 65 43",
        username: "ataturkfen",
        password: "123",
        assignedTours: [
            { tourId: "t1", price: 1400 }
        ],
        accessCode: "AFL2024"
    }
];

export const initialStudents: Student[] = [];
