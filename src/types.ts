/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  client: string;
  year: string;
  role: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  tech: string[];
  color: string; // Tailwind bg color or hex
  accentColor: string;
  heroImage: string;
  galleryImages: string[];
}

export interface LabExperiment {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: string;
  instructions: string;
  parameters: {
    name: string;
    key: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
  }[];
}

export type ViewState = 'landing' | 'archive' | 'labs' | 'manifesto' | 'contact' | 'project-detail';

export interface CursorState {
  type: 'default' | 'hover' | 'magnetic' | 'drag' | 'view' | 'play' | 'sound';
  text?: string;
}
