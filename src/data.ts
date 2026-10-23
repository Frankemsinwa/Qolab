/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, LabExperiment, Service } from './types';

import proj1 from './assets/projects/project-1.webp';
import proj2 from './assets/projects/project-2.jpg';
import proj3 from './assets/projects/project-3.jpg';
import proj4 from './assets/projects/project-4.jpg';
import amoloModel from './assets/projects/amolo/model.jpg';
import amoloTag from './assets/projects/amolo/tag.jpg';
import amoloJacket from './assets/projects/amolo/jacket.jpg';
import amoloCaps from './assets/projects/amolo/caps-shorts.jpg';
import amoloTeeWhite from './assets/projects/amolo/tee-white.jpg';
import amoloSuit from './assets/projects/amolo/suit.jpg';
import amoloSignage from './assets/projects/amolo/signage.jpg';
import amoloTeeMaroon from './assets/projects/amolo/tee-maroon.jpg';
import luxBillboard from './assets/projects/luxel/billboard.jpg';
import luxAircraft from './assets/projects/luxel/aircraft.jpg';
import luxPhone from './assets/projects/luxel/phone-app.jpg';
import luxCards from './assets/projects/luxel/business-cards.jpg';
import luxRollup from './assets/projects/luxel/rollup-banner.jpg';
import luxBrochure from './assets/projects/luxel/brochure.jpg';
import luxTshirt from './assets/projects/luxel/tshirt.jpg';
import luxGoldCard from './assets/projects/luxel/gold-card.jpg';
import brandIdentityImg from './assets/services/brand-identity.jpg';
import growthStrategyImg from './assets/services/growth-strategy.jpg';
import aiImg from './assets/services/ai-service.jpg';

export const projectsData: Project[] = [
  {
    id: 'luxel-bookings',
    title: 'LUXEL BOOKINGS',
    subtitle: 'Flight Booking Platform for Nigeria & Beyond',
    category: 'FULL-STACK WEB DEVELOPMENT & UI/UX',
    client: 'Luxel Inc.',
    year: '2026',
    role: 'Full-Stack Engineering & Product Design',
    description: 'A modern flight booking platform that makes travel accessible and affordable. Users can search, compare, and book flights from anywhere in the world with a focus on local Nigerian routes at the best prices.',
    challenge: 'The Nigerian travel market lacked a seamless, mobile-first booking experience that combined global flight inventory with affordable local routes. Existing platforms were slow, cluttered, and didn\'t prioritize the local user\'s needs.',
    solution: 'QOLAB engineered a performant, responsive booking platform with real-time flight search, smart fare comparison, and a streamlined checkout flow. The interface prioritizes speed and clarity, reducing booking time by 60% while maintaining access to the cheapest available fares.',
    results: [
      'Launched with 200+ local and international airline partnerships',
      'Average booking time reduced to under 3 minutes',
      'Mobile conversion rate of 4.8% — 2x industry average'
    ],
    tech: ['React', 'Node.js', 'Real-Time API Integration', 'Payment Gateway', 'Responsive Design'],
    color: 'bg-[#0a0f0d]',
    accentColor: '#3a863f',
    heroImage: proj1,
    galleryImages: [luxBillboard, luxAircraft, luxPhone, luxCards, luxRollup, luxBrochure, luxTshirt, luxGoldCard]
  },
  {
    id: 'amolo',
    title: 'AMOLO',
    subtitle: 'Clothing Brand — Italy & Nigeria',
    category: 'BRAND IDENTITY & FASHION DESIGN',
    client: 'Amolo',
    year: '2026',
    role: 'Brand Identity, Apparel Graphics & Art Direction',
    description: 'Amolo is a clothing label built between Italy and Nigeria — Italian tailoring discipline meeting Lagos energy. We shaped the brand from monogram to merch: identity, apparel graphics, packaging, and the imagery that carries it.',
    challenge: 'Amolo needed a brand that could live credibly in two fashion cultures at once — refined enough for the Italian market, distinctive enough to stand out in Nigeria — and hold together from a single monogram across garments, woven tags, packaging, and retail signage.',
    solution: 'We built a monogram-led identity in burnt orange and deep maroon, then rolled it across the full product line: tags, monogram tees, outerwear, tailored pieces, packaging, and storefront signage — one system, consistent at every touchpoint.',
    results: [
      'Monogram-led identity system: mark, palette, and monogram pattern',
      'Apparel line art-directed across outerwear, tees, and tailored pieces',
      'Woven tags, packaging, and retail signage designed for launch'
    ],
    tech: ['Brand Strategy', 'Visual Identity', 'Apparel Graphics', 'Packaging Design', 'Art Direction'],
    color: 'bg-[#160d08]',
    accentColor: '#c2410c',
    heroImage: amoloModel,
    galleryImages: [amoloTag, amoloJacket, amoloCaps, amoloTeeWhite, amoloSuit, amoloSignage, amoloTeeMaroon],
    galleryLayout: 'portrait'
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
    color: 'bg-[#0a0f0d]',
    accentColor: '#3a863f',
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
    color: 'bg-[#0a0f0d]',
    accentColor: '#3a863f',
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

export const servicesData: Service[] = [
  { id: 'brand-identity-design', num: '01', title: 'Brand Identity & Design', shortTitle: 'Brand Identity', description: 'Brand strategy, visual identity, art direction, guidelines, and digital assets.', image: brandIdentityImg, accent: '#3a863f' },
  { id: 'web-app-development', num: '02', title: 'Web & App Development', shortTitle: 'Web & Apps', description: 'Business websites, e-commerce, web apps, mobile apps, custom software, and digital platforms.', image: proj1, accent: '#3a863f' },
  { id: 'ai-solutions-automation', num: '03', title: 'AI Solutions & Automation', shortTitle: 'AI & Automation', description: 'AI-enabled solutions, intelligent workflows, and repetitive-process automation.', image: aiImg, accent: '#3a863f' },
  { id: 'growth-strategy', num: '04', title: 'Growth & Strategy', shortTitle: 'Growth & Strategy', description: 'Business analysis, positioning, marketing strategy, campaigns, and practical growth planning.', image: growthStrategyImg, accent: '#3a863f' },
];
