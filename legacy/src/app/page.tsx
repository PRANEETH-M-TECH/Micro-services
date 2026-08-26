'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Grid, MessageCircle, EyeOff, Utensils, ShoppingBag } from 'lucide-react'

// --- Interactive Problem Card ---
const InteractiveProblemCard = ({ icon, title, shortDesc, chaosVisual }: any) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <motion.div 
      layout
      onClick={() => setIsOpen(!isOpen)}
      className="bg-[#FFFFFF] border border-gray-200 rounded-[24px] p-8 shadow-sm cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
    >
      <motion.div layout className="flex flex-col mb-2">
        {icon}
        <motion.h3 layout className="text-[20px] font-semibold text-[#111827] mt-5 mb-2">{title}</motion.h3>
        {!isOpen && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[14px] text-gray-500 font-medium"
          >
            Click to see the reality →
          </motion.p>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <p className="text-[15px] text-gray-600 leading-[1.6] mb-8">{shortDesc}</p>
            {chaosVisual}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// --- Interactive Solution Card ---
const InteractiveSolutionCard = ({ num, color, textColor, bg, title, desc }: any) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div 
      layout
      onClick={() => setIsOpen(!isOpen)}
      className={`${bg} rounded-[24px] p-10 relative overflow-hidden cursor-pointer transition-all hover:brightness-[0.97] border border-transparent hover:border-black/5 flex flex-col h-full`}
    >
      <motion.div layout className={`text-[96px] font-bold opacity-[0.06] leading-none mb-6 tracking-[-4px] ${color}`}>{num}</motion.div>
      <motion.h3 layout className={`text-2xl md:text-3xl font-semibold mb-2 ${color} pr-8 leading-tight`}>{title}</motion.h3>
      
      {!isOpen && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-[15px] font-medium mt-auto pt-6 opacity-70 ${color}`}
        >
          Click to explore →
        </motion.p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <p className={`text-[16px] leading-[1.6] font-medium ${textColor} opacity-90`}>{desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// --- Full Width Building View ---
const InteractiveBuildingView = () => {
  return (
    <div className="w-full relative bg-[#085041] overflow-hidden">
      <div className="relative w-full h-[600px] md:h-[80vh] min-h-[600px]">
        <img 
          src="/Building.jpg" 
          alt="Apartment Complex" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        
        {/* Callout 1 */}
        <motion.div 
          initial={{ opacity: 0, x: -30, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="absolute top-[25%] left-[5%] md:left-[15%] bg-white shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 z-10"
        >
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
            <Utensils className="w-6 h-6" />
          </div>
          <p className="text-base md:text-lg font-bold text-gray-900 whitespace-nowrap">We sell authentic food</p>
          <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white transform -translate-y-1/2 rotate-45 rounded-sm" />
        </motion.div>

        {/* Callout 2 */}
        <motion.div 
          initial={{ opacity: 0, x: -30, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
          className="absolute top-[60%] left-[8%] md:left-[20%] bg-white shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 z-10"
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-base md:text-lg font-bold text-gray-900 whitespace-nowrap">We sell clothes</p>
          <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white transform -translate-y-1/2 rotate-45 rounded-sm" />
        </motion.div>

        {/* Callout 3 */}
        <motion.div 
          initial={{ opacity: 0, x: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
          className="absolute top-[35%] right-[5%] md:right-[15%] bg-white shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 z-10"
        >
          <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white transform -translate-y-1/2 rotate-45 rounded-sm" />
          <p className="text-base md:text-lg font-bold text-gray-900 whitespace-nowrap">We sell home-made biscuits</p>
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Callout 4 */}
        <motion.div 
          initial={{ opacity: 0, x: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
          className="absolute top-[75%] right-[8%] md:right-[20%] bg-white shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 z-10"
        >
          <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white transform -translate-y-1/2 rotate-45 rounded-sm" />
          <p className="text-base md:text-lg font-bold text-gray-900 whitespace-nowrap">We sell pastries</p>
          <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
            <Utensils className="w-6 h-6" />
          </div>
        </motion.div>

      </div>
    </div>
  )
}

// --- Main Page Component ---
export default function CommunaLanding() {
  const [activeTab, setActiveTab] = useState<'problem' | 'solution'>('problem')

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111827] font-sans selection:bg-[#0F6E56] selection:text-white">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 md:py-6 bg-white/90 backdrop-blur-xl relative z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#0F6E56] rounded-xl flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M2 3C2 2.45 2.45 2 3 2H13C13.55 2 14 2.45 14 3V9C14 9.55 13.55 10 13 10H9L6 14V10H3C2.45 10 2 9.55 2 9V3Z" fill="#9FE1CB"/><rect x="4" y="5" width="2" height="1" rx="0.5" fill="#0F6E56"/><rect x="4" y="7" width="5" height="1" rx="0.5" fill="#0F6E56"/></svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#085041]">communa</span>
        </div>
        <div className="hidden md:flex gap-10">
          <Link href="/services/water-delivery" className="text-[15px] font-medium text-gray-500 hover:text-[#0F6E56] transition-colors">For residents</Link>
          <Link href="/vendor/register" className="text-[15px] font-medium text-gray-500 hover:text-[#0F6E56] transition-colors">For vendors</Link>
          <a href="#" className="text-[15px] font-medium text-gray-500 hover:text-[#0F6E56] transition-colors">About</a>
        </div>
        <button className="bg-[#085041] hover:bg-[#063f33] transition-colors text-[#E1F5EE] px-6 py-3 rounded-xl text-[15px] font-semibold cursor-pointer shadow-lg shadow-[#085041]/20">
          Join waitlist
        </button>
      </nav>

      {/* Hero Section - Gradient Theme */}
      <section className="relative px-6 w-full min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-br from-[#0D1F1A] via-[#085041] to-[#0F6E56] overflow-hidden text-center z-0 py-20 pb-32">
        
        {/* Absolute Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1D9E75] rounded-full blur-[150px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#9FE1CB] rounded-full blur-[180px] opacity-10 pointer-events-none" />

        {/* COMMUNA Fade-in */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
           animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="mb-8"
        >
          <h1 className="text-[72px] sm:text-[100px] md:text-[140px] lg:text-[180px] font-black tracking-[-4px] md:tracking-[-8px] leading-[0.85] text-white drop-shadow-2xl uppercase relative z-10">
            COMMUNA
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl md:text-5xl font-semibold text-[#E1F5EE] mb-8 tracking-[-1px] max-w-5xl z-10"
        >
          Everything you need is already inside your gate.
        </motion.p>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-2xl text-[#9FE1CB] font-light leading-relaxed max-w-3xl mx-auto mb-14 z-10"
        >
          The water uncle, the cooking auntie, the tailor on the third floor. They&apos;re all here. You just couldn&apos;t find them until now.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full max-w-2xl px-4 z-10"
        >
          <Link href="/services/water-delivery" className="bg-white hover:bg-gray-50 text-[#085041] px-8 py-5 rounded-2xl text-[17px] font-bold transition-all shadow-xl w-full sm:w-auto hover:-translate-y-1">
            Explore your society
          </Link>
          <Link href="/admin/vendors" className="bg-transparent hover:bg-white/10 text-white border border-white/30 px-8 py-5 rounded-2xl text-[17px] font-bold transition-all w-full sm:w-auto backdrop-blur-sm hover:-translate-y-1">
            I want to sell
          </Link>
        </motion.div>
      </section>

      {/* Full Width Building Image Component */}
      <InteractiveBuildingView />

      {/* The Transformation: Problem vs Solution */}
      <section className="w-full py-24 md:py-32 px-6 md:px-12 bg-[#F9FAFB] flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-screen-2xl mx-auto flex flex-col items-center">
          
          <div className="text-[13px] font-bold text-[#0F6E56] tracking-[2px] uppercase mb-5 text-center">The Transformation</div>
          <h2 className="text-[40px] md:text-[60px] font-bold text-[#111827] tracking-[-2px] mb-12 leading-tight text-center transition-all duration-300">
            {activeTab === 'problem' ? "Sound familiar?" : "Meet Communa."}
          </h2>

          {/* Toggle Switch */}
          <div className="flex bg-gray-200/60 p-1.5 rounded-full mb-16 relative w-[300px] shadow-inner">
            <button
              onClick={() => setActiveTab('problem')}
              className={`relative z-10 w-1/2 py-3 text-[15px] font-bold rounded-full transition-colors flex items-center justify-center ${
                activeTab === 'problem' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              The Problem
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`relative z-10 w-1/2 py-3 text-[15px] font-bold rounded-full transition-colors flex items-center justify-center ${
                activeTab === 'solution' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              The Solution
            </button>
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-sm border border-gray-100/50"
              initial={false}
              animate={{ x: activeTab === 'problem' ? 0 : '100%' }}
              style={{ left: '6px' }}
            />
          </div>

          <div className="w-full relative min-h-[420px]">
            <AnimatePresence mode="wait">
              {activeTab === 'problem' ? (
                <motion.div
                  key="problem"
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
                >
                  <InteractiveProblemCard 
                    icon={
                      <div className="w-[56px] h-[56px] rounded-[16px] flex items-center justify-center bg-[#FAEEDA] text-[#854F0B]">
                        <Grid className="w-7 h-7" />
                      </div>
                    }
                    title="Paper and pen orders"
                    shortDesc="Rajan writes 47 apartment orders every morning. Sometimes an extra can. Sometimes one missing. Always confusion."
                    chaosVisual={
                      <div className="bg-[#F9FAFB] rounded-[16px] p-5 text-[14px] text-gray-500 border border-gray-100 font-mono">
                        <div className="text-[11px] text-gray-400 mb-4 font-sans tracking-widest font-bold">TODAY&apos;S ORDER SHEET</div>
                        <div className="mb-2">A-101: 2 cans &nbsp;<span className="line-through opacity-50">3?</span></div>
                        <div className="mb-2">B-203: 1 can</div>
                        <div className="text-[#E24B4A] font-bold">C-305: ??? forgot</div>
                      </div>
                    }
                  />

                  <InteractiveProblemCard 
                    icon={
                      <div className="w-[56px] h-[56px] rounded-[16px] flex items-center justify-center bg-[#E1F5EE] text-[#0F6E56]">
                        <MessageCircle className="w-7 h-7" />
                      </div>
                    }
                    title="WhatsApp chaos"
                    shortDesc="200 unread messages. Orders buried between memes and good morning forwards. A missed order means no water tonight."
                    chaosVisual={
                      <div className="bg-[#F9FAFB] rounded-[16px] p-5 text-[14px] text-gray-600 border border-gray-100 space-y-4">
                        <div className="flex gap-3 items-start">
                          <div className="w-6 h-6 rounded-full bg-[#E1F5EE] shrink-0 mt-0.5" />
                          <span className="font-medium">Good morning! 🌞🌞🌞</span>
                        </div>
                        <div className="flex gap-3 items-start">
                          <div className="w-6 h-6 rounded-full bg-[#E1F5EE] shrink-0 mt-0.5" />
                          <span className="font-medium">need 2 cans tmrw</span>
                        </div>
                        <div className="flex gap-3 items-start">
                          <div className="w-6 h-6 rounded-full bg-[#E1F5EE] shrink-0 mt-0.5" />
                          <span className="text-[#E24B4A] font-bold">where is my order??</span>
                        </div>
                      </div>
                    }
                  />

                  <InteractiveProblemCard 
                    icon={
                      <div className="w-[56px] h-[56px] rounded-[16px] flex items-center justify-center bg-[#EEEDFE] text-[#534AB7]">
                        <EyeOff className="w-7 h-7" />
                      </div>
                    }
                    title="Invisible entrepreneurs"
                    shortDesc="The auntie who makes the best biryani. The uncle who does great tailoring. 90% of residents have no idea they even exist."
                    chaosVisual={
                      <div className="bg-[#F9FAFB] rounded-[16px] p-5 text-[14px] text-gray-600 border border-gray-100">
                        <div className="text-[12px] text-gray-400 mb-4 font-sans font-bold uppercase tracking-wider">WhatsApp group · 312 members</div>
                        <div className="text-[#111827] font-medium mb-3">&quot;Anyone know a good tiffin?&quot;</div>
                        <div className="text-[12px] text-gray-400 font-medium">No replies · 3 days ago</div>
                      </div>
                    }
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="solution"
                  initial={{ opacity: 0, scale: 0.98, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 10 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch"
                >
                  <InteractiveSolutionCard 
                    num="01"
                    color="text-[#085041]"
                    textColor="text-[#0F6E56]"
                    bg="bg-[#E1F5EE]"
                    title="Your society, your market"
                    desc="Join your society's private space. Verified residents only. No strangers, no spam — just your community."
                  />
                  <InteractiveSolutionCard 
                    num="02"
                    color="text-[#26215C]"
                    textColor="text-[#3C3489]"
                    bg="bg-[#EEEDFE]"
                    title="Discover who's at your doorstep"
                    desc="Browse every vendor in your society — water, food, clothing, tutors — all neighbours you never knew were selling."
                  />
                  <InteractiveSolutionCard 
                    num="03"
                    color="text-[#4A1B0C]"
                    textColor="text-[#712B13]"
                    bg="bg-[#FAECE7]"
                    title="Order, track, done."
                    desc="Place orders in seconds. No paper ledgers, no WhatsApp chaos. Every delivery tracked, every order confirmed."
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Rest of Landing Page - widened container */}
      <section className="w-full py-32 px-6 md:px-12 bg-[#F9FAFB]">
        <div className="w-full max-w-screen-2xl mx-auto">
          <div className="text-[13px] font-bold text-[#0F6E56] tracking-[2px] uppercase mb-5">Inside your society right now</div>
          <h2 className="text-[40px] md:text-[60px] font-bold text-[#111827] tracking-[-2px] mb-16 leading-tight">Real neighbours.<br/>Real businesses.</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            <div className="bg-[#FFFFFF] border border-gray-200 rounded-[24px] p-8 shadow-sm hover:-translate-y-1 transition-transform cursor-default flex flex-col h-full">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-[17px] font-bold mb-5 bg-[#E1F5EE] text-[#085041] shrink-0">RK</div>
              <h4 className="text-[19px] font-semibold text-[#111827] mb-2">Rajan Water Cans</h4>
              <div className="text-[14px] text-gray-500 mb-6 font-medium">Water delivery · Block A</div>
              <div className="mt-auto flex items-center gap-2.5 text-[14px] font-bold text-[#0F6E56]">
                <span className="w-2.5 h-2.5 bg-[#1D9E75] rounded-full" /> Active today
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-gray-200 rounded-[24px] p-8 shadow-sm hover:-translate-y-1 transition-transform cursor-default flex flex-col h-full">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-[17px] font-bold mb-5 bg-[#EEEDFE] text-[#26215C] shrink-0">MT</div>
              <h4 className="text-[19px] font-semibold text-[#111827] mb-2">Meena&apos;s Tiffin</h4>
              <div className="text-[14px] text-gray-500 mb-6 font-medium">Home food · Block C</div>
              <div className="mt-auto flex items-center gap-2.5 text-[14px] font-bold text-[#0F6E56]">
                <span className="w-2.5 h-2.5 bg-[#1D9E75] rounded-full" /> Taking orders
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-gray-200 rounded-[24px] p-8 shadow-sm hover:-translate-y-1 transition-transform cursor-default flex flex-col h-full">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-[17px] font-bold mb-5 bg-[#FAEEDA] text-[#412402] shrink-0">PS</div>
              <h4 className="text-[19px] font-semibold text-[#111827] mb-2">Priya Tailoring</h4>
              <div className="text-[14px] text-gray-500 mb-6 font-medium">Clothing · Block B</div>
              <div className="mt-auto flex items-center gap-2.5 text-[14px] font-bold text-[#0F6E56]">
                <span className="w-2.5 h-2.5 bg-[#1D9E75] rounded-full" /> Active today
              </div>
            </div>

            <Link href="/vendor/register" className="border-2 border-dashed border-gray-300 rounded-[24px] p-8 flex flex-col items-center justify-center h-full min-h-[200px] cursor-pointer hover:bg-white hover:border-gray-400 hover:shadow-sm transition-all group">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-5 group-hover:border-gray-400 group-hover:bg-gray-50 transition-colors shrink-0">
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M7 2V12M2 7H12" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <p className="text-[15px] text-gray-600 text-center font-bold mt-auto mb-auto">Your business<br/>could be here</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats - Full Width */}
      <section className="w-full py-24 px-6 md:px-12 bg-[#085041]">
        <div className="w-full max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
          <div>
            <div className="text-[64px] md:text-[80px] font-bold text-[#E1F5EE] tracking-[-3px] leading-none mb-4">41%</div>
            <div className="text-[16px] text-[#5DCAA5] font-medium leading-[1.6]">of urban homes have truly reliable tap water in India</div>
          </div>
          <div>
            <div className="text-[64px] md:text-[80px] font-bold text-[#E1F5EE] tracking-[-3px] leading-none mb-4">90%</div>
            <div className="text-[16px] text-[#5DCAA5] font-medium leading-[1.6]">of residents don&apos;t know their society&apos;s local vendors</div>
          </div>
          <div>
            <div className="text-[64px] md:text-[80px] font-bold text-[#E1F5EE] tracking-[-3px] leading-none mb-4">0</div>
            <div className="text-[16px] text-[#5DCAA5] font-medium leading-[1.6]">apps solve this community commerce problem. Until now.</div>
          </div>
          <div>
            <div className="text-[64px] md:text-[80px] font-bold text-[#E1F5EE] tracking-[-3px] leading-none mb-4">1</div>
            <div className="text-[16px] text-[#5DCAA5] font-medium leading-[1.6]">platform. Every vendor. Every order. Your society only.</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-32 md:py-48 px-6 md:px-12 bg-[#0D1F1A] text-center flex flex-col items-center justify-center">
        <h2 className="text-[50px] md:text-[72px] lg:text-[84px] font-bold text-[#E1F5EE] tracking-[-2px] leading-[1.1] mb-8">
          Your society is already<br className="hidden md:block"/> a marketplace.
        </h2>
        <p className="text-[20px] md:text-[24px] text-[#5DCAA5] mb-14 font-medium">Be the first to unlock it.</p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full max-w-md">
          <Link href="/services/water-delivery" className="bg-[#0F6E56] hover:bg-[#1D9E75] text-white px-8 py-5 rounded-[16px] text-[17px] font-bold transition-all w-full sm:w-auto hover:-translate-y-1 shadow-xl">
            I am a resident
          </Link>
          <Link href="/vendor/register" className="bg-white/5 hover:bg-white/10 text-[#9FE1CB] border border-[#1D9E75]/50 hover:border-[#1D9E75] px-8 py-5 rounded-[16px] text-[17px] font-bold transition-all w-full sm:w-auto hover:-translate-y-1 backdrop-blur-sm">
            I want to sell
          </Link>
        </div>
      </section>

    </div>
  )
}
