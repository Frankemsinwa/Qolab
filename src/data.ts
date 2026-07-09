/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, LabExperiment } from './types';

import proj1 from './assets/projects/project-1.jpg';
import proj2 from './assets/projects/project-2.jpg';
import proj3 from './assets/projects/project-3.jpg';
import proj4 from './assets/projects/project-4.jpg';

export const projectsData: Project[] = [
  {
    id: 'synapse-identity',
    title: 'SYNAPSE IDENTITY',
    subtitle: 'Brand System & Neuro-Web Platform',
    category: 'BRAND DESIGN & UI/UX',
    client: 'Synapse Labs',
    year: '2026',
    role: 'Visual Identity, Mobile UI & Interactive Engineering',
    description: 'An interactive, generative brand design and mobile suite that responds dynamically to neurological feed inputs and cursor motion. We replaced standard brand guidelines with a fluid, living digital system.',
    challenge: 'Synapse Labs wanted a brand design and UI/UX experience that rejected standard static templates. The main bottleneck was bringing dense real-time analytical data into a gorgeous, readable mobile application and web interface running smoothly at 120Hz.',
    solution: 'QOLAB engineered a responsive, high-performance web system and mobile UI/UX framework. By utilizing customized shader pipelines and lightweight SVG grids, we reduced rendering overhead by 68% while delivering stunning custom micro-interactions.',
    results: [
      'Featured on Behance Design Focus (Best UI/UX)',
      '+140% user engagement on the mobile beta platform',
      'Unified brand identity deployed globally across 8 digital ecosystems'
    ],
    tech: ['Brand Architecture', 'Framer Motion', 'React Native Design', 'WebGL Canvas', 'SVG Grids'],
    color: 'bg-rose-950',
    accentColor: '#e11d48',
    heroImage: proj1,
    galleryImages: [proj1, proj2, proj3]
  },
  {
    id: 'aether-mobile',
    title: 'AETHER SUITE',
    subtitle: 'Ambient Workspace Mobile App',
    category: 'MOBILE APP DEVELOPMENT & UI/UX',
    client: 'Aether Inc.',
    year: '2026',
    role: 'Full-Stack iOS/Android App & UI Architecture',
    description: 'A fully immersive ambient mobile application designed to coordinate physical and digital workspace metrics into interactive, sensory-guided focus widgets.',
    challenge: 'Traditional workspace apps are static, dense, and uninspiring. Aether wanted an experience that active remote workers would feel drawn to, which meant integrating custom physics and audio synth mechanics without slowing down mobile performance.',
    solution: 'QOLAB designed a modular, gesture-centric mobile UI backed by elastic spring systems. Users transition through layout nodes with fluid dragging, accompanied by ambient pentatonic sound feedback generated in real time.',
    results: [
      'App Store Featured App of the Week',
      '4.9/5 stars average review across 50,000+ active users',
      'Zero external assets loaded - 100% vector-generated client layouts'
    ],
    tech: ['iOS / Android Swift', 'React Native', 'Acoustic Feedback Engine', 'Gesture Physics', 'Spring Physics'],
    color: 'bg-violet-950',
    accentColor: '#8b5cf6',
    heroImage: proj2,
    galleryImages: [proj2, proj3, proj4]
  },
  {
    id: 'muse-web',
    title: 'MUSE EXPERIMENTAL',
    subtitle: 'Immersive WebGL Hub & Platform',
    category: 'WEBSITE DEVELOPMENT & MOTION DESIGN',
    client: 'MUSE Creative Group',
    year: '2025',
    role: 'Creative Coding & Interactive Website Development',
    description: 'An interactive spatial website mapping creative portfolios into gorgeous multi-dimensional elastic webs. Users navigate portfolios through magnetic coordinates.',
    challenge: 'Designing an interactive web experience that serves complex historical and artistic projects while keeping page loads instant and performance high across standard desktop and mobile browsers.',
    solution: 'We engineered a node-based coordinate grid utilizing WebGL spatial layouts. Each project acts as an orbital system with delicate particle effects that transition smoothly on touch or hover, creating beautiful tactile feedback.',
    results: [
      'Awwwards Site of the Month Winner',
      'Over 1.5 million interactive portfolio nodes explored',
      'Fluid page performance locked at a perfect 120 FPS'
    ],
    tech: ['WebGL', 'HTML5 Canvas', 'GSAP Sequencing', 'Tailwind v4', 'Custom Physics Core'],
    color: 'bg-emerald-950',
    accentColor: '#10b981',
    heroImage: proj3,
    galleryImages: [proj3, proj4, proj1]
  },
  {
    id: 'apex-branding',
    title: 'APEX DIGITAL SYSTEM',
    subtitle: 'Brand Design & Digital Marketing Ecosystem',
    category: 'BRAND DESIGN & MARKETING ECOSYSTEM',
    client: 'Apex Global',
    year: '2025',
    role: 'Brand Architecture, UX Strategy & Interactive Marketing',
    description: 'A revolutionary digital marketing hub integrating responsive, fluid brand guidelines with micro-coordinate grids, interactive content tools, and real-time aesthetic layouts.',
    challenge: 'Bridging standard guidelines with dynamic visual marketing campaigns. Giving designers and marketers the freedom to construct customized layouts without compromising core brand consistency.',
    solution: 'QOLAB built a customizable, modular web system backed by deep responsive templates. The system tracks content alignment and scales typography dynamically, ensuring every layout stays perfect across platforms.',
    results: [
      'CSS Design Awards Best UI/UX',
      '200% increase in lead generation across interactive pages',
      'Deployed globally across 15+ marketing sub-sites'
    ],
    tech: ['Brand Strategy', 'Typography Design', 'Tailwind v4', 'Asynchronous Grid API'],
    color: 'bg-zinc-950',
    accentColor: '#a1a1aa',
    heroImage: proj4,
    galleryImages: [proj4, proj1, proj2]
  }
];

