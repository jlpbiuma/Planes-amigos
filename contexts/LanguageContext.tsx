"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, setCurrentLanguage } from '@/lib/translations'

interface LanguageContextType {
    language: Language
    setLanguage: (language: Language) => void
    toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('es')

    useEffect(() => {
        // Check for stored language preference
        const storedLanguage = localStorage.getItem('language') as Language
        if (storedLanguage && (storedLanguage === 'es' || storedLanguage === 'en')) {
            setLanguage(storedLanguage)
            setCurrentLanguage(storedLanguage)
        } else {
            setCurrentLanguage('es')
        }
    }, [])

    const handleSetLanguage = (newLanguage: Language) => {
        setLanguage(newLanguage)
        setCurrentLanguage(newLanguage)
        localStorage.setItem('language', newLanguage)

        // Update HTML lang attribute
        document.documentElement.lang = newLanguage
    }

    const toggleLanguage = () => {
        const newLanguage = language === 'es' ? 'en' : 'es'
        handleSetLanguage(newLanguage)
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
} 