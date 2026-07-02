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
}

export default function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const detailRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project]);

  // GSAP Animations
  useEffect(() => {
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
    }, detailRef);

    return () => ctx.revert();
  }, [project]);

  return (
    <div ref={detailRef} className="w-full text-[#1a1a1a] pt-32 pb-24 px-6 sm:px-12 md:px-16 overflow-hidden">
      {/* Back Button & Top Navigation Breadcrumb */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-[#108a93] hover:text-[#159da8] transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Work</span>
        </button>
        <span className="text-xs font-mono uppercase tracking-widest text-black/40">
          Case Study / {project.year}
        </span>
      </div>

      {/* Main Intro Headers */}
      <div className="max-w-6xl mx-auto text-left mb-16">
        <div className="overflow-hidden">
          <span className="detail-title-word text-[#108a93] font-mono text-xs uppercase tracking-widest block mb-4 font-bold">
            // {project.category}
          </span>
        </div>
        <h1 className="font-display text-5xl sm:text-7xl md:text-[6rem] tracking-tight leading-[0.95] text-black">
          <span className="detail-title-word inline-block font-semibold mr-4">{project.title.split(' ')[0]}</span>
          {project.title.split(' ').slice(1).map((word, i) => (
            <span key={i} className="detail-title-word inline-block italic font-light text-black/80 mr-4">{word}</span>
          ))}
        </h1>
        <p className="font-sans text-lg sm:text-2xl text-gray-600 mt-6 max-w-3xl leading-relaxed">
          {project.subtitle}
        </p>
      </div>

      {/* Hero Visual Section */}
      <div className="hero-image-wrapper max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden shadow-xl aspect-video relative mb-20 bg-gray-100">
        <img
          src={project.heroImage}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
      </div>

      {/* Case Details Metric Row */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 border-b border-black/10 mb-20">
        <div className="metric-item flex flex-col">
          <span className="font-mono text-xs text-black/40 uppercase tracking-wider mb-2">Role</span>
          <span className="font-sans text-sm font-semibold text-gray-800 leading-snug">{project.role}</span>
        </div>
        <div className="metric-item flex flex-col">
          <span className="font-mono text-xs text-black/40 uppercase tracking-wider mb-2">Client</span>
          <span className="font-sans text-sm font-semibold text-gray-800 leading-snug">{project.client}</span>
        </div>
        <div className="metric-item flex flex-col">
          <span className="font-mono text-xs text-black/40 uppercase tracking-wider mb-2">Sector</span>
          <span className="font-sans text-sm font-semibold text-gray-800 leading-snug">{project.category}</span>
        </div>
        <div className="metric-item flex flex-col">
          <span className="font-mono text-xs text-black/40 uppercase tracking-wider mb-2">Year</span>
          <span className="font-sans text-sm font-semibold text-gray-800 leading-snug">{project.year}</span>
        </div>
      </div>

      {/* Narrative Section (Synopsis & Challenges) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24">
        {/* Left Side: Overview & Brief */}
        <div className="detail-section lg:col-span-5 flex flex-col">
          <h3 className="font-display text-4xl text-black font-semibold italic mb-6">
            The Synopsis
          </h3>
          <p className="font-sans text-base sm:text-lg text-gray-600 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-col gap-4 mt-8 border-t border-black/5 pt-8">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-[#108a93]" />
              <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">Fast Iterative Prototyping</span>
            </div>
            <div className="flex items-center gap-3">
              <Award size={18} className="text-[#108a93]" />
              <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">High conversion focus</span>
            </div>
          </div>
        </div>

        {/* Right Side: Challenge & Solution Cards */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Challenge Box */}
          <div className="detail-section bg-white border border-black/5 rounded-[2rem] p-8 sm:p-10 shadow-sm relative overflow-hidden">
            <span className="absolute top-4 right-4 font-mono text-[10px] text-black/20 uppercase font-semibold">Challenge</span>
            <h4 className="font-display text-2xl text-black font-semibold italic mb-4">
              The Objective
            </h4>
            <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed">
              {project.challenge}
            </p>
          </div>

          {/* Solution Box */}
          <div className="detail-section bg-[#e6f3f0] rounded-[2rem] p-8 sm:p-10 shadow-sm relative overflow-hidden">
            <span className="absolute top-4 right-4 font-mono text-[10px] text-[#3a863f]/30 uppercase font-semibold">Solution</span>
            <h4 className="font-display text-2xl text-black font-semibold italic mb-4">
              Our Approach
            </h4>
            <p className="font-sans text-sm sm:text-base text-gray-700 leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>
      </div>

      {/* CORE IMPACT / METRICS */}
      <div className="detail-section max-w-6xl mx-auto py-16 border-t border-black/10 mb-20">
        <h3 className="font-display text-4xl text-black text-center font-semibold italic mb-12">
          Measurable Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {project.results.map((result, idx) => (
            <div key={idx} className="bg-white border border-black/5 p-8 rounded-[2rem] shadow-sm flex flex-col justify-between aspect-square md:aspect-auto md:min-h-[220px]">
              <div className="w-10 h-10 rounded-full bg-[#108a93]/10 flex items-center justify-center">
                <CheckCircle size={18} className="text-[#108a93]" />
              </div>
              <div>
                <span className="font-mono text-xs text-black/40 block mb-1">Metric // 0{idx + 1}</span>
                <p className="font-sans text-sm sm:text-base font-semibold text-gray-800 leading-snug">
                  {result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Compilation Gallery */}
      <div className="detail-section max-w-6xl mx-auto py-12 border-t border-black/10 mb-20">
        <h3 className="font-display text-4xl text-black font-semibold italic mb-10">
          Visual Artifacts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {project.galleryImages.map((img, idx) => (
            <div key={idx} className="aspect-square rounded-[2rem] overflow-hidden shadow-md bg-gray-50 border border-black/5 group cursor-zoom-in">
              <img
                src={img}
                alt={`Gallery visual ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Case Footer Trigger */}
      <div className="detail-section max-w-6xl mx-auto border-t border-black/10 pt-16 flex flex-col items-center justify-center gap-4">
        <span className="font-mono text-xs text-black/40 uppercase tracking-widest">
          Finished reading?
        </span>
        <button
          onClick={onBack}
          className="font-display text-4xl sm:text-5xl italic font-semibold text-black hover:text-[#108a93] flex items-center gap-2 group transition-all duration-300"
        >
          <span>Return to work</span>
          <ChevronRight size={32} className="group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

