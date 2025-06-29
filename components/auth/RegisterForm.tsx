"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ColorPicker } from '@/components/ui/color-picker'
import { registerUser } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/contexts/LanguageContext'

interface RegisterFormProps {
    onToggleForm: () => void
}

export function RegisterForm({ onToggleForm }: RegisterFormProps) {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [selectedColor, setSelectedColor] = useState('bg-blue-500')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const { toast } = useToast()
    const { t } = useTranslation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast({
                title: t('passwordsDontMatch'),
                description: t('passwordsIdentical'),
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        const result = await registerUser(name, password, selectedColor)

        if (result.success && result.user) {
            login(result.user)
            toast({
                title: t('registrationSuccessful'),
                description: `${t('welcomeToApp')}, ${result.user.name}!`,
            })
        } else {
            // Handle specific error cases
            if (result.error === 'User already exists') {
                toast({
                    title: t('userAlreadyExists'),
                    description: t('userAlreadyExistsDesc'),
                    variant: "destructive",
                })
            } else {
                toast({
                    title: t('registrationFailed'),
                    description: result.error || t('somethingWentWrong'),
                    variant: "destructive",
                })
            }
        }

        setIsLoading(false)
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>{t('signUp')}</CardTitle>
                <CardDescription>
                    {t('createAccountDescription')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="register-name" className="text-sm font-medium">
                            {t('name')}
                        </label>
                        <Input
                            id="register-name"
                            type="text"
                            placeholder={t('enterName')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="register-password" className="text-sm font-medium">
                            {t('password')}
                        </label>
                        <Input
                            id="register-password"
                            type="password"
                            placeholder={t('enterPassword')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="confirm-password" className="text-sm font-medium">
                            {t('confirmPassword')}
                        </label>
                        <Input
                            id="confirm-password"
                            type="password"
                            placeholder={t('confirmYourPassword')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <ColorPicker
                        selectedColor={selectedColor}
                        onColorChange={setSelectedColor}
                        label={t('selectColor')}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t('creatingAccount') : t('signUp')}
                    </Button>
                </form>
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={onToggleForm}
                        className="text-sm text-primary hover:underline"
                    >
                        {t('alreadyHaveAccount')}
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}
