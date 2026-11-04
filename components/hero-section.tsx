'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FloatingParticles } from './floating-particles'
import { CountdownTimer } from './countdown-timer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface HeroSectionProps {
  eventDate: string
  onTicketClick?: () => void
  backgroundImage?: string
}

export function HeroSection({ eventDate, onTicketClick, backgroundImage }: HeroSectionProps) {
  const router = useRouter()

  const handleTicketClick = () => {
    if (onTicketClick) {
      onTicketClick()
    } else {
      router.push('/events')
    }
  }

  return (
    <div 
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for mystery effect */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Mysterious glow effects */}
      <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      
      {/* Content container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-20 md:py-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full max-w-2xl text-center space-y-8 md:space-y-12"
        >
          {/* Main heading - Mysterious style */}
          <motion.div
            className="space-y-4 md:space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-balance leading-tight md:leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent block mb-2">
                AfterDark
              </span>
              <span className="text-white block">Society</span>
            </motion.h1>
            
            <motion.div
              className="h-1 w-16 bg-gradient-to-r from-red-500 to-red-700 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
            
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="text-red-400">Where the night</span> comes alive. Premium experiences for the bold.
            </motion.p>
          </motion.div>

          {/* Countdown timer - More prominent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="py-6 md:py-8 space-y-4"
          >
            <p className="text-xs sm:text-sm md:text-base text-gray-400 uppercase tracking-widest font-semibold">
              ✦ Event starts in ✦
            </p>
            <div className="scale-75 sm:scale-90 md:scale-100 origin-top">
              <CountdownTimer targetDate={eventDate} />
            </div>
          </motion.div>

          {/* CTA buttons - Better spacing */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 md:pt-8 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <motion.button
              onClick={handleTicketClick}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-red-600/50 active:scale-95 text-sm sm:text-base w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Your Ticket
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/rules"
                className="block px-6 sm:px-8 py-3 sm:py-4 glassmorphism text-white font-bold rounded-lg transition-all text-sm sm:text-base"
              >
                Event Rules
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
