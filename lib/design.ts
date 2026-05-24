// Design system tokens — "calma informativa": cream surfaces, warm carbon ink.
// Light by default. Avoid pure black/white; everything carries a warm undertone.
export const BR = {
  // surfaces — warm matte dark gray, not black
  ink:        '#161412',
  bg:         '#26241f', // main: deep warm gray, matte
  surface:    '#2d2b26', // cards
  elevated:   '#34322c', // highlight blocks
  subtle:     '#3a3832',
  hairline:   'rgba(235,229,216,0.09)',
  hairlineLo: 'rgba(235,229,216,0.05)',
  // text — warm off-white
  text:       '#ebe5d8',
  textMuted:  'rgba(235,229,216,0.62)',
  textDim:    'rgba(235,229,216,0.42)',
  textFaint:  'rgba(235,229,216,0.22)',
  // accent — terracotta, an editorial nod to the original orange but desaturated
  accent:     '#b8553a',
  accentSoft: 'rgba(184,85,58,0.10)',
  accentLine: 'rgba(184,85,58,0.28)',
  // signal (muted)
  pos:        '#3f7a52',
  alert:      '#a04839',
  info:       '#3a6b94',
  cool:       '#6b5b9a',
} as const;

// Photo placeholder tones
export const PHOTO_TONES = {
  neutral: ['#2a2a32', '#15151a'],
  warm:    ['#3a261a', '#1a1208'],
  cool:    ['#1f2a3b', '#0a1322'],
  moss:    ['#1f2a22', '#0c160e'],
  plum:    ['#2c1f3a', '#150c22'],
  rust:    ['#3d2415', '#1f0e07'],
  amber:   ['#3a2f12', '#1d1707'],
} as const;

export type PhotoTone = keyof typeof PHOTO_TONES;

// Deterministic sparkline values
export function sparkSeed(seed = 1, n = 18, base = 0.4, amp = 0.4): number[] {
  const arr: number[] = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v += (Math.sin(seed * (i + 1) * 1.3) + Math.cos(seed * (i + 0.7) * 0.9)) * 0.08;
    arr.push(Math.max(0.05, Math.min(0.95, base + amp * (v - base))));
  }
  return arr;
}
