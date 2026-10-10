import type { Localized, MemberPlanet } from '../types';

export interface TeamMember {
  /** The name each member goes by on the site (not necessarily their real name). */
  name: string;
  role: Localized;
  /** Each member is drawn as their own planet, designed from the reference they chose. */
  planet: MemberPlanet;
}

export const TEAM: readonly TeamMember[] = [
  { name: 'Mariana', role: { es: 'Dev', en: 'Dev' }, planet: 'mariana' },
  { name: 'DilanOv', role: { es: 'Dev', en: 'Dev' }, planet: 'dilanov' },
  { name: 'FreDev', role: { es: 'Dev', en: 'Dev' }, planet: 'fredev' },
  { name: 'AigenDev', role: { es: 'Dev', en: 'Dev' }, planet: 'aigen' },
];

/** Mariana and DilanOv are a couple: they sit side by side, joined by a trail of light. */
export const COUPLE = ['Mariana', 'DilanOv'] as const;
