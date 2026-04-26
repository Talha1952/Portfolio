"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppContext } from "@/context/AppContext";
import { translations } from "@/constants/translations";

gsap.registerPlugin(ScrollTrigger);

const solutions = [
    {
        id: "web-apps",
        title: "Custom Web Apps",
        tag: "Enterprise Solutions",
        description: "Highly scalable, secure, and lightning fast web applications tailored to fit your complex business requirements.",
        icon: "🚀",
        color: "#63b3ed",
        gradient: "linear-gradient(135deg, #63b3ed 0%, #3182ce 100%)",
        features: ["Scale Ready", "Custom Logic", "High Security"],
        advantages: [
            "Future-Proof Architecture: Your tech stack grows with your user base without performance drops.",
            "Maximum ROI: Automated workflows reduce manual labor costs significantly.",
            "Market Advantage: Unique, custom-built features that your competitors simply don't have."
        ],
    },
    {
        id: "ai-chatbot",
        title: "AI Chatbots",
        tag: "Automation & AI",
        description: "Intelligent conversational agents powered by LLMs that automate customer support and lead generation.",
        icon: "🤖",
        color: "#f472b6",
        gradient: "linear-gradient(135deg, #f472b6 0%, #db2777 100%)",
        features: ["NLP Trained", "24/7 Support", "CRM Sync"],
        advantages: [
            "Zero Wait Time: Engage 100% of visitors instantly, even while you sleep.",
            "Higher Conversion: Intelligent lead qualification filters high-value clients automatically.",
            "Brand Consistency: Every interaction is professional, accurate, and aligned with your brand voice."
        ],
    },
    {
        id: "pos-systems",
        title: "POS Systems",
        tag: "Business Management",
        description: "Modern Point-of-Sale systems customized to manage your sales, inventory, and analytics in real-time.",
        icon: "🛒",
        color: "#a78bfa",
        gradient: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
        features: ["Real-time", "Inventory Sync", "Analytics"],
        advantages: [
            "Data-Driven Decisions: Get real-time insights into your top-selling products and busy hours.",
            "Inventory Accuracy: Stop losing money on stock-outs or overstocking with automated tracking.",
            "Customer Loyalty: Seamless checkout and integrated rewards programs keep clients coming back."
        ],
    },
    {
        id: "seo-optimization",
        title: "SEO Optimization",
        tag: "Search Growth",
        description: "Strategic search engine optimization that puts your business at the top of search results sustainably.",
        icon: "📈",
        color: "#fbbf24",
        gradient: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
        features: ["Technical SEO", "Keyword Growth", "Site Audit"],
        advantages: [
            "Passive Traffic: Millions of searches happen daily—I'll make sure your brand is the first they see.",
            "Cost-Effective Growth: Long-term organic traffic is significantly cheaper than paid ads over time.",
            "Authority & Trust: Ranking #1 on Google instantly establishes your business as a market leader."
        ],
    },
    {
        id: "business-websites",
        title: "Business Websites",
        tag: "Digital Presence",
        description: "Premium digital experiences structured with modern architecture that convert visitors into active customers.",
        icon: "💼",
        color: "#34d399",
        gradient: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
        features: ["Fast Loading", "High Conversion", "Responsive"],
        advantages: [
            "Unbeatable Speed: 3-second load times ensure you never lose a mobile lead due to lag.",
            "Expert Credibility: A sleek, professional design converts skeptics into paying customers.",
            "Global Reach: Your business is accessible to anyone, anywhere, 24/7 with peak accessibility."
        ],
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as any } },
};

export default function BusinessSolutions() {
    const { language } = useAppContext();
    const t = translations[language];
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const titleInView = useInView(titleRef, { once: true, margin: "-50px" });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const solutionsData = [
        {
            ...t.solutions["web-apps"],
            id: "web-apps",
            icon: "🚀",
            color: "#63b3ed",
            gradient: "linear-gradient(135deg, #63b3ed 0%, #3182ce 100%)",
            features: ["Scale Ready", "Custom Logic", "High Security"],
            advantages: solutions[0].advantages,
        },
        {
            ...t.solutions["ai-chatbot"],
            id: "ai-chatbot",
            icon: "🤖",
            color: "#f472b6",
            gradient: "linear-gradient(135deg, #f472b6 0%, #db2777 100%)",
            features: ["NLP Trained", "24/7 Support", "CRM Sync"],
            advantages: solutions[1].advantages,
        },
        {
            ...t.solutions["pos-systems"],
            id: "pos-systems",
            icon: "🛒",
            color: "#a78bfa",
            gradient: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
            features: ["Real-time", "Inventory Sync", "Analytics"],
            advantages: solutions[2].advantages,
        },
        {
            ...t.solutions["seo-optimization"],
            id: "seo-optimization",
            icon: "📈",
            color: "#fbbf24",
            gradient: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
            features: ["Technical SEO", "Keyword Growth", "Site Audit"],
            advantages: solutions[3].advantages,
        },
        {
            ...t.solutions["business-websites"],
            id: "business-websites",
            icon: "💼",
            color: "#34d399",
            gradient: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
            features: ["Fast Loading", "High Conversion", "Responsive"],
            advantages: solutions[4].advantages,
        },
    ];

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
                    refreshPriority: 5, // BusinessSolutions priority
                },
            });
        });

        return () => mm.revert();
    }, []);

    return (
        <section id="business-solutions" ref={sectionRef} className="horizontal-scroll-container" style={{ background: "var(--bg-midnight)", position: "relative", zIndex: 50 }}>
            <div style={{ padding: isMobile ? "4rem 2rem 1.5rem" : "3rem 2rem 1.5rem", maxWidth: "1280px", margin: "0 auto" }} ref={titleRef}>
                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate={titleInView ? "visible" : "hidden"}
                    style={{ fontSize: "0.85rem", color: "var(--accent-purple)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 600 }}
                >
                    {t.services_subtitle}
                </motion.p>
                <motion.h2
                    variants={fadeUp}
                    initial="hidden"
                    animate={titleInView ? "visible" : "hidden"}
                    transition={{ delay: 0.1 }}
                    style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "0.5rem", color: "var(--text-primary)" }}
                >
                    {t.services_title}
                </motion.h2>
                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate={titleInView ? "visible" : "hidden"}
                    transition={{ delay: 0.2 }}
                    style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}
                >
                    {t.scroll_down}
                </motion.p>
            </div>

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
                    background: "transparent",
                    border: "none",
                    outline: "none"
                }}
            >
                {solutionsData.map((sol, index) => (
                    <SolutionCard key={sol.id} sol={sol as any} index={index} t={t} isMobile={isMobile} total={solutionsData.length} />
                ))}

                {!isMobile && <div style={{ paddingRight: "4rem" }} />}
            </div>
        </section>
    );
}

