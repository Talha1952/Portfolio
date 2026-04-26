"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { SiJavascript, SiMongodb, SiReact, SiNodedotjs, SiPython } from "react-icons/si";
import { FaRobot } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppContext } from "@/context/AppContext";
import { translations } from "@/constants/translations";

gsap.registerPlugin(ScrollTrigger);

function TypewriterText({ text }: { text: string }) {
    const [displayed, setDisplayed] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const typingSpeed = 100;
        const deletingSpeed = 60;
        const pauseEnd = 2000;
        const pauseStart = 500;

        const tick = () => {
            let currentLength = displayed.length;

            if (!isDeleting) {
                if (currentLength < text.length) {
                    setDisplayed(text.substring(0, currentLength + 1));
                    timeout = setTimeout(tick, typingSpeed);
                } else {
                    timeout = setTimeout(() => setIsDeleting(true), pauseEnd);
                }
            } else {
                if (currentLength > 0) {
                    setDisplayed(text.substring(0, currentLength - 1));
                    timeout = setTimeout(tick, deletingSpeed);
                } else {
                    timeout = setTimeout(() => setIsDeleting(false), pauseStart);
                }
            }
        };

        timeout = setTimeout(tick, typingSpeed);
        return () => clearTimeout(timeout);
    }, [displayed, isDeleting, text]);

    return (
        <span>
            {displayed}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                style={{ borderRight: "4px solid var(--accent-cyan)", marginLeft: "4px" }}
            />
        </span>
    );
}

