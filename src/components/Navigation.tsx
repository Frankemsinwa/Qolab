import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import QolabLogo from './QolabLogo';

interface NavigationProps {
  onNavigate: (view: 'landing' | 'projects' | 'about' | 'services' | 'contact') => void;
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="nav-reveal fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 sm:px-12 py-6 pointer-events-none">
        {/* Brand Logo - Left */}
        <div
          onClick={() => onNavigate('landing')}
          className="pointer-events-auto cursor-pointer bg-[#0f0f11] rounded-full px-5 py-2.5 border border-white/10 shadow-md"
        >
          <QolabLogo className="w-16 md:w-20" />
        </div>

        {/* Menu Plus Button - Right */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-white/[0.06] hover:bg-white/10 text-white border border-white/10 flex items-center justify-center pointer-events-auto transition-transform hover:scale-105 active:scale-95 shadow-sm"
        >
          {isOpen ? <X size={20} className="text-[#6ee05a]" /> : <Plus size={20} className="text-[#6ee05a]" />}
        </button>
      </header>

      {/* Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#0a0d0c] z-40 flex flex-col justify-between px-8 py-24 sm:px-16 animate-fade-in">
          <nav className="flex flex-col gap-8 mt-12">
            <button
              onClick={() => { onNavigate('landing'); setIsOpen(false); }}
              className="font-display font-normal tracking-tight text-6xl text-left hover:text-[#6ee05a] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('about'); setIsOpen(false); }}
              className="font-display font-normal tracking-tight text-6xl text-left hover:text-[#6ee05a] transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => { onNavigate('services'); setIsOpen(false); }}
              className="font-display font-normal tracking-tight text-6xl text-left hover:text-[#6ee05a] transition-colors cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => { onNavigate('projects'); setIsOpen(false); }}
              className="font-display font-normal tracking-tight text-6xl text-left hover:text-[#6ee05a] transition-colors cursor-pointer"
            >
              Work
            </button>
            <button
              onClick={() => { onNavigate('contact'); setIsOpen(false); }}
              className="font-display font-normal tracking-tight text-6xl text-left hover:text-[#6ee05a] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-t border-white/10 pt-8">
            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-white/50">Qolab Studio</p>
              <p className="font-sans text-sm text-white/80 mt-1">hello.qolab@gmail.com</p>
            </div>
            <div className="flex gap-4 text-sm text-white/60">
              <a href="#" className="hover:underline">Instagram</a>
              <a href="#" className="hover:underline">LinkedIn</a>
              <a href="#" className="hover:underline">Twitter</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

