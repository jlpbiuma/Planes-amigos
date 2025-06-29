"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut, Moon, Sun, Languages, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage, useTranslation } from '@/contexts/LanguageContext'
import { UserProfile } from '@/components/profile/UserProfile'

export function Header() {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const { language, toggleLanguage } = useLanguage()
    const { t } = useTranslation()
    const [showProfile, setShowProfile] = useState(false)

    const handleLogout = () => {
        logout()
    }

    if (!user) {
        return null
    }

    return (
        <>
            <header className="sticky top-0 z-50 border-b p-4 backdrop-blur-sm">
                <div className="w-full max-w-none px-2 flex items-center justify-between">
                    <h1 className="text-lg sm:text-xl font-semibold truncate">{t('appName')}</h1>
                    <div className="flex items-center space-x-1">
                        <div className="hidden sm:flex items-center space-x-2 mr-2">
                            <div className={`w-6 h-6 rounded-full ${user.color}`} />
                            <span className="text-sm text-muted-foreground truncate max-w-20">{t('hi')}, {user.name}!</span>
                        </div>
                        <div className="sm:hidden flex items-center mr-2">
                            <div className={`w-6 h-6 rounded-full ${user.color}`} />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setShowProfile(true)} className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleLanguage} title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'} className="h-8 w-8">
                            <Languages className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
                            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* User Profile Dialog */}
            {showProfile && (
                <UserProfile
                    isOpen={showProfile}
                    onClose={() => setShowProfile(false)}
                />
            )}
        </>
    )
} 