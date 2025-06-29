"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ColorPicker } from '@/components/ui/color-picker'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { updateUserProfile, updateUserPassword } from '@/lib/auth'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { tc } from '@/lib/translations'

interface UserProfileProps {
    isOpen: boolean
    onClose: () => void
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
    const { user, login, logout } = useAuth()
    const { toast } = useToast()

    const [name, setName] = useState(user?.name || '')
    const [selectedColor, setSelectedColor] = useState(user?.color || 'bg-blue-500')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setIsUpdatingProfile(true)

        const result = await updateUserProfile(user.id, {
            name: name.trim(),
            color: selectedColor
        })

        if (result.success && result.user) {
            login(result.user)
            toast({
                title: tc('profileUpdated'),
                description: tc('profileUpdated'),
            })
        } else {
            toast({
                title: tc('updateFailed'),
                description: result.error || tc('somethingWentWrong'),
                variant: "destructive",
            })
        }

        setIsUpdatingProfile(false)
    }

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        if (newPassword !== confirmNewPassword) {
            toast({
                title: tc('passwordsDontMatch'),
                description: tc('passwordsIdentical'),
                variant: "destructive",
            })
            return
        }

        if (newPassword.length < 6) {
            toast({
                title: tc('passwordTooShort'),
                description: tc('passwordMinLength'),
                variant: "destructive",
            })
            return
        }

        setIsUpdatingPassword(true)

        const result = await updateUserPassword(user.id, currentPassword, newPassword)

        if (result.success) {
            toast({
                title: tc('passwordUpdated'),
                description: tc('passwordUpdated'),
            })

            // Log out after password change
            setTimeout(() => {
                logout()
                onClose()
            }, 2000)
        } else {
            toast({
                title: tc('updateFailed'),
                description: result.error || tc('somethingWentWrong'),
                variant: "destructive",
            })
        }

        setIsUpdatingPassword(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmNewPassword('')
    }

    if (!user) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                    <DialogTitle>{tc('profile')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Profile Update */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{tc('updateProfile')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="profile-name" className="text-sm font-medium">
                                        {tc('name')}
                                    </label>
                                    <Input
                                        id="profile-name"
                                        type="text"
                                        placeholder={tc('enterName')}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <ColorPicker
                                    selectedColor={selectedColor}
                                    onColorChange={setSelectedColor}
                                    label={tc('selectColor')}
                                />

                                <Button type="submit" disabled={isUpdatingProfile} className="w-full">
                                    {isUpdatingProfile ? tc('updating') : tc('updateProfile')}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Password Update */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{tc('changePassword')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="current-password" className="text-sm font-medium">
                                        {tc('currentPassword')}
                                    </label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        placeholder={tc('enterPassword')}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="new-password" className="text-sm font-medium">
                                        {tc('newPassword')}
                                    </label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        placeholder={tc('enterPassword')}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="confirm-new-password" className="text-sm font-medium">
                                        {tc('confirmNewPassword')}
                                    </label>
                                    <Input
                                        id="confirm-new-password"
                                        type="password"
                                        placeholder={tc('confirmYourPassword')}
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button type="submit" disabled={isUpdatingPassword} className="w-full">
                                    {isUpdatingPassword ? tc('updating') : tc('changePassword')}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
} 