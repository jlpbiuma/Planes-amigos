"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ColorPicker } from '@/components/ui/color-picker'
import { registerUser } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import { tc } from '@/lib/translations'

// Simple toast implementation for now
const useToast = () => ({
    toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
        console.log(`${variant === 'destructive' ? '❌' : '✅'} ${title}: ${description}`)
    }
})

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast({
                title: tc('passwordsDontMatch'),
                description: tc('passwordsIdentical'),
                variant: "destructive",
            })
            return
        }

        if (password.length < 6) {
            toast({
                title: tc('passwordTooShort'),
                description: tc('passwordMinLength'),
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        const result = await registerUser(name, password, selectedColor)

        if (result.success && result.user) {
            login(result.user)
            toast({
                title: tc('registrationSuccessful'),
                description: `${tc('welcomeToApp')}, ${result.user.name}!`,
            })
        } else {
            toast({
                title: tc('registrationFailed'),
                description: result.error || tc('somethingWentWrong'),
                variant: "destructive",
            })
        }

        setIsLoading(false)
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>{tc('signUp')}</CardTitle>
                <CardDescription>
                    {tc('createAccountDescription')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="register-name" className="text-sm font-medium">
                            {tc('name')}
                        </label>
                        <Input
                            id="register-name"
                            type="text"
                            placeholder={tc('enterName')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="register-password" className="text-sm font-medium">
                            {tc('password')}
                        </label>
                        <Input
                            id="register-password"
                            type="password"
                            placeholder={tc('enterPassword')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="confirm-password" className="text-sm font-medium">
                            {tc('confirmPassword')}
                        </label>
                        <Input
                            id="confirm-password"
                            type="password"
                            placeholder={tc('confirmYourPassword')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <ColorPicker
                        selectedColor={selectedColor}
                        onColorChange={setSelectedColor}
                        label={tc('selectColor')}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? tc('creatingAccount') : tc('signUp')}
                    </Button>
                </form>
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={onToggleForm}
                        className="text-sm text-primary hover:underline"
                    >
                        {tc('alreadyHaveAccount')}
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}
