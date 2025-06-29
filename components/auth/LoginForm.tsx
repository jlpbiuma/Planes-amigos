"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { loginUser } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/contexts/LanguageContext'

interface LoginFormProps {
    onToggleForm: () => void
}

export function LoginForm({ onToggleForm }: LoginFormProps) {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const { toast } = useToast()
    const { t } = useTranslation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const result = await loginUser(name, password)

        if (result.success && result.user) {
            login(result.user)
            toast({
                title: t('loginSuccessful'),
                description: `${t('welcomeBackUser')}, ${result.user.name}!`,
            })
        } else {
            toast({
                title: t('loginFailed'),
                description: result.error || t('somethingWentWrong'),
                variant: "destructive",
            })
        }

        setIsLoading(false)
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>{t('login')}</CardTitle>
                <CardDescription>
                    {t('welcomeBack')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            {t('name')}
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder={t('enterName')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            {t('password')}
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder={t('enterPassword')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t('signingIn') : t('signIn')}
                    </Button>
                </form>
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={onToggleForm}
                        className="text-sm text-primary hover:underline"
                    >
                        {t('dontHaveAccount')}
                    </button>
                </div>
            </CardContent>
        </Card>
    )
} 