export default function Hero() {
    const { language } = useAppContext();
    const t = translations[language];
    const containerRef = useRef<HTMLDivElement>(null);

    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Calculate transforms based on GSAP scrollProgress
    const imageScale = 1 - (scrollProgress * 0.05); // 1 to 0.95
    const introOpacity = isMobile ? 1 : (scrollProgress < 0.3 ? 0 : (scrollProgress > 0.8 ? 1 : (scrollProgress - 0.3) / 0.5));
    const pointerEventsStyle = isMobile ? "auto" : (scrollProgress > 0.4 ? "auto" : "none");

    const initialRef = useRef(null);
    const inView = useInView(initialRef, { once: true });

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
        checkMobile();

        const handleResize = () => {
            checkMobile();
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Force refresh when isMobile state changes
    useEffect(() => {
        if (!mounted) return;
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 300);
        return () => clearTimeout(timer);
    }, [isMobile, mounted]);

    useEffect(() => {
        if (!mounted || isMobile) return;

        let mm = gsap.matchMedia();
        mm.add("(min-width: 1025px)", () => {
            if (!containerRef.current) return;
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom", // Track full duration of parent
                onUpdate: (self) => setScrollProgress(self.progress),
                invalidateOnRefresh: true,
                refreshPriority: 10,
            });
        });

        return () => mm.revert();
    }, [mounted, isMobile]);

    const scrollToProjects = () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    };

    const openEstimato = () => {
        window.dispatchEvent(new CustomEvent("open-estimato"));
    };

    // If not mounted, render a placeholder with the same height to avoid layout shift and ref issues
    if (!mounted) {
        return <section id="hero" ref={containerRef} style={{ height: isMobile ? "100vh" : "220vh", position: "relative", width: "100%" }} />;
    }

    return (
        <section
            id="hero"
            ref={containerRef}
            style={{ minHeight: isMobile ? "100vh" : "220vh", position: "relative", width: "100%", zIndex: 10 }}
        >
            <div
                style={{
                    position: isMobile ? "relative" : "sticky",
                    top: 0,
                    height: isMobile ? "auto" : "100vh",
                    overflow: "hidden",
                    width: "100%",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: isMobile ? "2rem" : "0",
                    paddingBottom: isMobile ? "4rem" : "0",
                    willChange: "transform, opacity",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                }}
            >
                <motion.div
                    style={{
                        position: isMobile ? "relative" : "absolute",
                        left: isMobile ? "auto" : "50%",
                        top: isMobile ? "auto" : "50%",
                        y: isMobile ? 0 : "-50%",
                        x: isMobile ? 0 : (isMobile ? 0 : `calc(-50% - ${Math.min(1, scrollProgress / 0.7) * 95}%)`), // Smoothly move left
                        scale: isMobile ? 1 : imageScale,
                        opacity: 1,
                        width: isMobile ? "100%" : "600px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        zIndex: 20,
                        pointerEvents: "none"
                    }}
                >
                    <div ref={initialRef} style={{ position: "relative", width: isMobile ? "180px" : "350px", height: isMobile ? "240px" : "450px", margin: "0 auto 1.5rem" }}>
                        {/* Background Colorful Glow - Softened to avoid 'box' look */}
                        <div style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: isMobile ? "220px" : "330px",
                            height: isMobile ? "220px" : "330px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                            filter: "blur(15px)",
                            opacity: 0.8,
                            zIndex: 1,
                        }} />


                        {/* Floating Tech Icons */}
                        <FloatingIcon icon={<SiJavascript />} color="#F7DF1E" top="10%" left="0%" delay={0} isMobile={isMobile} />
                        <FloatingIcon icon={<SiReact />} color="#61DAFB" top="65%" left="0%" delay={0.5} isMobile={isMobile} />
                        <FloatingIcon icon={<SiNodedotjs />} color="#339933" top="20%" right="0%" delay={1} isMobile={isMobile} />
                        <FloatingIcon icon={<SiMongodb />} color="#47A248" top="75%" right="0%" delay={1.5} isMobile={isMobile} />
                        <FloatingIcon icon={<SiPython />} color="#3776AB" top="5%" right="15%" delay={2} isMobile={isMobile} />
                        <FloatingIcon icon={<FaRobot />} color="#FF00FF" bottom="5%" left="15%" delay={2.5} isMobile={isMobile} />

                        {/* The Profile Image */}
                        <motion.img
                            src="/profile.png"
                            alt={t.name}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                position: "relative",
                                zIndex: 2,
                                filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.25))",
                                willChange: "transform",
                                WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 95%)",
                                maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 95%)",
                            }}
                        />

                    </div>

                    <motion.p
                        style={{ color: "var(--accent-cyan)", fontWeight: 500, marginBottom: "0.5rem" }}
                    >
                        {t.greeting}
                    </motion.p>
                    <h1 style={{
                        fontWeight: 900,
                        fontFamily: "var(--font-display)",
                        color: "var(--text-primary)",
                        marginBottom: "0.5rem",
                        whiteSpace: isMobile ? "normal" : "nowrap",
                        lineHeight: 1.1
                    }}>
                        <TypewriterText text={t.name} />
                    </h1>
                    <div style={{ color: "var(--text-secondary)", fontWeight: 500, lineHeight: 1.5 }}>
                        Founder of DevSphere<br />
                        <span style={{ color: "var(--accent-cyan)" }}>Full Stack &amp; AI Automation Developer</span>
                    </div>
                </motion.div>

                {/* BLOCK 2: THE REVEAL INTRO TEXT - Removed Glass Box */}
                <motion.div
                    style={{
                        position: isMobile ? "relative" : "absolute",
                        left: isMobile ? "auto" : "50%",
                        top: isMobile ? "auto" : "50%",
                        y: isMobile ? 0 : "-50%",
                        x: isMobile ? 0 : (isMobile ? 0 : `${Math.max(0, 60 - (scrollProgress * 150))}%`), // Slide from right
                        opacity: isMobile ? 1 : introOpacity,
                        width: isMobile ? "90%" : "600px", // Larger intro
                        marginTop: isMobile ? "1.5rem" : "0",
                        zIndex: 10,
                        pointerEvents: isMobile ? "auto" : (pointerEventsStyle as any)
                    }}
                >
                    <div style={{ textAlign: isMobile ? "center" : "left", padding: "1rem" }}>
                        <h2 style={{ fontSize: isMobile ? "clamp(1.8rem, 8vw, 2.5rem)" : "3.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "1.25rem", lineHeight: 1.1, fontFamily: "var(--font-display)" }}>
                            {t.intro_title}
                        </h2>
                        <p style={{ fontSize: isMobile ? "1rem" : "1.25rem", color: "var(--text-primary)", lineHeight: 1.65, marginBottom: isMobile ? "1.25rem" : "3.5rem", opacity: 0.9 }}>
                            {t.intro_desc}
                        </p>

                        <div style={{ display: "flex", gap: "0.5rem", flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start", width: isMobile ? "100%" : "auto" }}>
                            <MagneticButton>
                                <button
                                    onClick={openEstimato}
                                    style={{
                                        padding: isMobile ? "0.6rem 1.2rem" : "1.1rem 2.5rem",
                                        borderRadius: "12px",
                                        border: "none",
                                        background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                                        color: "white", /* stays white on gradient bg */
                                        fontSize: isMobile ? "0.95rem" : "1.05rem",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        boxShadow: "0 15px 35px rgba(6, 182, 212, 0.35)",
                                        transition: "all 0.3s ease",
                                        width: isMobile ? "100%" : "auto"
                                    }}
                                >
                                    {t.commence_journey} →
                                </button>
                            </MagneticButton>

                            <MagneticButton>
                                <button
                                    onClick={scrollToProjects}
                                    style={{
                                        padding: isMobile ? "0.6rem 1.2rem" : "1.1rem 2.5rem",
                                        borderRadius: "12px",
                                        border: "1px solid var(--border)",
                                        background: "transparent",
                                        color: "var(--text-primary)",
                                        fontSize: isMobile ? "0.95rem" : "1.05rem",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        width: isMobile ? "100%" : "auto"
                                    }}
                                >
                                    {t.view_work}
                                </button>
                            </MagneticButton>
                        </div>
                    </div>
                </motion.div>

                {/* Decorative Orbs */}
                <div style={{ position: "absolute", top: "10%", left: "5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
            </div>
        </section>
    );
}

function FloatingIcon({ icon, color, top, left, right, bottom, delay, isMobile }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
            transition={{
                opacity: { duration: 0.5, delay },
                scale: { duration: 0.5, delay },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
            }}
            style={{
                position: "absolute",
                top, left, right, bottom,
                fontSize: isMobile ? "1.5rem" : "2.5rem",
                color,
                zIndex: 3,
                filter: `drop-shadow(0 0 10px ${color}40)`,
            }}
        >
            {icon}
        </motion.div>
    );
}
