"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppContext } from "@/context/AppContext";
import { translations } from "@/constants/translations";

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        id: "petzo",
        title: "PETZO POS",
        tag: "Point-of-Sale System",
        description:
            "A full-featured POS system built for pet stores — managing inventory, sales, customer profiles, and real-time analytics with a clean, fast interface.",
        challenge: "Replace slow Excel-based management with a real-time, multi-terminal system.",
        stack: ["Next.js", "Node.js", "MongoDB", "Tailwind"],
        color: "#06b6d4",
        gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
        emoji: "🐾",
        stats: [
            { label: "Faster Checkout", value: "4×" },
            { label: "Products Managed", value: "800+" },
            { label: "Real-time Sync", value: "✓" },
        ],
    },
    {
        id: "zaina",
        title: "Zaina Cafe Dubai",
        tag: "Premium Restaurant Website",
        description:
            "A luxury hospitality web experience for a Dubai-based café — immersive visuals, online reservations, digital menu, and brand storytelling.",
        challenge: "Create a digital presence that matches the premium physical experience of the café.",
        stack: ["Next.js", "Framer Motion", "GSAP", "Figma"],
        color: "#f472b6",
        gradient: "linear-gradient(135deg, #f472b6 0%, #a78bfa 100%)",
        emoji: "☕",
        stats: [
            { label: "Lighthouse Score", value: "98" },
            { label: "Booking ↑", value: "60%" },
            { label: "Parallax Layers", value: "12" },
        ],
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as any } },
};

export default function Projects() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const titleInView = useInView(titleRef, { once: true });
    const [isMobile, setIsMobile] = useState(false);

    const { language } = useAppContext();
    const t = translations[language];

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        let mm = gsap.matchMedia();

        mm.add("(min-width: 1025px)", () => {
            const track = trackRef.current;
            const section = sectionRef.current;
            if (!track || !section) return;

            const totalWidth = track.scrollWidth - window.innerWidth;

            gsap.to(track, {
                x: -totalWidth,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => `+=${totalWidth + window.innerHeight}`,
                    scrub: 1.2,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 1, // Projects refresh after Hero
                },
            });
        });

        return () => mm.revert();
    }, []);

    return (
        <section
            id="projects"
            ref={sectionRef}
            className="horizontal-scroll-container"
            style={{
                background: "none",
                border: "none",
                boxShadow: "none",
                position: "relative",
                zIndex: 40,
                marginBottom: "6rem", // Reduced gap for professional flow
                paddingBottom: "2rem"
            }}
        >
            <div style={{ padding: isMobile ? "2rem 2rem 1rem" : "5rem 2rem 2rem", maxWidth: "1280px", margin: "0 auto" }} ref={titleRef}>
                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate={titleInView ? "visible" : "hidden"}
                    style={{ fontSize: "0.85rem", color: "var(--accent-cyan)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 600 }}
                >
                    Case Studies
                </motion.p>
                <motion.h2
                    variants={fadeUp}
                    initial="hidden"
                    animate={titleInView ? "visible" : "hidden"}
                    transition={{ delay: 0.1 }}
                    style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}
                >
                    Featured{" "}
                    <span className="gradient-text-purple">Projects</span>
                </motion.h2>
                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate={titleInView ? "visible" : "hidden"}
                    transition={{ delay: 0.2 }}
                    style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}
                >
                    Scroll horizontally ↓
                </motion.p>
            </div>

            {/* Horizontal / Stackable track */}
            <div
                ref={trackRef}
                style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "2rem",
                    padding: isMobile ? "2rem 1.5rem 4rem" : "1rem 4rem 4rem",
                    width: isMobile ? "100%" : "max-content",
                    alignItems: "center",
                    position: "relative",
                    border: "none",
                    outline: "none",
                    background: "transparent"
                }}
            >
                {projects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} isMobile={isMobile} total={projects.length} t={t} />
                ))}

                {/* End card – CTA */}
                <motion.div
                    className=""
                    style={{
                        position: isMobile ? "relative" : "static",
                        width: isMobile ? "100%" : "380px",
                        height: isMobile ? "auto" : "480px",
                        minHeight: isMobile ? "300px" : "auto",
                        marginTop: isMobile ? "2rem" : "0",
                        borderRadius: "24px",
                        background: isMobile ? "var(--bg-card)" : "transparent",
                        border: isMobile ? "1px solid var(--border)" : "none",
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1.5rem",
                        padding: "3rem",
                        textAlign: "center",
                    }}
                >
                    <div style={{ fontSize: "3rem" }}>🚀</div>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", lineHeight: 1.2 }}>
                        {t.start_project}
                    </h2>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        {t.start_project_desc}
                    </p>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent("open-estimato"))}
                        id="projects-start-btn"
                        style={{
                            padding: "0.8rem 1.8rem",
                            borderRadius: "999px",
                            border: "none",
                            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                            color: "var(--text-on-accent)",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            cursor: "pointer",
                            fontFamily: "var(--font-sans)",
                            boxShadow: "0 0 24px rgba(6,182,212,0.3)",
                        }}
                    >
                        {t.commence_journey} →
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

