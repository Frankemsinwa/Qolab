import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, Send, Check } from 'lucide-react';
import { gsap } from 'gsap';

interface ContactPageProps {
  onBack: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div ref={containerRef} className="w-full pt-32 pb-24 px-6 sm:px-12 md:px-16 min-h-screen">
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
          Contact
        </span>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <h1 className="contact-reveal font-display italic text-5xl sm:text-7xl md:text-8xl text-black leading-[0.9] mb-8">
          Let's talk.
        </h1>
        <p className="contact-reveal font-sans text-lg sm:text-xl text-gray-600 max-w-2xl mb-20 leading-relaxed">
          Have a project in mind? We'd love to hear about it. Drop us a message and we'll get back
          to you within 24 hours.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Details */}
          <div className="contact-reveal">
            <h2 className="font-display italic text-2xl text-black mb-8">Get in touch.</h2>
            <div className="flex flex-col gap-6">
              <div className="bg-white/50 rounded-2xl p-6 border border-black/5">
                <span className="font-mono text-xs text-[#108a93] font-bold uppercase tracking-widest mb-2 block">Email</span>
                <a href="mailto:hello@qolab.digital" className="font-sans text-lg text-black hover:text-[#108a93] transition-colors">
                  hello@qolab.digital
                </a>
              </div>
              <div className="bg-white/50 rounded-2xl p-6 border border-black/5">
                <span className="font-mono text-xs text-[#108a93] font-bold uppercase tracking-widest mb-2 block">Location</span>
                <p className="font-sans text-lg text-black">London, UK</p>
                <p className="font-sans text-sm text-gray-500 mt-1">Working globally</p>
              </div>
              <div className="bg-white/50 rounded-2xl p-6 border border-black/5">
                <span className="font-mono text-xs text-[#108a93] font-bold uppercase tracking-widest mb-2 block">Follow Us</span>
                <div className="flex gap-4 mt-2">
                  <a href="#" className="font-sans text-black hover:text-[#108a93] transition-colors">Instagram</a>
                  <a href="#" className="font-sans text-black hover:text-[#108a93] transition-colors">LinkedIn</a>
                  <a href="#" className="font-sans text-black hover:text-[#108a93] transition-colors">Twitter</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-reveal">
            <h2 className="font-display italic text-2xl text-black mb-8">Send a message.</h2>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="font-mono text-xs text-black/40 uppercase tracking-widest mb-2 block">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-white/50 border border-black/10 rounded-xl px-6 py-4 text-black font-sans focus:outline-none focus:border-[#108a93] transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-black/40 uppercase tracking-widest mb-2 block">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full bg-white/50 border border-black/10 rounded-xl px-6 py-4 text-black font-sans focus:outline-none focus:border-[#108a93] transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-black/40 uppercase tracking-widest mb-2 block">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project..."
                    className="w-full bg-white/50 border border-black/10 rounded-xl px-6 py-4 text-black font-sans focus:outline-none focus:border-[#108a93] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-3 bg-[#108a93] hover:bg-[#159da8] text-white font-semibold py-4 px-8 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-md mt-2"
                >
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            ) : (
              <div className="bg-white/50 rounded-[2rem] p-10 border border-black/5 text-center">
                <div className="w-16 h-16 rounded-full bg-[#108a93] flex items-center justify-center mx-auto mb-6">
                  <Check size={28} className="text-white" />
                </div>
                <h3 className="font-display italic text-2xl text-black mb-3">Message sent!</h3>
                <p className="font-sans text-gray-600">Thanks for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
