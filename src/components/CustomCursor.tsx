"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [trail, setTrail] = useState<{ x: number, y: number, id: number }[]>([]);

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            setTrail((prev) => [
                ...prev.slice(-12),
                { x: e.clientX, y: e.clientY, id: Date.now() }
            ]);
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    return (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99999 }}>
            {/* The Main "Typewriter" Caret */}
            <motion.div
                animate={{ x: mousePos.x, y: mousePos.y }}
                transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.1 }}
                style={{
                    width: "4px",
                    height: "24px",
                    background: "var(--accent-cyan)",
                    position: "absolute",
                    top: -12,
                    left: 10,
                    boxShadow: "0 0 15px var(--accent-cyan)",
                }}
            />

            {/* The Glitter Trail */}
            {trail.map((point, index) => (
                <motion.div
                    key={point.id}
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        position: "absolute",
                        left: point.x,
                        top: point.y,
                        width: "8px",
                        height: "8px",
                        background: index % 2 === 0 ? "var(--accent-purple)" : "var(--accent-cyan)",
                        borderRadius: "50%",
                        filter: "blur(2px)",
                    }}
                />
            ))}
        </div>
    );
}
