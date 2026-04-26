"use client";

import { useAppContext } from "@/context/AppContext";
import { translations } from "@/constants/translations";
import { motion } from "framer-motion";

export default function Footer() {
    const { language } = useAppContext();
    const t = translations[language];

    return (
        <footer style={{
            padding: "1.5rem 2rem",
            textAlign: "center",
            borderTop: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            fontSize: "0.9rem"
        }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                        {t.name}
                    </h3>
                    <p style={{ opacity: 0.7 }}>{t.role}</p>
                </motion.div>

                <p style={{ fontSize: "0.85rem", opacity: 0.6 }}>
                    {t.copyright}
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
                    {["LinkedIn", "GitHub", "Discord", "WhatsApp"].map((social) => (
                        <motion.a
                            key={social}
                            href="#"
                            whileHover={{ color: "var(--accent-cyan)", y: -2 }}
                            style={{ color: "inherit", textDecoration: "none", fontWeight: 600, transition: "color 0.2s" }}
                        >
                            {social}
                        </motion.a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
