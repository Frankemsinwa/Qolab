import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import Navigation from './components/Navigation';
import LandingHero from './components/LandingHero';
import ProjectDetail from './components/ProjectDetail';
import ProjectShowcase from './components/ProjectShowcase';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import ContactPage from './components/ContactPage';
import ServiceDetail from './components/ServiceDetail';
import TransitionOverlay, { type TransitionHandle } from './components/TransitionOverlay';
import CustomCursor from './components/CustomCursor';
import logoImg from './assets/logo.png.png';
import { Project, Service } from './types';

type View = 'landing' | 'projects' | 'detail' | 'about' | 'services' | 'contact' | 'service-detail' | 'not-found';

const KNOWN_PATHS = ['/', '/index.html'];

export default function App() {
  const [view, setView] = useState<View>(() =>
    typeof window !== 'undefined' && !KNOWN_PATHS.includes(window.location.pathname)
      ? 'not-found'
      : 'landing'
  );
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [lastView, setLastView] = useState<'landing' | 'projects'>('landing');
  const transitionRef = useRef<TransitionHandle>(null);

  const handleSelectProject = (project: Project) => {
    setLastView(view === 'landing' || view === 'projects' ? view : 'landing');
    setActiveProject(project);
    setView('detail');
  };

  const handleBackFromDetail = () => {
    setView(lastView);
    setActiveProject(null);
  };

  const handleSelectService = async (service: Service) => {
    // Wait for next frame to get the active card's position
    await new Promise(r => requestAnimationFrame(r));

    const card = document.querySelector(`[data-service-id="${service.id}"]`);
    if (card) {
      const rect = card.getBoundingClientRect();
      await transitionRef.current?.zoomIn({
        image: service.image,
        accent: service.accent,
        rect,
      });
    }

    setActiveService(service);
    setView('service-detail');
  };

  const handleBackFromService = () => {
    setActiveService(null);
    setView('landing');
  };

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div id="app-root-container" className="min-h-screen bg-white text-[#1a1a1a] overflow-x-hidden selection:bg-accent-green selection:text-white cursor-none md:cursor-none">
      {/* Custom cursor */}
      <CustomCursor />

      {/* Global transition overlay for service card zoom */}
      <TransitionOverlay ref={transitionRef} />

      {/* Header Navigation - hidden on landing since hero has its own nav */}
      {view !== 'landing' && view !== 'service-detail' && view !== 'not-found' && (
        <Navigation onNavigate={(target) => setView(target)} />
      )}

      {/* Main presentation grid layout routing */}
      <main className="w-full">
        {view === 'landing' && (
          <LandingHero
            onSelectProject={handleSelectProject}
            onViewAllProjects={() => setView('projects')}
            onSelectService={handleSelectService}
            onNavigate={(target) => setView(target)}
          />
        )}
        {view === 'projects' && (
          <ProjectShowcase
            onSelectProject={handleSelectProject}
            onBack={() => setView('landing')}
          />
        )}
        {view === 'detail' && activeProject && (
          <ProjectDetail
            project={activeProject}
            onBack={handleBackFromDetail}
            onNavigateToContact={() => setView('contact')}
          />
        )}
        {view === 'about' && (
          <AboutPage onBack={() => setView('landing')} onNavigateToContact={() => setView('contact')} />
        )}
        {view === 'services' && (
          <ServicesPage onBack={() => setView('landing')} onNavigateToContact={() => setView('contact')} />
        )}
        {view === 'contact' && (
          <ContactPage onBack={() => setView('landing')} />
        )}
        {view === 'service-detail' && activeService && (
          <ServiceDetail
            service={activeService}
            onBack={handleBackFromService}
            onNavigateToContact={() => setView('contact')}
          />
        )}
        {view === 'not-found' && (
          <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
            <img src={logoImg} alt="Qolab" className="h-20 md:h-24 w-auto mb-10" />
            <h1 className="font-display italic text-4xl sm:text-5xl text-black leading-tight mb-4">
              Looks like this piece doesn't fit.
            </h1>
            <p className="font-sans text-gray-600 mb-10 max-w-md">
              The page you're looking for doesn't exist — but the way back is easy.
            </p>
            <button
              onClick={() => {
                window.history.replaceState(null, '', '/');
                setView('landing');
              }}
              className="inline-flex items-center gap-2 bg-[#3a863f] hover:bg-[#2f6d33] text-white font-semibold py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-md font-display"
            >
              Find your way back.
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
