"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { FiSun, FiMoon, FiGlobe } from "react-icons/fi";
import { useState } from "react";

const languages = [
    { code: "en", name: "EN", flag: "🇺🇸" },
    { code: "es", name: "ES", flag: "🇪🇸" },
    { code: "zh", name: "ZH", flag: "🇨🇳" },
    { code: "ar", name: "AR", flag: "🇦🇪" },
];

export default function SiteSettings() {
    const { theme, setTheme, language, setLanguage } = useAppContext();
    const [isLangOpen, setIsLangOpen] = useState(false);

    return (
        <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 1000, display: "flex", gap: "10px", alignItems: "center" }}>
            {/* Language Selection */}
            <div style={{ position: "relative" }}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    style={{
                        background: "var(--glass)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        padding: "0 12px",
                        height: "44px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        color: "var(--text-primary)",
                        backdropFilter: "blur(12px)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                    }}
                >
                    <FiGlobe size={18} />
                    {language.toUpperCase()}
                </motion.button>

                <AnimatePresence>
                    {isLangOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            style={{
                                position: "absolute",
                                top: "54px",
                                right: 0,
                                background: "var(--bg-secondary)",
                                border: "1px solid var(--border)",
                                borderRadius: "16px",
                                padding: "8px",
                                minWidth: "120px",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                            }}
                        >
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code as any);
                                        setIsLangOpen(false);
                                    }}
                                    style={{
                                        padding: "10px 12px",
                                        borderRadius: "10px",
                                        border: "none",
                                        background: language === lang.code ? "var(--bg-card-hover)" : "transparent",
                                        color: "var(--text-primary)",
                                        fontSize: "0.85rem",
                                        fontWeight: 500,
                                        cursor: "pointer",
                                        textAlign: "left",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        transition: "background 0.2s",
                                    }}
                                >
                                    <span>{lang.flag}</span>
                                    {lang.name}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                style={{
                    background: "var(--glass)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "var(--text-primary)",
                    backdropFilter: "blur(12px)",
                }}
            >
                {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
            </motion.button>
        </div>
    );
}

