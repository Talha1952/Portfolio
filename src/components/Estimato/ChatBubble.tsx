"use client";

import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";

interface ChatBubbleProps {
    message: string;
    isBot: boolean;
    options?: string[];
    onOptionClick?: (option: string) => void;
}

export default function ChatBubble({
    message,
    isBot,
    options,
    onOptionClick,
}: ChatBubbleProps) {
    const { theme } = useAppContext();
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isBot ? "flex-start" : "flex-end",
                gap: "8px",
                marginBottom: "4px",
            }}
        >
            {isBot && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "2px",
                    }}
                >
                    <div
                        style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                        }}
                    >
                        🤖
                    </div>
                    <span
                        style={{
                            fontSize: "0.7rem",
                            color: "var(--text-muted)",
                            fontWeight: 500,
                        }}
                    >
                        Estimato
                    </span>
                </div>
            )}

            <div
                style={{
                    maxWidth: "85%",
                    padding: "10px 14px",
                    borderRadius: isBot ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                    background: isBot
                        ? (theme === "light" ? "rgba(15, 23, 42, 0.05)" : "rgba(255,255,255,0.07)")
                        : "linear-gradient(135deg, #06b6d4, #3b82f6)",
                    color: !isBot ? "white" : "var(--text-primary)",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    border: isBot ? "1px solid var(--border)" : "none",
                    wordBreak: "break-word",
                    boxShadow: !isBot ? "0 4px 12px rgba(6, 182, 212, 0.2)" : "none",
                }}
            >
                {message}
            </div>

            {options && options.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginTop: "4px",
                    }}
                >
                    {options.map((opt) => (
                        <motion.button
                            key={opt}
                            whileHover={{ scale: 1.04, background: "rgba(6,182,212,0.15)" }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onOptionClick?.(opt)}
                            style={{
                                padding: "6px 14px",
                                borderRadius: "12px",
                                border: "1px solid rgba(6,182,212,0.3)",
                                background: "rgba(6,182,212,0.05)",
                                color: "var(--accent-cyan)",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {opt}
                        </motion.button>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
