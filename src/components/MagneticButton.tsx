"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
    children: ReactNode;
    strength?: number;
    className?: string;
    onClick?: () => void;
}

export default function MagneticButton({
    children,
    strength = 0.3,
    className = "",
    onClick,
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 200, damping: 20 });
    const springY = useSpring(y, { stiffness: 200, damping: 20 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * strength);
        y.set((e.clientY - centerY) * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={ref}
            style={{ x: springX, y: springY, display: "inline-block" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={className}
        >
            {children}
        </motion.div>
    );
}
