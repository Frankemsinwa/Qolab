/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, ViewState, CursorState } from './types';
import { audioEngine } from './utils/audio';

// Immersive Modular Components
import CanvasBackground from './components/CanvasBackground';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import Navigation from './components/Navigation';
import LandingHero from './components/LandingHero';
import ProjectShowcase from './components/ProjectShowcase';
import ProjectDetail from './components/ProjectDetail';
import Manifesto from './components/Manifesto';
import Contact from './components/Contact';

export default function App() {
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [darkMode, setDarkMode] = useState(true);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [cursor, setCursor] = useState<CursorState>({ type: 'default' });

  // Canvas Mode Core
  const [canvasMode, setCanvasMode] = useState<'fluid' | 'strings' | 'gravity'>('fluid');

  // Update HTML body theme classes
  useEffect(() => {
    const bodyClass = document.body.classList;
    if (darkMode) {
      bodyClass.add('bg-bg-dark');
      bodyClass.remove('bg-bg-light');
      document.documentElement.style.backgroundColor = '#070708';
    } else {
      bodyClass.add('bg-bg-light');
      bodyClass.remove('bg-bg-dark');
      document.documentElement.style.backgroundColor = '#fbfbfd';
    }
  }, [darkMode]);

  const handleToggleTheme = () => {
    audioEngine.triggerClick();
    setDarkMode(!darkMode);
  };

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    setViewState('project-detail');
  };

  const handleBackToArchive = () => {
    setViewState('archive');
    setActiveProject(null);
  };

  const getCanvasIntensity = () => {
    return 0.55; // Perfect default sweet spot for physics background
  };

  return (
    <div
      id="app-root-container"
      className={`min-h-screen w-full relative transition-colors duration-700 ease-out flex flex-col justify-between overflow-x-hidden ${
        darkMode ? 'bg-bg-dark text-white' : 'bg-bg-light text-bg-dark'
      }`}
    >
      {/* Dynamic Interactive Cursor Field */}
      <CustomCursor cursorType={cursor.type} cursorText={cursor.text} darkMode={darkMode} />

      {/* Organic Noise Overlay Texture */}
      <div className="organic-noise" />

      {/* High Performance Interactive Background Physics Canvas */}
      {loaderComplete && (
        <div id="interactive-canvas-underlay" className="fixed inset-0 w-full h-full z-0 pointer-events-auto">
          <CanvasBackground
            mode={canvasMode}
            darkMode={darkMode}
            intensity={getCanvasIntensity()}
          />
        </div>
      )}

      {/* Main Presentation Layout Router */}
      <AnimatePresence mode="wait">
        {!loaderComplete ? (
          <Loader key="sys-loader" onComplete={() => setLoaderComplete(true)} darkMode={darkMode} />
        ) : (
          <motion.div
            key="sys-main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-grow flex flex-col justify-between relative z-10 w-full"
          >
            {/* Header Navigation Deck */}
            <Navigation
              currentView={viewState === 'project-detail' ? 'archive' : viewState}
              onNavigate={(view) => setViewState(view)}
              darkMode={darkMode}
              onToggleTheme={handleToggleTheme}
              setCursor={setCursor}
            />

            {/* View Switching Router Core */}
            <main className="flex-grow flex items-center justify-center w-full">
              <AnimatePresence mode="wait">
                {viewState === 'landing' && (
                  <motion.div
                    key="view-landing"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    className="w-full flex"
                  >
                    <LandingHero
                      onNavigate={setViewState}
                      onSelectProject={handleSelectProject}
                      selectedMode={canvasMode}
                      onModeChange={setCanvasMode}
                      setCursor={setCursor}
                      darkMode={darkMode}
                    />
                  </motion.div>
                )}

                {viewState === 'archive' && (
                  <motion.div
                    key="view-archive"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    className="w-full"
                  >
                    <ProjectShowcase
                      onSelectProject={handleSelectProject}
                      setCursor={setCursor}
                      darkMode={darkMode}
                    />
                  </motion.div>
                )}

                {viewState === 'project-detail' && activeProject && (
                  <motion.div
                    key={`view-detail-${activeProject.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    className="w-full"
                  >
                    <ProjectDetail
                      project={activeProject}
                      onBack={handleBackToArchive}
                      setCursor={setCursor}
                      darkMode={darkMode}
                    />
                  </motion.div>
                )}

                {viewState === 'manifesto' && (
                  <motion.div
                    key="view-manifesto"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    className="w-full"
                  >
                    <Manifesto setCursor={setCursor} darkMode={darkMode} />
                  </motion.div>
                )}

                {viewState === 'contact' && (
                  <motion.div
                    key="view-contact"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    className="w-full"
                  >
                    <Contact setCursor={setCursor} darkMode={darkMode} />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Immersive Footer */}
            <footer className="w-full border-t border-white/5 py-8 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] opacity-40 uppercase tracking-widest relative z-10">
              <span>© 2026 QOLAB DIGITAL // CREATIVE AGENCY</span>
              <div className="flex gap-6">
                <button onClick={() => setViewState('manifesto')} className="hover:text-accent-rose transition-colors cursor-none">ABOUT US</button>
                <button onClick={() => setViewState('contact')} className="hover:text-accent-rose transition-colors cursor-none">GET IN TOUCH</button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