function ProjectCard({ project, index, isMobile, total, t }: { project: typeof projects[0]; index: number; isMobile?: boolean; total: number; t: any }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: isMobile ? ["start 90%", "start 10%"] : ["start end", "start start"]
    });

    // Desktop Tilt Effect
    const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
    const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

    // Cool Mobile Reveal
    const mobileScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
    const mobileOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4]);

    return (
        <motion.article
            ref={cardRef}
            initial={isMobile ? { opacity: 0, y: 50 } : { opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: isMobile ? "-15%" : "-100px" }}
            transition={{ duration: 0.8, delay: isMobile ? 0 : index * 0.15, ease: "easeOut" }}
            whileHover={!isMobile ? { y: -8 } : {}}
            style={{
                position: "relative",
                width: isMobile ? "100%" : "480px",
                minHeight: isMobile ? "auto" : "480px",
                transformOrigin: "center center",
                perspective: isMobile ? "1000px" : "none",
                ...(isMobile ? { rotateX, rotateY, scale: mobileScale, opacity: mobileOpacity } as any : {}),
                flexShrink: 0,
                borderRadius: "24px",
                background: "var(--bg-card)",
                border: "none", // Removed white outline
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                cursor: "default",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                zIndex: isMobile ? index + 1 : "auto",
                boxShadow: "none", // Removed shadow to eliminate 'Box' feel
            }}
            onHoverStart={(e) => {
                // (e.target as HTMLElement).style.borderColor = "transparent";
            }}
            onHoverEnd={(e) => {
                // (e.target as HTMLElement).style.borderColor = "transparent";
            }}
        >
            {/* Card banner */}
            <div
                style={{
                    height: "200px",
                    background: `${project.gradient}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative grid */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)`,
                        backgroundSize: "28px 28px",
                    }}
                />
                <span style={{ fontSize: "5rem", position: "relative", zIndex: 1 }}>{project.emoji}</span>
                {/* Tag */}
                <div
                    style={{
                        position: "absolute",
                        top: "14px",
                        left: "14px",
                        padding: "4px 12px",
                        borderRadius: "999px",
                        background: "rgba(0,0,0,0.35)",
                        backdropFilter: "blur(8px)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "var(--text-on-accent)",
                        letterSpacing: "0.05em",
                    }}
                >
                    {t.projects?.[project.id]?.tag || project.tag}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: "1.75rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h3
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                    }}
                >
                    {t.projects?.[project.id]?.title || project.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.65 }}>
                    {t.projects?.[project.id]?.desc || project.description}
                </p>

                <div style={{ background: "rgba(0,0,0,0.03)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.4rem", textTransform: "uppercase" }}>
                        Challenge
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                        {t.projects?.[project.id]?.challenge || project.challenge}
                    </p>
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "auto" }}>
                    {(t.projects?.[project.id]?.stats || project.stats).map((s: any) => (
                        <div key={s.label} style={{ textAlign: "center", flex: 1 }}>
                            <div
                                style={{
                                    fontSize: "1.3rem",
                                    fontWeight: 800,
                                    fontFamily: "var(--font-display)",
                                    color: project.color,
                                }}
                            >
                                {s.value}
                            </div>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stack chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "0.5rem" }}>
                    {project.stack.map((tech) => (
                        <span
                            key={tech}
                            style={{
                                padding: "4px 10px",
                                borderRadius: "6px",
                                background: `${project.color}15`,
                                border: `1px solid ${project.color}30`,
                                color: project.color,
                                fontSize: "0.75rem",
                                fontWeight: 500,
                            }}
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </motion.article >
    );
}
