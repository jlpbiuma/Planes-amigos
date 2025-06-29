"use client"

import { useState, useRef, useEffect } from 'react'

export function BackgroundVideo() {
    const [videoLoaded, setVideoLoaded] = useState(false)
    const [videoError, setVideoError] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current
        if (video) {
            const handleLoadedData = () => {
                setVideoLoaded(true)
                setVideoError(false)
            }

            const handleError = () => {
                setVideoError(true)
                setVideoLoaded(false)
            }

            const handleCanPlay = () => {
                video.play().catch(() => { })
            }

            video.addEventListener('loadeddata', handleLoadedData)
            video.addEventListener('error', handleError)
            video.addEventListener('canplay', handleCanPlay)

            return () => {
                video.removeEventListener('loadeddata', handleLoadedData)
                video.removeEventListener('error', handleError)
                video.removeEventListener('canplay', handleCanPlay)
            }
        }
    }, [])

    return (
        <>
            {/* Background Video */}
            {!videoError && (
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className={`fixed inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    style={{ zIndex: -20 }}
                >
                    <source src="/video/background_video_mar.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}

            {/* Fallback gradient background if video fails */}
            {(videoError || !videoLoaded) && (
                <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-80" style={{ zIndex: -20 }}></div>
            )}

            {/* Dark overlay for the entire screen for better text readability */}
            <div className="fixed inset-0 bg-black/40" style={{ zIndex: -10 }}></div>

            {/* Loading indicator for video */}
            {!videoLoaded && !videoError && (
                <div className="absolute top-4 right-4 z-20">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
            )}
        </>
    )
} 