function SolutionCard({ sol, index, t, isMobile, total }: { sol: typeof solutions[0]; index: number; t: any; isMobile?: boolean, total: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "start start"]
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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={isMobile ? { opacity: 0, y: 50 } : { opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: isMobile ? "-15%" : "-100px" }}
            transition={{ duration: 0.8, delay: isMobile ? 0 : index * 0.15, ease: "easeOut" }}
            whileHover={!isMobile ? { y: -12 } : {}}
            style={{
                position: "relative",
                width: isMobile ? "100%" : "480px",
                minHeight: isMobile ? "auto" : "520px",
                transformOrigin: "center center",
                perspective: isMobile ? "1000px" : "none",
                ...(isMobile ? { rotateX, rotateY, scale: mobileScale, opacity: mobileOpacity } as any : {}),
                flexShrink: 0,
                borderRadius: "32px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: isHovered && !isMobile ? `0 30px 60px rgba(0,0,0,0.25)` : "none",
                zIndex: isMobile ? index + 1 : "auto",
            }}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 10,
                            background: sol.gradient,
                            padding: "1.5rem 2rem",
                            display: "flex",
                            flexDirection: "column",
                            color: "white",
                            overflow: "hidden",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem", flexShrink: 0 }}>
                            <span style={{ fontSize: "1.3rem" }}>{sol.icon}</span>
                            <h4 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{t.client_advantages}</h4>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "0.7rem" : "1.2rem", flex: 1, overflowY: "auto" }}>
                            {t.solutions[sol.id].adv.map((adv: string, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.08 }}
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        fontSize: isMobile ? "0.82rem" : "0.95rem",
                                        lineHeight: 1.45,
                                        background: "rgba(255,255,255,0.1)",
                                        padding: "10px",
                                        borderRadius: "10px",
                                        border: "1px solid rgba(255,255,255,0.1)"
                                    }}
                                >
                                    <span style={{ color: "white", fontWeight: 900, flexShrink: 0 }}>⚡</span>
                                    <span>{adv}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                style={{
                    height: "220px",
                    background: `${sol.gradient}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)`,
                        backgroundSize: "28px 28px",
                    }}
                />
                <motion.span
                    animate={isHovered ? { scale: 1.1, rotate: 10 } : { scale: 1, rotate: 0 }}
                    style={{ fontSize: "6rem", position: "relative", zIndex: 1, filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.3))" }}
                >
                    {sol.icon}
                </motion.span>
                <div
                    style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        padding: "6px 14px",
                        borderRadius: "999px",
                        background: "rgba(0,0,0,0.3)",
                        backdropFilter: "blur(12px)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "#fff",
                        letterSpacing: "0.05em",
                        border: "1px solid rgba(255,255,255,0.1)"
                    }}
                >
                    {t.solutions[sol.id].tag}
                </div>
            </div>

            <div style={{ padding: isMobile ? "1.5rem" : "2.5rem", flex: 1, display: "flex", flexDirection: "column", gap: isMobile ? "0.8rem" : "1.2rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? "1.4rem" : "1.85rem", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                    {t.solutions[sol.id].title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: isMobile ? "0.95rem" : "1.05rem", lineHeight: 1.7, opacity: 0.85 }}>
                    {t.solutions[sol.id].desc}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "auto" }}>
                    {t.solutions[sol.id].features.map((feature: string) => (
                        <span
                            key={feature}
                            style={{
                                padding: "6px 14px",
                                borderRadius: "10px",
                                background: "var(--bg-secondary)",
                                border: `1px solid var(--border)`,
                                color: "var(--text-primary)",
                                fontSize: "0.8rem",
                                fontWeight: 700,
                            }}
                        >
                            ✓ {feature}
                        </span>
                    ))}
                </div>
            </div>
        </motion.article>
    );
}
