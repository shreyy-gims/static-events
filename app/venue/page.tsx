'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { MapPin, Clock, Navigation, Wifi, Wine, Accessibility } from 'lucide-react'

export default function VenuePage() {
  return (
    <main className="bg-background text-foreground min-h-screen bg-gradient-to-b from-transparent via-red-600/5 to-transparent">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center space-y-4">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 glassmorphism rounded-full text-red-400"
                whileHover={{ scale: 1.05 }}
              >
                <MapPin size={16} />
                <span className="text-sm font-semibold">Premium Venue</span>
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold text-balance">
                <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                  The Underground
                </span>
              </h1>
              <p className="text-xl text-gray-300">The most exclusive and sophisticated venue in the city</p>
            </div>

            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="glassmorphism p-4 rounded-lg text-center"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)' }}
              >
                <Clock size={20} className="mx-auto mb-2 text-red-500" />
                <p className="text-xs text-gray-400 mb-1">Open Hours</p>
                <p className="text-sm font-bold">11 AM - 5 PM</p>
              </motion.div>
              <motion.div
                className="glassmorphism p-4 rounded-lg text-center"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)' }}
              >
                <MapPin size={20} className="mx-auto mb-2 text-red-500" />
                <p className="text-xs text-gray-400 mb-1">Location</p>
                <p className="text-sm font-bold">Downtown</p>
              </motion.div>
              <motion.div
                className="glassmorphism p-4 rounded-lg text-center"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)' }}
              >
                <Wine size={20} className="mx-auto mb-2 text-red-500" />
                <p className="text-xs text-gray-400 mb-1">Premium</p>
                <p className="text-sm font-bold">lounge</p>
              </motion.div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Map Section */}
              <motion.div
                className="glassmorphism rounded-xl overflow-hidden"
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(220, 38, 38, 0.3)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890!2d-118.2436842!3d34.0522342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75dbed57005%3A0xce03537ca6500029!2sThe%20Broad!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="400"
                  style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
              </motion.div>

              {/* Venue Details */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="glassmorphism rounded-xl p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="text-red-500 mt-1">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Address</h3>
                      <p className="text-gray-400">Bhilai</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="text-red-500 mt-1">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Time</h3>
                      <p className="text-gray-400">May 14, 2026 • 11:00 AM - 5:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="text-red-500 mt-1">
                      <Navigation size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Getting There</h3>
                      <p className="text-gray-400">
                        Street parking available • Public transit nearby • Valet service available
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <motion.div
                  className="glassmorphism rounded-xl p-6 space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-xl font-bold">Venue Amenities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Premium Bar', icon: Wine },
                      { name: 'Dance Floor', icon: Wifi },
                      { name: 'VIP Lounge', icon: MapPin },
                      { name: 'Coat Check', icon: MapPin },
                      { name: 'Restrooms', icon: MapPin },
                      { name: 'Security', icon: MapPin },
                      { name: 'Parking', icon: MapPin },
                      { name: 'Accessible', icon: Accessibility },
                    ].map((item) => (
                      <motion.div
                        key={item.name}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition"
                        whileHover={{ x: 5 }}
                      >
                        <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{item.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Get Directions Button */}
                <a
                  href="https://www.google.com/maps/search/123+Neon+Street,+Night+City,+NC+12345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 text-center shadow-lg shadow-red-600/50"
                >
                  Get Directions
                </a>
              </motion.div>
            </div>

            {/* Venue Description */}
            <motion.div
              className="mt-12 glassmorphism rounded-xl p-8 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">About The Underground</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700" />
              </div>
              <p className="text-gray-300 leading-relaxed">
                This private gathering is designed to bring together a curated crowd in a comfortable and well-managed environment focused on music, social interaction, entertainment, and memorable experiences.
                The venue setup, atmosphere, and event planning are carefully organized to create a premium and enjoyable experience for all attendees. From lighting and music to hospitality and overall ambience, every detail is planned to maintain a sophisticated and energetic environment.
                Entry is limited and approval-based to ensure a quality crowd and smooth event experience. Guests are expected to maintain respectful behavior and follow all event guidelines throughout the gathering.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The venue features multiple levels, exclusive VIP areas, and carefully curated
                entertainment. Our attentive staff ensures every guest enjoys an impeccable experience
                from arrival to departure.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Dress code is strictly enforced to maintain the sophisticated atmosphere. Smart casual
                is required. No athletic wear, flip-flops.
              </p>
              <motion.div
                className="bg-gradient-to-r from-red-600/20 to-red-600/5 border border-red-600/30 rounded-lg p-4 mt-6"
                whileHover={{ boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)' }}
              >
                <p className="text-sm text-gray-300">
                  <span className="font-bold text-red-400">Pro Tip:</span> Arrive early to secure parking and enjoy our pre-event lounge where you can settle in with a welcome cocktail.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
