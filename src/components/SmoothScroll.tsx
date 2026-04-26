"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
    children,
}: {
    children: React.ReactNode;
}) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        lenisRef.current = lenis;

        lenis.on("scroll", ScrollTrigger.update);

        // Global Resize Sync
        const handleResize = () => {
            // Wait for React & CSS to settle before refreshing
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 400);
        };

        window.addEventListener("resize", handleResize);
        ScrollTrigger.refresh();

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return <>{children}</>;
}
