"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light";
type Language = "en" | "es" | "zh" | "ar";

interface AppContextType {
    theme: Theme;
    setTheme: (t: Theme) => void;
    language: Language;
    setLanguage: (l: Language) => void;
    isLanguageModalOpen: boolean;
    setLanguageModalOpen: (b: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");
    const [language, setLanguage] = useState<Language>("en");
    const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);

    // Initial load checks
    useEffect(() => {
        const savedLanguage = localStorage.getItem("app-language") as Language;
        if (!savedLanguage) {
            setLanguageModalOpen(true);
        } else {
            setLanguage(savedLanguage);
        }

        const savedTheme = localStorage.getItem("app-theme") as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const updateLanguage = (l: Language) => {
        setLanguage(l);
        localStorage.setItem("app-language", l);
        setLanguageModalOpen(false);
    };

    const updateTheme = (t: Theme) => {
        setTheme(t);
        localStorage.setItem("app-theme", t);
        document.documentElement.setAttribute("data-theme", t);
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <AppContext.Provider
            value={{
                theme,
                setTheme: updateTheme,
                language,
                setLanguage: updateLanguage,
                isLanguageModalOpen,
                setLanguageModalOpen,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within AppProvider");
    return context;
}
