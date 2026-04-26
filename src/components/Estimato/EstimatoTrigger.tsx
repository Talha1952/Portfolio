"use client";

import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";

interface EstimatoTriggerProps {
    onClick: () => void;
    isOpen: boolean;
}

export default function EstimatoTrigger({ onClick, isOpen }: EstimatoTriggerProps) {
    const { theme } = useAppContext();
    const isLight = theme === "light";

    return (
        <motion.button
            id="estimato-trigger-btn"
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
            style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 20px",
                borderRadius: "999px",
                border: isLight ? "1px solid #E2E8F0" : "1px solid rgba(6,182,212,0.4)",
                background: isLight ? "rgba(255,255,255,0.98)" : "rgba(8,11,20,0.85)",
                backdropFilter: "blur(20px)",
                color: isLight ? "#3b82f6" : "var(--text-primary)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "0.9rem",
                boxShadow: isLight
                    ? "0 4px 20px rgba(59,130,246,0.15), 0 0 0 1px rgba(59,130,246,0.1)"
                    : "0 4px 24px rgba(6,182,212,0.2), 0 0 0 1px rgba(6,182,212,0.1)",
                zIndex: 1000,
            }}
            aria-label="Open Estimato Chat"
        >
            {/* Pulse ring */}
            {!isOpen && (
                <>
                    <motion.span
                        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "999px",
                            border: `1px solid ${isLight ? "#3B82F640" : "rgba(6,182,212,0.5)"}`,
                            pointerEvents: "none",
                        }}
                    />
                    <motion.span
                        animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "999px",
                            border: `1px solid ${isLight ? "#3B82F620" : "rgba(6,182,212,0.3)"}`,
                            pointerEvents: "none",
                        }}
                    />
                </>
            )}

            {/* Bot avatar */}
            <div
                style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    flexShrink: 0,
                }}
            >
                🤖
            </div>

            <span>Estimato</span>

            {/* Close / Open icon */}
            <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: "18px", lineHeight: 1, display: "flex" }}
            >
                {isOpen ? "✕" : "✦"}
            </motion.span>
        </motion.button>
    );
}
