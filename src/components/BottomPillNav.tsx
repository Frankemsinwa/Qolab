import { ArrowUpRight } from 'lucide-react';
import QolabLogo from './QolabLogo';

interface BottomPillNavProps {
  onNavigate?: (view: 'about' | 'projects' | 'services' | 'contact') => void;
}

const links = [
  { label: 'Work', view: 'projects' as const },
  { label: 'Services', view: 'services' as const },
  { label: 'About', view: 'about' as const },
];

export default function BottomPillNav({ onNavigate }: BottomPillNavProps) {
  return (
    <nav
      aria-label="Primary"
      className="hidden md:flex fixed bottom-6 right-6 md:right-12 lg:right-16 z-[90] items-center gap-1 bg-[#0f0f11]/85 backdrop-blur-xl border border-white/10 rounded-full px-2.5 py-2 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
    >
      <span className="inline-flex bg-white/[0.06] rounded-full px-3.5 py-2 border border-white/10 mr-1">
        <QolabLogo className="w-14" />
      </span>
      {links.map((link) => (
        <button
          key={link.label}
          type="button"
          onClick={() => onNavigate?.(link.view)}
          className="font-display text-sm text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5"
        >
          {link.label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onNavigate?.('contact')}
        data-cursor="magnetic"
        data-cursor-text="Say hello"
        className="flex items-center gap-1.5 bg-white text-[#0f0f11] hover:bg-[#6ee05a] transition-colors font-display text-sm font-semibold px-4 py-2 rounded-full ml-1"
      >
        Let's talk
        <ArrowUpRight size={14} />
      </button>
    </nav>
  );
}
