// lib/interests.ts
// Interest system — predefined + fully custom, free-text topics.
// Any keyword is valid: recipes, astrology, quantum physics, local sports, etc.

import { BR } from './design';

export type InterestSource = 'predefined' | 'custom';

export interface Interest {
  id: string;          // slug, e.g. "ia-tech" or custom uuid
  label: string;       // display: "IA & Tech", "Física Cuántica", "Recetas"
  color: string;       // one of the signal colors
  weight: number;      // 0–100, default 50 for new, 70 for predefined
  source: InterestSource;
  emoji?: string;      // optional emoji chosen at creation
  keywords?: string[]; // extra search terms for matching
}

// ─── Predefined topics ───────────────────────────────────────
export const PREDEFINED_INTERESTS: Interest[] = [
  // Tech & Science
  { id: 'ia-tech',       label: 'IA & Tech',       color: BR.accent, weight: 70, source: 'predefined', emoji: '🤖', keywords: ['inteligencia artificial', 'machine learning', 'llm', 'gpt', 'claude', 'openai', 'deepmind'] },
  { id: 'ciencia',       label: 'Ciencia',          color: BR.pos,    weight: 60, source: 'predefined', emoji: '🔬', keywords: ['física', 'biología', 'química', 'astronomía', 'investigación'] },
  { id: 'espacio',       label: 'Espacio',          color: BR.cool,   weight: 50, source: 'predefined', emoji: '🚀', keywords: ['nasa', 'spacex', 'cohete', 'satélite', 'exoplaneta'] },
  { id: 'startups',      label: 'Startups',         color: BR.accent, weight: 65, source: 'predefined', emoji: '⚡', keywords: ['emprendimiento', 'venture capital', 'funding', 'unicornio'] },
  // Economy & Finance
  { id: 'mercados',      label: 'Mercados',         color: BR.info,   weight: 70, source: 'predefined', emoji: '📈', keywords: ['bolsa', 'acciones', 'dólar', 'euro', 'trading', 'inversión'] },
  { id: 'crypto',        label: 'Crypto',           color: BR.info,   weight: 50, source: 'predefined', emoji: '₿', keywords: ['bitcoin', 'ethereum', 'blockchain', 'defi', 'web3'] },
  { id: 'negocios',      label: 'Negocios',         color: BR.info,   weight: 55, source: 'predefined', emoji: '💼', keywords: ['empresa', 'corporativo', 'management', 'estrategia'] },
  // Politics & Society
  { id: 'politica-ar',   label: 'Política AR',      color: BR.cool,   weight: 70, source: 'predefined', emoji: '🇦🇷', keywords: ['argentina', 'gobierno', 'diputados', 'senado', 'presidente', 'milei'] },
  { id: 'geopolitica',   label: 'Geopolítica',      color: BR.cool,   weight: 55, source: 'predefined', emoji: '🌍', keywords: ['diplomacia', 'tratado', 'relaciones exteriores', 'guerra', 'otan'] },
  { id: 'local-caba',    label: 'Local CABA',       color: BR.info,   weight: 60, source: 'predefined', emoji: '🏙️', keywords: ['buenos aires', 'caba', 'larreta', 'subte', 'ciudad'] },
  // Environment & Health
  { id: 'clima',         label: 'Clima',            color: BR.pos,    weight: 60, source: 'predefined', emoji: '🌱', keywords: ['cambio climático', 'medio ambiente', 'sustentabilidad', 'energía renovable'] },
  { id: 'salud',         label: 'Salud',            color: BR.alert,  weight: 50, source: 'predefined', emoji: '🏥', keywords: ['medicina', 'hospital', 'pandemia', 'vacuna', 'bienestar'] },
  // Culture & Entertainment
  { id: 'cultura',       label: 'Cultura',          color: BR.cool,   weight: 55, source: 'predefined', emoji: '🎭', keywords: ['arte', 'teatro', 'literatura', 'museo', 'exposición'] },
  { id: 'cine-series',   label: 'Cine & Series',    color: BR.cool,   weight: 50, source: 'predefined', emoji: '🎬', keywords: ['película', 'netflix', 'hbo', 'disney', 'oscar', 'serie'] },
  { id: 'gaming',        label: 'Gaming',           color: BR.alert,  weight: 45, source: 'predefined', emoji: '🎮', keywords: ['videojuegos', 'playstation', 'xbox', 'nintendo', 'esports'] },
  { id: 'musica',        label: 'Música',           color: BR.accent, weight: 45, source: 'predefined', emoji: '🎵', keywords: ['banda', 'álbum', 'concierto', 'spotify', 'streaming'] },
  // Sports
  { id: 'deportes',      label: 'Deportes',         color: BR.pos,    weight: 50, source: 'predefined', emoji: '⚽', keywords: ['fútbol', 'básquet', 'tenis', 'olimpiadas', 'mundial'] },
  // Trending / Misc
  { id: 'tendencias',    label: 'Tendencias',       color: BR.accent, weight: 50, source: 'predefined', emoji: '🔥', keywords: ['viral', 'trending', 'redes sociales', 'meme'] },
];

// Color pool for auto-assigning to custom topics
const COLOR_POOL = [BR.accent, BR.info, BR.cool, BR.pos, BR.alert];
let colorCursor = 0;

export function nextColor(): string {
  const c = COLOR_POOL[colorCursor % COLOR_POOL.length];
  colorCursor++;
  return c;
}

// Auto-pick an emoji based on keyword heuristics
const EMOJI_MAP: [RegExp, string][] = [
  [/receta|cocina|gastronomía|comida|chef/i, '🍳'],
  [/astrolog/i, '⭐'],
  [/física|cuánti|partícula|higgs/i, '⚛️'],
  [/yoga|meditación|mindfulness|zen/i, '🧘'],
  [/fotografía|foto/i, '📷'],
  [/viaje|turismo|mochilero/i, '✈️'],
  [/moda|fashion|ropa|diseño/i, '👗'],
  [/arquitectura|urbanismo/i, '🏛️'],
  [/finanzas|ahorro|inversión personal/i, '💰'],
  [/historia|historia.*ar|patrimoni/i, '📜'],
  [/bienestar|wellness|salud mental/i, '🌿'],
  [/anime|manga/i, '🎌'],
  [/automóvil|auto|motor/i, '🚗'],
  [/misterio|conspiraci/i, '🔍'],
  [/numismática|filatel/i, '🪙'],
  [/jardinería|plantas|botanica/i, '🌻'],
  [/perros|gatos|mascotas|animales/i, '🐾'],
  [/astronomía|telescopio|estrella/i, '🔭'],
  [/rugby|tenis|golf|padel/i, '🏅'],
  [/política/i, '🗳️'],
  [/economía/i, '📊'],
  [/tecnología|tech/i, '💻'],
];

export function guessEmoji(label: string): string {
  for (const [re, emoji] of EMOJI_MAP) {
    if (re.test(label)) return emoji;
  }
  return '📌'; // default
}

export function makeCustomInterest(label: string): Interest {
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: label.trim(),
    color: nextColor(),
    weight: 50,
    source: 'custom',
    emoji: guessEmoji(label),
  };
}
