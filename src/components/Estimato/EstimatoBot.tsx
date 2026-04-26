"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBubble from "./ChatBubble";
import EstimatoTrigger from "./EstimatoTrigger";
import { useAppContext } from "@/context/AppContext";
import { translations } from "@/constants/translations";

interface Message {
    id: number;
    text: string;
    isBot: boolean;
    options?: string[];
}

const TypingIndicator = () => (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 14px", background: "var(--bg-secondary)", borderRadius: "4px 16px 16px 16px", width: "fit-content", border: "1px solid var(--border)" }}>
        {[0, 1, 2].map((i) => (
            <span
                key={i}
                style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--accent-cyan)",
                    display: "inline-block",
                    animation: `typing-dot 1.2s ease ${i * 0.2}s infinite`,
                }}
            />
        ))}
    </div>
);

export default function EstimatoBot() {
    const { language, theme } = useAppContext();
    const t = translations[language];

    const BOT_STEPS = [
        { id: "name", text: t.bot_intro, inputType: "text", placeholder: "..." },
        { id: "type", text: t.bot_type_quest, inputType: "options", options: [t.bot_ai_automation, t.bot_web, t.bot_app, t.bot_other] },
        { id: "challenge", text: t.bot_challenge, inputType: "text", placeholder: "..." },
        { id: "budget", text: t.bot_budget, inputType: "text", placeholder: "$..." }, // Open budget
        { id: "contact_method", text: t.bot_contact_method, inputType: "options", options: [t.bot_email, t.bot_whatsapp, t.bot_discord_opt] },
        { id: "contact_detail", text: "{dynamic}", inputType: "text", placeholder: "..." },
        { id: "contact_confirm", text: t.bot_confirm_contact, inputType: "options", options: [t.bot_yes_correct, t.bot_no_wrong] },
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [stepIndex, setStepIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [msgId, setMsgId] = useState(0);

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const nextId = () => {
        setMsgId((p) => p + 1);
        return msgId + 1;
    };

    const addBotMessage = useCallback((text: string, options?: string[]) => {
        setMessages((prev) => [
            ...prev,
            { id: Date.now() + Math.random(), text, isBot: true, options },
        ]);
    }, []);

    const addUserMessage = (text: string) => {
        setMessages((prev) => [...prev, { id: Date.now() + Math.random(), text, isBot: false }]);
        resetActivityTimeout();
    };

    // Activity timeout — only close if truly idle (no input, no clicks)
    const resetActivityTimeout = useCallback(() => {
        if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
        if (isOpen && !isDone) {
            activityTimeoutRef.current = setTimeout(() => {
                setIsOpen(false);
            }, 30000); // 30 seconds of true inactivity
        }
    }, [isOpen, isDone]);

    useEffect(() => {
        if (isOpen) resetActivityTimeout();
        return () => {
            if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
        };
    }, [isOpen, resetActivityTimeout]);

    const interpolate = (template: string, data: Record<string, string>) => {
        return template.replace(/\{(\w+)\}/g, (_, key) => data[key] || "");
    };

    const startConversation = (force = false) => {
        if (messages.length === 0 || force) {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages([{ id: Date.now(), text: BOT_STEPS[0].text, isBot: true, options: BOT_STEPS[0].options }]);
            }, 500);
        }
    };

    const handleOpen = () => {
        setIsOpen(true);
        startConversation();
    };

    useEffect(() => {
        const handler = () => handleOpen();
        window.addEventListener("open-estimato", handler);

        // Auto-open after 5s but only as a trigger button glow (not full sheet)
        // Users on mobile see the trigger button pulse — they tap to open
        // We do NOT auto-open the full sheet anymore to avoid covering the screen

        return () => {
            window.removeEventListener("open-estimato", handler);
        };
    }, [isDone]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen && !isDone) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen, stepIndex, isDone]);

    const submitAnswer = async (answer: string) => {
        if (!answer.trim()) return;
        const currentStep = BOT_STEPS[stepIndex];
        const newAnswers = { ...answers, [currentStep.id]: answer };
        setAnswers(newAnswers);
        addUserMessage(answer);
        setInputValue("");

        const nextIndex = stepIndex + 1;

        if (nextIndex >= BOT_STEPS.length) {
            setIsTyping(true);
            setTimeout(async () => {
                setIsTyping(false);
                addBotMessage(t.bot_success);
                setIsDone(true);
                if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);

                // Add a "Start New" option after success
                setTimeout(() => {
                    setMessages((prev) => [
                        ...prev,
                        { id: Date.now() + Math.random(), text: t.bot_start_new || "Start another inquiry?", isBot: true, options: [t.bot_yes_new || "New Project"] },
                    ]);
                }, 2000);

                try {
                    await fetch("/api/lead", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newAnswers),
                    });
                } catch { }
            }, 1200);
        } else {
            setStepIndex(nextIndex);
            const nextStep = BOT_STEPS[nextIndex];
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                let text = interpolate(nextStep.text, newAnswers);

                // Dynamic sub-step text for contact detail
                if (nextStep.id === "contact_detail") {
                    const method = newAnswers["contact_method"];
                    if (method === t.bot_email) text = t.bot_provide_email;
                    else if (method === t.bot_whatsapp) text = t.bot_provide_whatsapp;
                    else if (method === t.bot_discord_opt) text = t.bot_provide_discord;
                }

                // Dynamic confirmation text using standard interpolation
                if (nextStep.id === "contact_confirm") {
                    text = interpolate(t.bot_confirm_contact, newAnswers);
                }

                addBotMessage(text, nextStep.options);
            }, 1000);
        }
    };

    const handleOption = (option: string) => {
        resetActivityTimeout();
        if (option === t.bot_yes_new || option === "New Project") {
            resetBot();
            return;
        }

        // Logic for re-checking contact
        if (option === t.bot_no_wrong) {
            addUserMessage(option);
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                // Loop back to detail entry
                const detailStep = BOT_STEPS.find(s => s.id === "contact_detail");
                const method = answers["contact_method"];
                let text = "";
                if (method === t.bot_email) text = t.bot_provide_email;
                else if (method === t.bot_whatsapp) text = t.bot_provide_whatsapp;
                else if (method === t.bot_discord_opt) text = t.bot_provide_discord;

                setStepIndex(BOT_STEPS.findIndex(s => s.id === "contact_detail"));
                addBotMessage(text);
            }, 800);
            return;
        }

        submitAnswer(option);
    };

    const resetBot = () => {
        setMessages([]);
        setStepIndex(0);
        setIsDone(false);
        setAnswers({});
        setInputValue("");
        setIsTyping(false); // Clear typing state
        startConversation(true); // Force it
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        resetActivityTimeout(); // Reset on every keypress
        if (e.key === "Enter") submitAnswer(inputValue);
    };

    const currentStep = BOT_STEPS[stepIndex];
    const isOptionsStep = currentStep?.inputType === "options";
    const lastMessage = messages[messages.length - 1];
    const showInput = !isDone && !isTyping && lastMessage?.isBot && !isOptionsStep && isOpen;

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const isLight = theme === "light";

    // Light Theme specific colors (Professional Glassmorphism)
    const botColors = isLight ? {
        bg: "rgba(255, 255, 255, 0.85)",
        border: "#E2E8F0",
        header: "linear-gradient(135deg, #3B82F6, #2563EB)",
        text: "#0F172A",
        shadow: "0 20px 60px rgba(59,130,246,0.18), 0 0 0 1px rgba(59,130,246,0.1)"
    } : {
        bg: "rgba(8, 11, 20, 0.95)",
        border: "rgba(6, 182, 212, 0.2)",
        header: "linear-gradient(135deg, #06b6d4, #3b82f6)",
        text: "white",
        shadow: "0 24px 64px rgba(0,0,0,0.6)"
    };

    return (
        <div style={{ position: "fixed", bottom: isMobile ? 0 : "2rem", right: isMobile ? 0 : "2rem", left: isMobile ? 0 : "auto", zIndex: 999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px", pointerEvents: isMobile && isOpen ? "none" : "auto" }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
                        animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={isMobile ? { opacity: 0, y: "100%" } : { opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
                        transition={{ type: "spring", stiffness: isMobile ? 300 : 400, damping: isMobile ? 30 : 25 }}
                        style={{
                            width: isMobile ? "100%" : "380px",
                            height: isMobile ? "80vh" : "560px", // Fixed height for desktop to ensure internal scroll
                            background: botColors.bg,
                            backdropFilter: "blur(24px)",
                            borderRadius: isMobile ? "24px 24px 0 0" : "32px",
                            border: `1px solid ${botColors.border}`,
                            borderBottom: isMobile ? "none" : `1px solid ${botColors.border}`,
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: botColors.shadow,
                            pointerEvents: "auto",
                        }}
                    >
                        {isMobile && (
                            <div style={{ padding: "8px", display: "flex", justifyContent: "center", background: botColors.header }}>
                                <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.4)" }} />
                            </div>
                        )}
                        <div style={{ padding: "20px 24px", background: botColors.header, display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "14px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🤖</div>
                            <div>
                                <div style={{ fontWeight: 800, color: "white", letterSpacing: "0.02em" }}>Estimato</div>
                                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>AI Business Consultant</div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ marginLeft: "auto", background: "rgba(255,255,255,0.15)", border: "none", width: "30px", height: "30px", borderRadius: "50%", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >✕</button>
                        </div>

                        <div
                            data-lenis-prevent // CRITICAL: Stops Lenis from hijacking mousewheel scroll
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                padding: "20px",
                                scrollbarWidth: "thin",
                                scrollbarColor: "rgba(255,255,255,0.3) rgba(255,255,255,0.05)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                                minHeight: 0,
                                overscrollBehavior: "contain" // Prevents parent scroll when reaching limits
                            }}
                            onTouchStart={resetActivityTimeout}
                            onClick={resetActivityTimeout}
                        >
                            {messages.map((msg) => (
                                <ChatBubble key={msg.id} message={msg.text} isBot={msg.isBot} options={msg.options} onOptionClick={handleOption} />
                            ))}
                            {isTyping && <TypingIndicator />}
                            <div ref={bottomRef} />
                        </div>

                        {showInput && (
                            <div style={{ padding: "16px 20px", borderTop: `1px solid ${botColors.border}`, display: "flex", gap: "10px", background: isLight ? "rgba(248,250,252,0.8)" : "rgba(255,255,255,0.02)" }}>
                                <input
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        resetActivityTimeout();
                                    }}
                                    onKeyDown={handleKeyDown}
                                    onFocus={resetActivityTimeout}
                                    placeholder="Type here..."
                                    style={{
                                        flex: 1,
                                        background: isLight ? "#fff" : "rgba(255,255,255,0.05)",
                                        border: `1px solid ${botColors.border}`,
                                        borderRadius: "14px",
                                        padding: "10px 16px",
                                        color: botColors.text,
                                        fontSize: "0.95rem",
                                        outline: "none",
                                    }}
                                />
                                <button
                                    onClick={() => submitAnswer(inputValue)}
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "14px",
                                        border: "none",
                                        background: "var(--accent-cyan)",
                                        color: "white",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "transform 0.2s"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                >→</button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            {(!isMobile || !isOpen) && (
                <div style={{ paddingRight: isMobile ? "2rem" : 0, paddingBottom: isMobile && !isOpen ? "2rem" : 0, pointerEvents: "auto", display: "flex", justifyContent: "flex-end", width: "100%" }}>
                    <EstimatoTrigger onClick={() => (isOpen ? setIsOpen(false) : handleOpen())} isOpen={isOpen} />
                </div>
            )}
        </div>
    );
}
