/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewState, CursorState, Project } from '../types';
import { audioEngine } from '../utils/audio';
import { 
  ArrowRight, 
  Sparkles, 
  Orbit, 
  Cpu, 
  Laptop, 
  Smartphone, 
  Palette, 
  Layers, 
  Globe, 
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { projectsData } from '../data';

interface LandingHeroProps {
  onNavigate: (view: ViewState) => void;
  onSelectProject: (project: Project) => void;
  selectedMode: 'fluid' | 'strings' | 'gravity';
  onModeChange: (mode: 'fluid' | 'strings' | 'gravity') => void;
  setCursor: (state: CursorState) => void;
  darkMode: boolean;
}

export default function LandingHero({
  onNavigate,
  onSelectProject,
  selectedMode,
  onModeChange,
  setCursor,
  darkMode,
}: LandingHeroProps) {

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Website Development',
    message: ''
  });

  const handleHoverElement = (e: React.MouseEvent, type: CursorState['type'] = 'magnetic', text?: string) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width;
    audioEngine.triggerHover(normalizedX);
    setCursor({ type, text });
  };

  const handleNavigate = (view: ViewState) => {
    audioEngine.triggerTransition();
    onNavigate(view);
  };

  const cycleMode = () => {
    audioEngine.triggerClick();
    if (selectedMode === 'fluid') onModeChange('strings');
    else if (selectedMode === 'strings') onModeChange('gravity');
    else onModeChange('fluid');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.triggerClick();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', service: 'Website Development', message: '' });
    }, 4000);
  };

  const services = [
    {
      icon: <Laptop className="text-accent-rose" size={24} />,
      title: "Web Design & Development",
      description: "We build premium, lightning-fast custom websites designed to load instantly and turn your visitors into customers."
    },
    {
      icon: <Smartphone className="text-accent-rose" size={24} />,
      title: "Mobile App Development",
      description: "Stunning iOS and Android mobile apps crafted with fluid screen transitions, offline support, and natural touch gestures."
    },
    {
      icon: <Palette className="text-accent-rose" size={24} />,
      title: "Brand Identity Design",
      description: "Cohesive brand systems including custom logos, typography standards, and visual layouts that make your brand stand out."
    },
    {
      icon: <Layers className="text-accent-rose" size={24} />,
      title: "UI/UX Experience Design",
      description: "User-friendly digital interfaces designed with extreme care, making complex digital tasks feel simple and effortless."
    },
    {
      icon: <Globe className="text-accent-rose" size={24} />,
      title: "Digital Growth & Marketing",
      description: "SEO-optimized campaign landing pages and analytics integrations designed to scale your customer reach."
    }
  ];

  return (
    <div className="w-full flex flex-col relative z-10">
      
      {/* 1. HERO FOLD */}
      <div id="landing-hero-overlay" className="min-h-screen w-full flex flex-col justify-between p-6 sm:p-12 md:p-16 select-none relative custom-gradient">
        
        {/* Side Info / Vertical Coordinate Rails */}
        <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-32 z-20 pointer-events-none">
          <div className={`vertical-text text-[10px] uppercase tracking-[0.5em] font-mono ${darkMode ? 'text-white/30' : 'text-bg-dark/40'}`}>
            ESTABLISHED / 2026
          </div>
          <div className={`vertical-text text-[10px] uppercase tracking-[0.5em] font-mono ${darkMode ? 'text-white/30' : 'text-bg-dark/40'}`}>
            BERLIN / TOKYO / NYC
          </div>
        </div>

        {/* Floating Project Preview Card (Top Right) */}
        <div 
          onClick={() => onSelectProject(projectsData[0])}
          onMouseEnter={(e) => handleHoverElement(e, 'view', 'OPEN')}
          onMouseLeave={() => setCursor({ type: 'default' })}
          className={`absolute top-28 right-8 xl:right-16 w-52 h-72 border p-4 backdrop-blur-md hidden lg:flex flex-col justify-between gap-4 group cursor-none transition-all duration-500 z-20 ${
            darkMode 
              ? 'bg-white/5 border-white/10 hover:bg-white/10' 
              : 'bg-black/5 border-black/10 hover:bg-black/10'
          }`}
        >
          <div className="w-full h-full bg-cover bg-center mb-2 overflow-hidden filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: `url(${projectsData[0].heroImage})` }}>
            <div className="w-full h-full bg-rose-950/20 mix-blend-color-burn" />
          </div>
          <div>
            <p className="text-[9px] uppercase opacity-40 tracking-[0.2em] font-mono mb-1">Featured Active Project</p>
            <p className={`text-sm font-bold tracking-tight font-sans uppercase group-hover:text-accent-rose transition-colors ${darkMode ? 'text-white' : 'text-bg-dark'}`}>{projectsData[0].title}</p>
            <p className={`text-[10px] opacity-60 font-mono ${darkMode ? 'text-white/60' : 'text-bg-dark/60'}`}>{projectsData[0].category}</p>
          </div>
        </div>

        {/* Top Margined Agency Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-left font-mono text-[9px] opacity-40 uppercase tracking-wider">
          <div className="flex flex-col">
            <span>AGENCY HUB</span>
            <span className="font-bold text-accent-rose">BERLIN / TOKYO / NYC</span>
          </div>
          <div className="flex flex-col">
            <span>CORE FOCUS</span>
            <span className={`font-bold ${darkMode ? 'text-white' : 'text-bg-dark'}`}>WEBSITES + MOBILE APPS</span>
          </div>
          <div className="flex flex-col">
            <span>DESIGN FOCUS</span>
            <span className={`font-bold uppercase ${darkMode ? 'text-accent-lime' : 'text-emerald-700'}`}>BRANDING + UI/UX</span>
          </div>
          <div className="flex flex-col text-right">
            <span>AVAILABILITY</span>
            <span className={`font-bold uppercase ${darkMode ? 'text-accent-violet' : 'text-violet-700'}`}>BOOKING FOR Q4 2026</span>
          </div>
        </div>

        {/* Central Typographic Massive Display Stack */}
        <div className="flex flex-col items-start my-auto max-w-5xl py-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
            className="flex flex-col w-full"
          >
            <span className="font-mono text-xs text-accent-rose font-bold uppercase tracking-widest mb-2">
              // QOLAB CREATIVE DIGITAL AGENCY
            </span>
            
            <h1 className="text-massive font-black uppercase tracking-tighter leading-none flex flex-col select-none">
              <span 
                className={`${darkMode ? 'text-outline hover:text-white' : 'text-outline-light hover:text-bg-dark'} transition-all duration-700 ease-out`} 
                style={darkMode ? { WebkitTextStroke: '1px rgba(255,255,255,0.45)' } : { WebkitTextStroke: '1px rgba(8,8,8,0.45)' }}
              >
                AESTHETICS
              </span>
              <span className={`${darkMode ? 'text-white' : 'text-bg-dark'} hover:text-accent-rose transition-colors duration-500`}>
                IN MOTION
              </span>
              <span 
                className={`${darkMode ? 'text-outline hover:text-white' : 'text-outline-light hover:text-bg-dark'} transition-all duration-700 ease-out`} 
                style={darkMode ? { WebkitTextStroke: '1px rgba(255,255,255,0.45)' } : { WebkitTextStroke: '1px rgba(8,8,8,0.45)' }}
              >
                & RESONANCE
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8 w-full border-t border-white/5 pt-6"
          >
            <p className="md:col-span-8 font-sans font-normal text-lg sm:text-xl uppercase tracking-tight leading-relaxed max-w-3xl">
              "WE ARE QOLAB. WE DESIGN AND BUILD EXCEPTIONAL WEBSITES, MOBILE APPLICATIONS, BRAND SYSTEMS, AND UI/UX EXPERIENCES POWERED BY RADICAL INTERACTION DESIGN."
            </p>

            <div className="md:col-span-4 flex flex-col justify-end gap-4 md:items-end">
              <div className="flex flex-wrap gap-3 md:justify-end">
                {/* Button: Explore the Portfolio */}
                <button
                  onClick={() => handleNavigate('archive')}
                  onMouseEnter={(e) => handleHoverElement(e, 'view', 'VIEW')}
                  onMouseLeave={() => setCursor({ type: 'default' })}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent-rose text-white font-mono text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-none animate-pulse"
                >
                  SEE OUR WORK
                  <ArrowRight size={14} />
                </button>

                {/* Button: Contact us */}
                <button
                  onClick={() => handleNavigate('contact')}
                  onMouseEnter={(e) => handleHoverElement(e, 'hover', 'HELLO')}
                  onMouseLeave={() => setCursor({ type: 'default' })}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-full border font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-none ${
                    darkMode 
                      ? 'border-white/10 hover:border-white/30 text-white bg-white/5' 
                      : 'border-bg-dark/10 hover:border-bg-dark/30 text-bg-dark bg-bg-dark/5'
                  }`}
                >
                  TALK TO US
                  <Sparkles size={14} className="text-accent-rose animate-pulse" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Layout Controller Cue */}
        <div className={`flex flex-col sm:flex-row items-center justify-between border-t pt-6 gap-4 w-full ${
          darkMode ? 'border-white/5' : 'border-bg-dark/10'
        }`}>
          {/* Simple Interactive Cue */}
          <div
            onMouseEnter={(e) => handleHoverElement(e, 'drag', 'GRAB')}
            onMouseLeave={() => setCursor({ type: 'default' })}
            className="flex items-center gap-3 font-mono text-[10px] tracking-wider uppercase opacity-55 hover:opacity-100 transition-opacity duration-300"
          >
            <Orbit size={16} className="text-accent-rose animate-spin-slow" />
            <span>DRAG THE CURSOR TO INTERACT WITH OUR BACKDROP</span>
          </div>

          {/* Dynamic backdrop style switcher with clear English names */}
          <button
            onClick={cycleMode}
            onMouseEnter={(e) => handleHoverElement(e, 'hover')}
            onMouseLeave={() => setCursor({ type: 'default' })}
            className={`flex items-center gap-2.5 px-4.5 py-2 rounded-full border font-mono text-[10px] font-bold uppercase tracking-widest shadow-md cursor-none ${
              darkMode 
                ? 'bg-white/3 border-white/5 hover:border-white/20 text-white' 
                : 'bg-black/5 border-black/10 hover:border-black/15 text-bg-dark'
            }`}
          >
            <Cpu size={12} className="text-accent-rose" />
            BACKDROP STYLE: <span className="text-accent-rose">{
              selectedMode === 'fluid' ? 'ETH_FLOW' : selectedMode === 'strings' ? 'NET_WEB' : 'PARTICLES'
            }</span>
          </button>
        </div>
      </div>

      {/* 2. SERVICES SECTION */}
      <section id="services-section" className={`py-24 px-6 sm:px-12 md:px-16 border-t ${darkMode ? 'border-white/5 bg-[#0a0a0b]' : 'border-bg-dark/5 bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="font-mono text-xs text-accent-rose font-bold uppercase tracking-widest block mb-3">// WHAT WE DO BEST</span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-none mb-4">
              OUR CORE SERVICES
            </h2>
            <p className="font-sans text-base sm:text-lg opacity-60 max-w-2xl uppercase">
              Simple, powerful digital products. We build websites, apps, and brands that help your business capture attention and drive growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <div 
                key={i}
                onMouseEnter={(e) => handleHoverElement(e, 'hover', 'AGENCY')}
                onMouseLeave={() => setCursor({ type: 'default' })}
                className={`p-8 rounded-lg border backdrop-blur-sm flex flex-col justify-between min-h-[240px] hover:scale-[1.02] transition-all duration-300 cursor-none ${
                  darkMode ? 'bg-white/2 hover:bg-white/5 border-white/10' : 'bg-black/2 hover:bg-black/5 border-black/10'
                }`}
              >
                <div className="mb-6 flex justify-between items-start">
                  <div className="p-3 bg-accent-rose/10 rounded-lg">
                    {svc.icon}
                  </div>
                  <span className="font-mono text-xs opacity-20">0{i+1} // SERV</span>
                </div>
                <div>
                  <h3 className="font-display font-black text-xl tracking-tight uppercase mb-2">
                    {svc.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm opacity-60 leading-relaxed uppercase">
                    {svc.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. RECENT WORK SHOWCASE SECTION */}
      <section id="recent-work-section" className="py-24 px-6 sm:px-12 md:px-16 border-t border-white/5 relative bg-[#080808]/90">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6">
            <div>
              <span className="font-mono text-xs text-accent-rose font-bold uppercase tracking-widest block mb-3">// CLIENT SUCCESS</span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-none text-white">
                SELECTED PORTFOLIO
              </h2>
            </div>
            <button 
              onClick={() => handleNavigate('archive')}
              onMouseEnter={(e) => handleHoverElement(e, 'view', 'OPEN')}
              onMouseLeave={() => setCursor({ type: 'default' })}
              className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-accent-rose border-b border-accent-rose/35 pb-1 cursor-none hover:opacity-80 transition-opacity"
            >
              VIEW ALL {projectsData.length} PROJECTS
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projectsData.slice(0, 2).map((project) => (
              <div 
                key={project.id}
                onClick={() => onSelectProject(project)}
                onMouseEnter={(e) => handleHoverElement(e, 'view', 'VIEW')}
                onMouseLeave={() => setCursor({ type: 'default' })}
                className="group cursor-none border p-5 bg-white/2 backdrop-blur-md rounded-lg flex flex-col justify-between gap-6 hover:bg-white/5 transition-all duration-500 border-white/10"
              >
                <div className="w-full h-80 rounded overflow-hidden relative filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700">
                  <img 
                    src={project.heroImage} 
                    alt={project.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-rose-950/20 mix-blend-color-burn" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="font-mono text-[10px] text-accent-rose uppercase font-bold tracking-widest">{project.category}</span>
                    <h3 className="font-display font-black text-2xl tracking-tighter uppercase text-white mt-1 group-hover:text-accent-rose transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SIMPLIFIED EDITORIAL ABOUT SECTION */}
      <section id="about-section" className={`py-24 px-6 sm:px-12 md:px-16 border-t ${darkMode ? 'border-white/5 bg-[#0a0a0b]' : 'border-bg-dark/5 bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs text-accent-rose font-bold uppercase tracking-widest block mb-3">// WHO WE ARE</span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-none mb-6">
              WE ARE QOLAB DIGITAL.
            </h2>
            <p className={`font-sans text-lg sm:text-xl font-medium uppercase tracking-tight leading-relaxed mb-6 ${darkMode ? 'text-white/90' : 'text-bg-dark/90'}`}>
              "We partner with businesses to build high-end websites, powerful mobile apps, and bold visual brands. We reject standard designs and complex technical jargon to give you clean, understandable, and high-converting products."
            </p>
            <p className="font-sans text-sm sm:text-base opacity-60 leading-relaxed uppercase mb-8">
              Based globally, we operate with a completely unified design and engineering pipeline. We do not use bloated templates or outsource our work. Every element we build is handcrafted, tested, and optimized for maximum speed and conversions.
            </p>
            <div className="flex gap-12 font-mono text-xs opacity-50 uppercase">
              <div>
                <span className="text-accent-rose font-bold text-lg block">100%</span>
                <span>HANDCRAFTED CODE</span>
              </div>
              <div>
                <span className="text-accent-rose font-bold text-lg block">2.4x</span>
                <span>AVERAGE VISITOR GROWTH</span>
              </div>
              <div>
                <span className="text-accent-rose font-bold text-lg block">10+</span>
                <span>GLOBAL AWARDS</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className={`relative w-80 h-96 border p-4 backdrop-blur-md flex flex-col justify-between ${
              darkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
            }`}>
              <div className="w-full h-full bg-[#111] overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" 
                  alt="QOLAB Workspace"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-[10px] uppercase opacity-40 tracking-widest font-mono">AGENCY ESSENCE</p>
                <p className={`text-sm font-bold uppercase ${darkMode ? 'text-white' : 'text-bg-dark'}`}>QOLAB STUDIO // DESIGN IN ACTION</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DIRECT CONTACT FORM */}
      <section id="contact-form-section" className="py-24 px-6 sm:px-12 md:px-16 border-t border-white/5 bg-[#080808]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-accent-rose font-bold uppercase tracking-widest block mb-3">// START YOUR PROJECT</span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-none mb-4 text-white">
              LET'S CO-BUILD SOMETHING GRAND
            </h2>
            <p className="font-sans text-sm sm:text-base text-zinc-400 uppercase max-w-lg mx-auto">
              Fill out this quick 1-minute form, and we'll get back to you with an actual strategy proposal within 24 hours. No sales spam. Guaranteed.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {formSubmitted ? (
              <motion.div 
                key="form-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="hairline-border p-12 bg-accent-lime/5 border-accent-lime rounded-lg text-center flex flex-col items-center justify-center gap-4"
              >
                <div className="p-4 bg-accent-lime/15 text-accent-lime rounded-full">
                  <CheckCircle2 size={40} className="animate-bounce" />
                </div>
                <h3 className="font-display font-black text-2xl text-accent-lime uppercase tracking-tight">
                  SIGNAL RECEIVED SUCCESSFULLY!
                </h3>
                <p className="font-sans text-sm uppercase opacity-70 max-w-md">
                  Thank you, {formData.name || 'Friend'}. Your request for <strong>{formData.service}</strong> has reached our primary queue. We will contact you at <strong>{formData.email}</strong> soon!
                </p>
              </motion.div>
            ) : (
              <motion.form 
                key="form-fields"
                onSubmit={handleFormSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-8 font-mono"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="user-name-input" className="text-[10px] uppercase text-white/50 tracking-widest font-bold">YOUR NAME</label>
                    <input 
                      id="user-name-input"
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white/3 border border-white/10 rounded-lg py-3.5 px-4 text-white text-sm focus:border-accent-rose focus:bg-white/5 transition-all duration-300 outline-none cursor-none"
                      onMouseEnter={(e) => handleHoverElement(e, 'hover', 'WRITE')}
                      onMouseLeave={() => setCursor({ type: 'default' })}
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="user-email-input" className="text-[10px] uppercase text-white/50 tracking-widest font-bold">YOUR EMAIL ADDRESS</label>
                    <input 
                      id="user-email-input"
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="e.g. john@yourcompany.com"
                      className="w-full bg-white/3 border border-white/10 rounded-lg py-3.5 px-4 text-white text-sm focus:border-accent-rose focus:bg-white/5 transition-all duration-300 outline-none cursor-none"
                      onMouseEnter={(e) => handleHoverElement(e, 'hover', 'WRITE')}
                      onMouseLeave={() => setCursor({ type: 'default' })}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="service-select" className="text-[10px] uppercase text-white/50 tracking-widest font-bold">WHAT DO YOU NEED HELP WITH?</label>
                  <select 
                    id="service-select"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full bg-white/3 border border-white/10 rounded-lg py-3.5 px-4 text-white text-sm focus:border-accent-rose focus:bg-white/5 transition-all duration-300 outline-none cursor-none appearance-none"
                    onMouseEnter={(e) => handleHoverElement(e, 'hover', 'SELECT')}
                    onMouseLeave={() => setCursor({ type: 'default' })}
                  >
                    <option value="Website Development" className="bg-[#0c0c0d] text-white">Website Development</option>
                    <option value="Mobile App Development" className="bg-[#0c0c0d] text-white">Mobile App Development</option>
                    <option value="Brand Identity Design" className="bg-[#0c0c0d] text-white">Brand Identity Design</option>
                    <option value="UI/UX Experience Design" className="bg-[#0c0c0d] text-white">UI/UX Experience Design</option>
                    <option value="Complete Digital Strategy" className="bg-[#0c0c0d] text-white">Complete Digital Strategy</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="project-message" className="text-[10px] uppercase text-white/50 tracking-widest font-bold">TELL US ABOUT YOUR PROJECT GOALS</label>
                  <textarea 
                    id="project-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Briefly describe what you're looking to build, your timeline, or any specific goals."
                    className="w-full bg-white/3 border border-white/10 rounded-lg py-3.5 px-4 text-white text-sm focus:border-accent-rose focus:bg-white/5 transition-all duration-300 outline-none cursor-none resize-none"
                    onMouseEnter={(e) => handleHoverElement(e, 'hover', 'WRITE')}
                    onMouseLeave={() => setCursor({ type: 'default' })}
                  />
                </div>

                <button 
                  type="submit"
                  onMouseEnter={(e) => handleHoverElement(e, 'magnetic', 'SEND')}
                  onMouseLeave={() => setCursor({ type: 'default' })}
                  className="w-full sm:w-auto self-start flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-accent-rose text-white text-xs font-bold uppercase tracking-widest transition-transform duration-300 hover:scale-105 active:scale-95 cursor-none"
                >
                  SUBMIT REQUEST
                  <ArrowRight size={14} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

    </div>
  );
}
