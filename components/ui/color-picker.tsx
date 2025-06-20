"use client"

import { useState } from 'react'

const USER_COLORS = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-lime-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-fuchsia-500',
    'bg-rose-500'
]

interface ColorPickerProps {
    selectedColor: string
    onColorChange: (color: string) => void
    label?: string
}

export function ColorPicker({ selectedColor, onColorChange, label }: ColorPickerProps) {
    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium">{label}</label>}
            <div className="grid grid-cols-8 gap-2">
                {USER_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full ${color} border-2 transition-all ${selectedColor === color
                                ? 'border-foreground scale-110'
                                : 'border-muted-foreground/20 hover:border-foreground/50'
                            }`}
                        onClick={() => onColorChange(color)}
                        aria-label={`Select ${color} color`}
                    />
                ))}
            </div>
        </div>
    )
} 