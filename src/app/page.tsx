'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Droplets, ShoppingBag, Utensils, Grid } from 'lucide-react'

export default function CommunaLanding() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      {/* Dynamic Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white">
        
        {/* Animated Background Image - Simulating a 360 view / pan */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6, scale: [1, 1.05, 1] }}
          transition={{
            opacity: { duration: 1.5, ease: 'easeOut' },
            scale: { duration: 30, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }
          }}
          style={{
            backgroundImage: "url('/Background.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Hero Overlay Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-12">
          <motion.h1 
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 1.0, ease: 'easeOut' }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400 drop-shadow-2xl"
          >
            COMMUNA
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 1.6, ease: 'easeInOut' }}
            className="w-32 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full mb-8 origin-center"
          />
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.0, ease: 'easeOut' }}
            className="text-2xl md:text-3xl font-medium mb-6 text-gray-100"
          >
            &quot;Every home has a business. We help you discover it.&quot;
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.3, ease: 'easeOut' }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light"
          >
            Explore local services, connect with vendors and build the communities.
          </motion.p>

          {/* Primary CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.6, ease: 'easeOut' }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="/services/water-delivery"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] hover:-translate-y-1 transition-all duration-300"
            >
              Get Started with Water Delivery
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-gray-100 font-semibold backdrop-blur-md hover:-translate-y-1 transition-all duration-300"
            >
              Sign in to your community
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services "Fade-In" Block Section */}
      <section className="relative py-24 px-4 bg-white min-h-[80vh] flex flex-col md:flex-row items-center justify-center gap-12 max-w-7xl mx-auto w-full">
        {/* Block View Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 rounded-3xl overflow-hidden shadow-2xl relative aspect-[4/3] group"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: "url('/Building.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold">Your Block</h3>
            <p className="text-sm opacity-80">Discover services right next door.</p>
          </div>
        </motion.div>

        {/* Services Menu */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full md:w-1/2 flex flex-col space-y-6"
        >
          <div className="mb-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Explore Services</h2>
            <p className="text-gray-600">Tap into the network of your community.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Water Delivery (Active Link) */}
            <Link href="/services/water-delivery" className="group">
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl hover:shadow-lg transition-all cursor-pointer h-full flex flex-col justify-between hover:-translate-y-1">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Droplets className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Water Delivery</h3>
                  <p className="text-sm text-gray-600">Order cans, track deliveries</p>
                </div>
              </div>
            </Link>

            {/* Food (Placeholder) */}
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl hover:shadow-lg transition-all cursor-not-allowed h-full flex flex-col justify-between opacity-70">
              <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Utensils className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Food</h3>
                <p className="text-sm text-gray-600">Home-cooked meals (Coming Soon)</p>
              </div>
            </div>

            {/* Clothes (Placeholder) */}
            <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl hover:shadow-lg transition-all cursor-not-allowed h-full flex flex-col justify-between opacity-70">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Clothes</h3>
                <p className="text-sm text-gray-600">Local boutiques (Coming Soon)</p>
              </div>
            </div>

            {/* Other Services (Placeholder) */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl hover:shadow-lg transition-all cursor-not-allowed h-full flex flex-col justify-between opacity-70">
              <div className="bg-gray-200 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Grid className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Other Services</h3>
                <p className="text-sm text-gray-600">Discover more (Coming Soon)</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-black text-white tracking-widest opacity-50">COMMUNA</div>
          <p className="text-sm">&copy; {new Date().getFullYear()} COMMUNA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