export const experimentsData: LabExperiment[] = [
  {
    id: 'constellation-gravity',
    name: 'Constellation Gravity Well',
    description: 'Warp a coordinate-connected physics universe. Drag the mouse to set powerful black hole gravity wells that attract nodes, then release to watch them decelerate organically under custom drag coefficients.',
    category: 'Physics Simulation',
    complexity: 'Advanced',
    instructions: 'Change "Particle Speed" and "Density" to morph the universe. Hover elements to play interactive spatial notes mapped to your exact coordinates.',
    parameters: [
      { name: 'Drift Speed', key: 'speed', min: 0.1, max: 2.0, step: 0.1, defaultValue: 0.7 },
      { name: 'Magnetic Force', key: 'gravity', min: 0.2, max: 3.0, step: 0.1, defaultValue: 1.2 },
      { name: 'Interactive Radius', key: 'radius', min: 50, max: 400, step: 10, defaultValue: 220 },
    ]
  },
  {
    id: 'wave-pluck',
    name: 'String Tension Resonance',
    description: 'Slice through 12 physics-enabled micro-strings. The system tracks your mouse slicing speed and direction, plucking the strings with matching power before applying harmonic spring dampening.',
    category: 'Elastic Mechanics',
    complexity: 'High',
    instructions: 'Increase "Tension Stiffness" to speed up oscillation decay, or increase "Damping factor" to observe hyper-fluid motion. Double click to slice all strings at once.',
    parameters: [
      { name: 'Tension Stiffness', key: 'k', min: 0.01, max: 0.3, step: 0.01, defaultValue: 0.08 },
      { name: 'Air Damping', key: 'damping', min: 0.85, max: 0.99, step: 0.01, defaultValue: 0.94 },
      { name: 'String Count', key: 'strings', min: 4, max: 16, step: 1, defaultValue: 12 },
    ]
  },
  {
    id: 'orbital-sparks',
    name: 'Solar Orbital vortices',
    description: 'Orbit tiny spark constellations around floating black-hole bodies. Toggle the gravity core and click to burst sparks into wide centrifugal rings.',
    category: 'Celestial Physics',
    complexity: 'Experimental',
    instructions: 'Modify "Orbit Radius" to stretch the spark clouds, or shift "Vortex Intensity" to accelerate particle speeds. Engage clicking to expand spacing.',
    parameters: [
      { name: 'Orbit Speed Coefficient', key: 'speed', min: 0.002, max: 0.08, step: 0.002, defaultValue: 0.02 },
      { name: 'Spark Orbit Radius', key: 'distance', min: 20, max: 450, step: 10, defaultValue: 200 },
      { name: 'Interactive Speed Burst', key: 'burst', min: 0.2, max: 2.5, step: 0.1, defaultValue: 1.0 },
    ]
  }
];
