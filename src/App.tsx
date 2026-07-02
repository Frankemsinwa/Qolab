import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import Navigation from './components/Navigation';
import LandingHero from './components/LandingHero';
import ProjectDetail from './components/ProjectDetail';
import ProjectShowcase from './components/ProjectShowcase';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import ContactPage from './components/ContactPage';
import { Project } from './types';

type View = 'landing' | 'projects' | 'detail' | 'about' | 'services' | 'contact';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [lastView, setLastView] = useState<'landing' | 'projects'>('landing');

  const handleSelectProject = (project: Project) => {
    setLastView(view === 'landing' || view === 'projects' ? view : 'landing');
    setActiveProject(project);
    setView('detail');
  };

  const handleBackFromDetail = () => {
    setView(lastView);
    setActiveProject(null);
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
    <div id="app-root-container" className="min-h-screen bg-cream text-[#1a1a1a] overflow-x-hidden selection:bg-accent-teal selection:text-white">
      {/* Header Navigation */}
      <Navigation onNavigate={(target) => setView(target)} />

      {/* Main presentation grid layout routing */}
      <main className="w-full">
        {view === 'landing' && (
          <LandingHero
            onSelectProject={handleSelectProject}
            onViewAllProjects={() => setView('projects')}
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
          />
        )}
        {view === 'about' && (
          <AboutPage onBack={() => setView('landing')} />
        )}
        {view === 'services' && (
          <ServicesPage onBack={() => setView('landing')} onNavigateToContact={() => setView('contact')} />
        )}
        {view === 'contact' && (
          <ContactPage onBack={() => setView('landing')} />
        )}
      </main>
    </div>
  );
}



