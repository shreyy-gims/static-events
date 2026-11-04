'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface CountdownTimerProps {
  targetDate: string
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const target = new Date(targetDate).getTime()
      const now = new Date().getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      className="flex flex-col items-center gap-2"
      whileHover={{ scale: 1.05 }}
    >
      <div className="glassmorphism px-4 py-3 rounded-lg min-w-[80px]">
        <div className="text-3xl font-bold text-red-500">
          {String(value).padStart(2, '0')}
        </div>
      </div>
      <span className="text-xs uppercase text-gray-400 tracking-wider">{label}</span>
    </motion.div>
  )

  return (
    <div className="flex gap-4 items-center justify-center flex-wrap">
      <TimeUnit value={timeLeft.days} label="Days" />
      <span className="text-2xl text-gray-600">:</span>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className="text-2xl text-gray-600">:</span>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <span className="text-2xl text-gray-600">:</span>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  )
}
