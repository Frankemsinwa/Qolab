import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import heroImg1 from '../assets/hero-imgs/hero-1.jpg';
import heroImg7 from '../assets/hero-imgs/hero-7.jpg';

interface AboutPageProps {
  onBack: () => void;
  onNavigateToContact?: () => void;
}

export default function AboutPage({ onBack, onNavigateToContact }: AboutPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.about-reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const values = [
    {
      title: 'Craft',
      description: 'Every pixel, every line of code is deliberate. We obsess over the details that most people never notice — because that\'s what separates good from exceptional.',
    },
    {
      title: 'Curiosity',
      description: 'We stay students forever. The landscape moves fast, and we move with it — always exploring, always questioning, always pushing what\'s possible.',
    },
    {
      title: 'Care',
      description: 'We build relationships, not just products. Your goals become our goals, and we treat every project as if our own reputation depends on it — because it does.',
    },
    {
      title: 'Rigor',
      description: 'Beautiful means nothing if it doesn\'t work. We engineer with precision, test with discipline, and ship with confidence.',
    },
  ];

  const disciplines = [
    { title: 'Creative Thinking', description: 'Brand, design, and story that make people care.' },
    { title: 'Engineering', description: 'Products and platforms built to work, scale, and last.' },
    { title: 'Business Strategy', description: 'Clear direction, priorities, and practical next steps.' },
  ];

  return (
    <div ref={containerRef} className="w-full pt-32 pb-24 px-6 sm:px-12 md:px-16 min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-white/10 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-[#6ee05a] hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return Home</span>
        </button>
        <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
          About Us
        </span>
      </div>

      {/* Main Heading */}
      <div className="max-w-6xl mx-auto">
        <h1 className="about-reveal font-display font-normal tracking-tight text-5xl sm:text-7xl md:text-8xl text-white leading-[0.9] mb-16">
          We are Qolab.
        </h1>

        {/* Narrative — one practice, possibility to execution (PRD 7.2) */}
        <div className="about-reveal grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div>
            <p className="font-sans text-lg sm:text-xl text-gray-400 leading-relaxed">
              Qolab brings creative thinking, engineering, and business strategy together
              as one practice. We take ideas from possibility to practical execution —
              designing, building, and planning the work that moves a business forward.
            </p>
          </div>
          <div>
            <p className="font-sans text-lg sm:text-xl text-gray-400 leading-relaxed">
              Founded in 2024, we are a Nigeria- and UK-based creative collective of strategists,
              designers, and engineers. One team around your brand, from the first
              question to launch — and to what comes next.
            </p>
          </div>
        </div>

        {/* One practice strip — replaces unverified stats (F3) */}
        <div className="about-reveal py-12 border-y border-white/10 mb-24">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-[#6ee05a] mb-8">
            One practice, three disciplines
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {disciplines.map((discipline, i) => (
              <div key={i}>
                <div className="font-display font-normal tracking-tight text-2xl sm:text-3xl text-white mb-2">{discipline.title}</div>
                <div className="font-sans text-sm text-gray-400 leading-relaxed">{discipline.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <h2 className="about-reveal font-display font-normal tracking-tight text-3xl sm:text-4xl text-white mb-12">What we stand for.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <div key={i} className="about-reveal lime-card bg-white/[0.03] rounded-[2rem] p-8 sm:p-10 border border-white/10">
                <h3 className="font-display font-normal tracking-tight text-2xl text-white mb-4">{value.title}</h3>
                <p className="font-sans text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Q-puzzle collaboration (PRD 7.2/7.6) */}
        <div className="about-reveal bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-[#6ee05a] mb-4">How we work together</p>
            <h2 className="font-display font-normal tracking-tight text-3xl sm:text-4xl text-white leading-tight mb-6">
              A team around your brand.
            </h2>
            <p className="font-sans text-gray-400 leading-relaxed mb-4">
              Our mark is a Q — a puzzle piece, a reminder that no great thing is built
              from one piece. Different disciplines and perspectives make stronger work,
              so collaboration isn't a slogan here: it's the structure.
            </p>
            <p className="font-sans text-gray-400 leading-relaxed">
              We do not assign you one person. We build you a team around your brand —
              strategists, designers, engineers, and marketers, aligned on one point of
              contact and one outcome.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48 sm:w-60 sm:h-60">
              <div className="absolute inset-0 rounded-[2.5rem] border-2 border-[#6ee05a]/30 rotate-6" />
              <div className="absolute inset-0 rounded-[2.5rem] lime-grad shadow-lg flex items-center justify-center">
                <span className="font-display text-[8rem] sm:text-[10rem] leading-none text-[#0f0f11] font-bold">Q</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team / story (D3 — facts pending F3/F4 confirmation) */}
        <div className="mb-24">
          <h2 className="about-reveal font-display font-normal tracking-tight text-3xl sm:text-4xl text-white mb-12">The team.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="about-reveal flex gap-4">
              <div className="w-1/2 aspect-[4/5] rounded-[2rem] overflow-hidden shadow-md relative">
                <img src={heroImg1} alt="Creative Team" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold">Creative Team</span>
                </div>
              </div>
              <div className="w-1/2 aspect-[4/5] rounded-[2rem] overflow-hidden shadow-md relative mt-8">
                <img src={heroImg7} alt="Coding Desk" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold">Coding Desk</span>
                </div>
              </div>
            </div>
            <div className="about-reveal flex flex-col justify-center">
              <p className="font-sans text-gray-400 text-base sm:text-lg leading-relaxed">
                A Nigeria- and UK-based creative collective, founded in 2024. Strategists,
                designers, engineers, and marketers working as one team — fully aligned
                with your goals, designing with craft and engineering with rigor.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="about-reveal bg-[#0f0f11] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-center">
          <h2 className="font-display font-normal tracking-tight text-3xl sm:text-5xl text-white mb-6">So, what's the big idea?</h2>
          <p className="font-sans text-white/80 max-w-lg mx-auto mb-8">
            Bring the question. Bring the ambition. Bring the unfinished idea. Let's see what it could become.
          </p>
          <button
            onClick={onNavigateToContact}
            className="inline-flex items-center gap-3 lime-grad font-display font-semibold py-4 px-10 rounded-full hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <span>Let's Make It Exist.</span>
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
