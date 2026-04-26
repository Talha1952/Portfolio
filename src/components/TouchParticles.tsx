"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "@/context/AppContext";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    isPulse: boolean;
    pulseRadius: number;
}

interface TouchParticlesProps {
    estimatoOpen?: boolean;
}

export default function TouchParticles({ estimatoOpen = false }: TouchParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const rafRef = useRef<number>(0);
    const { theme } = useAppContext();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const lightColors = ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#818CF8"];
        const darkColors = ["#06b6d4", "#a78bfa", "#34d399", "#f472b6", "#60A5FA"];

        const spawnParticles = (x: number, y: number) => {
            const colors = theme === "light" ? lightColors : darkColors;

            if (estimatoOpen) {
                // Pulse ripple when bot is open
                particlesRef.current.push({
                    x, y,
                    vx: 0, vy: 0,
                    life: 1, maxLife: 1,
                    size: 2,
                    color: theme === "light" ? "#3B82F6" : "#06b6d4",
                    isPulse: true,
                    pulseRadius: 0,
                });
            } else {
                // Glitter particles
                const count = 5;
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 0.5 + Math.random() * 1.5;
                    particlesRef.current.push({
                        x, y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed - 1,
                        life: 1,
                        maxLife: 1,
                        size: 1.5 + Math.random() * 2.5,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        isPulse: false,
                        pulseRadius: 0,
                    });
                }
            }
        };

        const onTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            if (!touch) return;
            spawnParticles(touch.clientX, touch.clientY);
        };

        window.addEventListener("touchmove", onTouchMove, { passive: true });

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current = particlesRef.current.filter(p => p.life > 0);

            for (const p of particlesRef.current) {
                const alpha = p.life / p.maxLife;

                if (p.isPulse) {
                    // Draw expanding ring
                    p.pulseRadius += 2.5;
                    p.life -= 0.04;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.pulseRadius, 0, Math.PI * 2);
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = alpha * 0.6;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                } else {
                    // Draw glitter dot
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.05; // gravity
                    p.life -= 0.025;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = alpha * 0.85;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("touchmove", onTouchMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, [theme, estimatoOpen]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 9998,
            }}
        />
    );
}
