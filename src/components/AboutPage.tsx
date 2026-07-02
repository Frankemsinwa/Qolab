import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';
import heroImg1 from '../assets/hero-imgs/hero-1.jpg';
import heroImg7 from '../assets/hero-imgs/hero-7.jpg';

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
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

  return (
    <div ref={containerRef} className="w-full bg-[#faf7f2] pt-32 pb-24 px-6 sm:px-12 md:px-16 min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-black/10 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-[#108a93] hover:text-[#159da8] transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return Home</span>
        </button>
        <span className="font-mono text-xs text-black/40 uppercase tracking-widest">
          About Us
        </span>
      </div>

      {/* Main Heading */}
      <div className="max-w-6xl mx-auto">
        <h1 className="about-reveal font-display italic text-5xl sm:text-7xl md:text-8xl text-black leading-[0.9] mb-16">
          We are Qolab.
        </h1>

        {/* Studio Description */}
        <div className="about-reveal grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div>
            <p className="font-sans text-lg sm:text-xl text-gray-700 leading-relaxed">
              Qolab is a creative design & technology studio rooted in craft, curiosity, and care.
              We design and build products, brands, and digital experiences that people genuinely love,
              helping modern businesses grow and thrive in a vibrant world.
            </p>
          </div>
          <div>
            <p className="font-sans text-lg sm:text-xl text-gray-700 leading-relaxed">
              Founded in 2024, we're a small team of versatile creatives operating at the convergence
              of beautiful interfaces and performant engineering. Fully aligned with your goals, we
              design with craft and code with rigor.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="about-reveal grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-black/10 mb-24">
          {[
            { number: '4+', label: 'Years Running' },
            { number: '50+', label: 'Projects Shipped' },
            { number: '30+', label: 'Happy Clients' },
            { number: '12', label: 'Team Members' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display italic text-4xl sm:text-5xl text-[#108a93] mb-2">{stat.number}</div>
              <div className="font-sans text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-24">
          <h2 className="about-reveal font-display italic text-3xl sm:text-4xl text-black mb-12">What we stand for.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <div key={i} className="about-reveal bg-white/50 rounded-[2rem] p-8 sm:p-10 border border-black/5">
                <h3 className="font-display italic text-2xl text-black mb-4">{value.title}</h3>
                <p className="font-sans text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="about-reveal font-display italic text-3xl sm:text-4xl text-black mb-12">The team.</h2>
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
              <p className="font-sans text-gray-600 text-base sm:text-lg leading-relaxed">
                We're a small team of versatile creatives. We operate at the convergence of beautiful
                interfaces and performant engineering. Fully aligned with your goals, we design with
                craft and code with rigor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
