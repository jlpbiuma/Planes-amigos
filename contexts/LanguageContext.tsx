"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, setCurrentLanguage, t } from '@/lib/translations'

interface LanguageContextType {
    language: Language
    setLanguage: (language: Language) => void
    toggleLanguage: () => void
    t: (key: string) => any
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
            // Update HTML lang attribute for stored preference
            document.documentElement.lang = storedLanguage
        } else {
            setCurrentLanguage('es')
            // Update HTML lang attribute for default language
            document.documentElement.lang = 'es'
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

    // Reactive translation function that will cause re-renders
    const translate = (key: string) => {
        return t(key, language)
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, toggleLanguage, t: translate }}>
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

// Custom hook for just translations (components can use this instead of tc)
export function useTranslation() {
    const { t } = useLanguage()
    return { t }
} 