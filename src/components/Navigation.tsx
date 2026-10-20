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
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 sm:px-12 py-6 pointer-events-none">
        {/* Brand Logo - Left */}
        <div
          onClick={() => onNavigate('landing')}
          className="pointer-events-auto cursor-pointer bg-white rounded-full px-4 py-2 border border-black/5 shadow-sm"
        >
          <QolabLogo className="w-20 md:w-24" />
        </div>

        {/* Menu Plus Button - Right */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 text-gray-900 border border-black/5 flex items-center justify-center pointer-events-auto transition-transform hover:scale-105 active:scale-95 shadow-sm"
        >
          {isOpen ? <X size={20} className="text-[#3a863f]" /> : <Plus size={20} className="text-[#3a863f]" />}
        </button>
      </header>

      {/* Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-white/98 z-40 flex flex-col justify-between px-8 py-24 sm:px-16 animate-fade-in">
          <nav className="flex flex-col gap-8 mt-12">
            <button
              onClick={() => { onNavigate('landing'); setIsOpen(false); }}
              className="font-display italic text-6xl text-left hover:text-[#3a863f] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('about'); setIsOpen(false); }}
              className="font-display italic text-6xl text-left hover:text-[#3a863f] transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => { onNavigate('services'); setIsOpen(false); }}
              className="font-display italic text-6xl text-left hover:text-[#3a863f] transition-colors cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => { onNavigate('projects'); setIsOpen(false); }}
              className="font-display italic text-6xl text-left hover:text-[#3a863f] transition-colors cursor-pointer"
            >
              Work
            </button>
            <button
              onClick={() => { onNavigate('contact'); setIsOpen(false); }}
              className="font-display italic text-6xl text-left hover:text-[#3a863f] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-t border-black/5 pt-8">
            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-black/50">Qolab Studio</p>
              <p className="font-sans text-sm text-black/80 mt-1">hello.qolab@gmail.com</p>
            </div>
            <div className="flex gap-4 text-sm text-black/60">
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

