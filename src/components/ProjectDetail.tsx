import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { ArrowLeft, Clock, Award, CheckCircle, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onNavigateToContact?: () => void;
}

export default function ProjectDetail({ project, onBack, onNavigateToContact }: ProjectDetailProps) {
  const detailRef = useRef<HTMLDivElement>(null);
  const isPortrait = project.galleryLayout === 'portrait';

  // Reset scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project]);

  // GSAP Animations
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      // 1. Text reveals
      gsap.from('.detail-title-word', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
      });

      // 2. Metrics items fade in
      gsap.from('.metric-item', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3,
      });

      // 3. Image parallax/reveal
      gsap.from('.hero-image-wrapper', {
        clipPath: 'inset(10% 10% 10% 10% rounded 40px)',
        duration: 1.4,
        ease: 'power4.inOut',
      });

      // 4. Section headers scroll animations
      const sections = gsap.utils.toArray('.detail-section');
      sections.forEach((section: any) => {
        gsap.from(section, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          }
        });
      });

      // 5. Gallery artifacts — clip-reveal on view
      gsap.utils.toArray('.artifact-item').forEach((el: any, i: number) => {
        gsap.from(el, {
          y: 70,
          opacity: 0,
          clipPath: 'inset(14% 14% 14% 14% round 32px)',
          duration: 1.1,
          ease: 'power3.out',
          delay: (i % 2) * 0.12,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });
    }, detailRef);

    return () => ctx.revert();
  }, [project]);

  return (
    <div ref={detailRef} className="w-full text-gray-300 pt-32 pb-24 px-6 sm:px-12 md:px-16 overflow-hidden">
      {/* Back Button & Top Navigation Breadcrumb */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-[#6ee05a] hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Work</span>
        </button>
        <span className="text-xs font-mono uppercase tracking-widest text-white/40">
          Case Study / {project.year}
        </span>
      </div>

      {/* Main Intro Headers */}
      <div className="max-w-6xl mx-auto text-left mb-16">
        <div className="overflow-hidden">
          <span className="detail-title-word text-[#6ee05a] font-mono text-xs uppercase tracking-widest block mb-4 font-bold">
            // {project.category}
          </span>
        </div>
        <h1 className="font-display text-5xl sm:text-7xl md:text-[6rem] tracking-tight leading-[0.95] text-white">
          <span className="detail-title-word inline-block font-semibold mr-4">{project.title.split(' ')[0]}</span>
          {project.title.split(' ').slice(1).map((word, i) => (
            <span key={i} className="detail-title-word inline-block font-light text-white/60 mr-4">{word}</span>
          ))}
        </h1>
        <p className="font-display text-lg sm:text-2xl text-gray-400 mt-6 max-w-3xl leading-relaxed">
          {project.subtitle}
        </p>
      </div>

      {/* Hero Visual Section */}
      <div className="hero-image-wrapper max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden shadow-xl aspect-video relative mb-20 bg-white/[0.05]">
        <img
          src={project.heroImage}
          alt={project.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover scale-105 ${isPortrait ? 'object-[center_35%]' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
      </div>

      {/* Case Details Metric Row */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 border-b border-white/10 mb-20">
        <div className="metric-item flex flex-col">
          <span className="font-mono text-xs text-white/40 uppercase tracking-wider mb-2">Role</span>
          <span className="font-display text-sm font-semibold text-gray-200 leading-snug">{project.role}</span>
        </div>
        <div className="metric-item flex flex-col">
          <span className="font-mono text-xs text-white/40 uppercase tracking-wider mb-2">Client</span>
          <span className="font-display text-sm font-semibold text-gray-200 leading-snug">{project.client}</span>
        </div>
        <div className="metric-item flex flex-col">
          <span className="font-mono text-xs text-white/40 uppercase tracking-wider mb-2">Sector</span>
          <span className="font-display text-sm font-semibold text-gray-200 leading-snug">{project.category}</span>
        </div>
        <div className="metric-item flex flex-col">
          <span className="font-mono text-xs text-white/40 uppercase tracking-wider mb-2">Year</span>
          <span className="font-display text-sm font-semibold text-gray-200 leading-snug">{project.year}</span>
        </div>
      </div>

      {/* Narrative Section (Synopsis & Challenges) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24">
        {/* Left Side: Overview & Brief */}
        <div className="detail-section lg:col-span-5 flex flex-col">
          <h3 className="font-display font-normal tracking-tight text-4xl text-white mb-6">
            The Synopsis
          </h3>
          <p className="font-display text-base sm:text-lg text-gray-400 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-col gap-4 mt-8 border-t border-white/10 pt-8">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-[#6ee05a]" />
              <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">Fast Iterative Prototyping</span>
            </div>
            <div className="flex items-center gap-3">
              <Award size={18} className="text-[#6ee05a]" />
              <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">High conversion focus</span>
            </div>
          </div>
        </div>

        {/* Right Side: Challenge & Solution Cards */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Challenge Box */}
          <div className="detail-section lime-card bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-sm relative overflow-hidden">
            <span className="absolute top-4 right-4 font-mono text-[10px] text-white/20 uppercase font-semibold">Challenge</span>
            <h4 className="font-display font-normal tracking-tight text-2xl text-white mb-4">
              The Objective
            </h4>
            <p className="font-display text-sm sm:text-base text-gray-400 leading-relaxed">
              {project.challenge}
            </p>
          </div>

          {/* Solution Box */}
          <div className="detail-section bg-[#6ee05a]/10 border border-[#6ee05a]/25 rounded-[2rem] p-8 sm:p-10 relative overflow-hidden">
            <span className="absolute top-4 right-4 font-mono text-[10px] text-[#6ee05a]/70 uppercase font-semibold">Solution</span>
            <h4 className="font-display font-normal tracking-tight text-2xl text-white mb-4">
              Our Approach
            </h4>
            <p className="font-display text-sm sm:text-base text-gray-300 leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>
      </div>

      {/* CORE IMPACT / METRICS */}
      <div className="detail-section max-w-6xl mx-auto py-16 border-t border-white/10 mb-20">
        <h3 className="font-display font-normal tracking-tight text-4xl text-white text-center mb-12">
          Measurable Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {project.results.map((result, idx) => (
            <div key={idx} className="lime-card bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] flex flex-col justify-between aspect-square md:aspect-auto md:min-h-[220px]">
              <div className="w-10 h-10 rounded-full bg-[#6ee05a]/10 flex items-center justify-center">
                <CheckCircle size={18} className="text-[#6ee05a]" />
              </div>
              <div>
                <span className="font-mono text-xs text-white/40 block mb-1">Metric // 0{idx + 1}</span>
                <p className="font-display text-sm sm:text-base font-semibold text-gray-200 leading-snug">
                  {result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Compilation Gallery */}
      <div className="detail-section max-w-6xl mx-auto py-12 border-t border-white/10 mb-20">
        <p className="font-mono text-xs text-[#6ee05a] uppercase tracking-widest mb-4">
          // {project.title} — in the world
        </p>
        <h3 className="font-display font-normal tracking-tight text-4xl text-white mb-10">
          Visual Artifacts
        </h3>
        <div className={isPortrait ? 'grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6' : 'grid grid-cols-1 sm:grid-cols-2 gap-6'}>
          {project.galleryImages.map((img, idx) => (
            <div
              key={idx}
              className={`artifact-item relative rounded-[2rem] overflow-hidden shadow-md bg-white/[0.05] border border-white/10 group cursor-zoom-in ${
                isPortrait
                  ? `aspect-[4/5] ${idx % 3 === 1 ? 'md:mt-10' : ''}`
                  : idx === 0
                    ? 'aspect-[16/9] sm:col-span-2'
                    : 'aspect-[3/2]'
              }`}
            >
              <img
                src={img}
                alt={`${project.title} artifact ${idx + 1}`}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <span className="absolute bottom-5 left-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                Artifact // {String(idx + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Case Footer Trigger */}
      <div className="detail-section max-w-6xl mx-auto border-t border-white/10 pt-16 flex flex-col items-center justify-center gap-4">
        <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
          Finished reading?
        </span>
        <button
          onClick={onBack}
          className="font-display font-normal tracking-tight text-4xl sm:text-5xl text-white hover:text-[#6ee05a] flex items-center gap-2 group transition-all duration-300"
        >
          <span>Return to work</span>
          <ChevronRight size={32} className="group-hover:translate-x-1.5 transition-transform" />
        </button>
        {onNavigateToContact && (
          <button
            onClick={onNavigateToContact}
            className="mt-6 inline-flex items-center gap-2 lime-grad font-display font-semibold py-3.5 px-8 rounded-full transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95 shadow-md text-sm"
          >
            Let's make it exist.
          </button>
        )}
      </div>
    </div>
  );
}

