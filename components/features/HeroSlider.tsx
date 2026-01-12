"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";

export function HeroSlider() {
    const { siteConfig } = useStore();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (siteConfig.slider.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % siteConfig.slider.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [siteConfig.slider.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % siteConfig.slider.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + siteConfig.slider.length) % siteConfig.slider.length);
    };

    if (!siteConfig.slider.length) return null;

    return (
        <div className="relative w-full h-[600px] sm:h-[700px] overflow-hidden bg-slate-900 border-b border-white/10">
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${siteConfig.slider[currentIndex].image})` }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                <motion.div
                    key={`text-${currentIndex}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="max-w-4xl"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
                        {siteConfig.slider[currentIndex].title}
                    </h1>
                    <p className="text-xl md:text-2xl text-amber-100 font-light drop-shadow-md">
                        {siteConfig.slider[currentIndex].subtitle}
                    </p>
                </motion.div>
            </div>

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-amber-500/80 rounded-full text-white backdrop-blur-sm transition-all shadow-lg"
            >
                <ChevronLeft size={32} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-amber-500/80 rounded-full text-white backdrop-blur-sm transition-all shadow-lg"
            >
                <ChevronRight size={32} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {siteConfig.slider.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-amber-500 w-8" : "bg-white/50 hover:bg-white"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
