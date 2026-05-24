import { sparkSeed } from './design';
import { BR } from './design';

export interface Source {
  l: string;
  bg: string;
  fg?: string;
}

export interface Article {
  id: string;
  cat: string;
  catColor: string;
  headline: string;
  summary: string;
  whyItMatters: string;
  src: number;
  sources: Source[];
  time: string;
  read: string;
  perspectives: number;
  photo: string;
  spark: number[];
  importance: number;
  badge?: string;
  down?: boolean;
}

export const ARTICLES: Article[] = [
  {
    id: 'a',
    cat: 'IA & Tech', catColor: BR.accent,
    headline: 'Anthropic libera Claude 5 con razonamiento sostenido de 8 horas; 14 startups argentinas ya migran su stack',
    summary: 'El nuevo modelo opera tareas extendidas sin intervención humana. En Buenos Aires, Mural, Auth0 y Mercado Pago confirmaron pruebas internas. Costos por token bajan 38%.',
    whyItMatters: 'Marca el primer salto desde 2024 hacia agentes autónomos comerciales — define cómo se contratará talento técnico el próximo año.',
    src: 12,
    sources: [
      { l: 'A', bg: '#ff7a1a' },
      { l: 'R', bg: '#7aa9e6' },
      { l: 'V', bg: '#5fc081' },
      { l: 'B', bg: '#a994f0' },
    ],
    time: 'hace 18 min', read: '4 min', perspectives: 3, photo: 'rust',
    spark: sparkSeed(2, 18, 0.3, 0.6),
    importance: 92,
    badge: 'BREAKING',
  },
  {
    id: 'b',
    cat: 'Mercados', catColor: BR.info,
    headline: 'El BCRA recorta tasa al 28% — peso retrocede 1.4% y rinde más que la soja del trimestre',
    summary: 'Décima baja consecutiva. Analistas dividen lectura: Goldman ve "normalización ordenada"; LCG advierte que la inflación de mayo aún no fue digerida.',
    whyItMatters: 'Define el costo del crédito hipotecario y de la deuda corporativa argentina por al menos un trimestre.',
    src: 24,
    sources: [
      { l: 'B', bg: '#7aa9e6' },
      { l: 'L', bg: '#a994f0' },
      { l: 'I', bg: '#5fc081' },
    ],
    time: 'hace 42 min', read: '3 min', perspectives: 4, photo: 'cool',
    spark: sparkSeed(7, 18, 0.6, -0.4), down: true,
    importance: 81,
  },
  {
    id: 'c',
    cat: 'Política AR', catColor: BR.cool,
    headline: 'Diputados aprueba reforma laboral en general; el debate por artículo arranca el martes',
    summary: 'Pasó con 142 votos a favor. Diputadas del oficialismo aceptaron modificaciones al régimen de pasantías. Sindicatos convocaron marcha para el jueves.',
    whyItMatters: 'Cambia las reglas para contratar y despedir en pymes — afecta directamente a 4 millones de trabajadores informales.',
    src: 31,
    sources: [
      { l: 'C', bg: '#a994f0' },
      { l: 'P', bg: '#e57161' },
      { l: 'N', bg: '#7aa9e6' },
      { l: '+', bg: '#22222a', fg: 'rgba(243,241,236,0.42)' },
    ],
    time: 'hace 1 h', read: '5 min', perspectives: 6, photo: 'plum',
    spark: sparkSeed(3, 18, 0.5, 0.3),
    importance: 76,
  },
  {
    id: 'd',
    cat: 'Clima', catColor: BR.pos,
    headline: 'Récord de viento solar afectará GPS y comunicaciones satelitales el miércoles',
    summary: 'NOAA emite alerta G3. Aerolíneas reportan reruteos preventivos en vuelos polares. Sin impacto en redes eléctricas según REE.',
    whyItMatters: 'Si usás navegación o servicios cloud el miércoles, pueden fallar momentáneamente — backup local recomendado.',
    src: 9,
    sources: [
      { l: 'N', bg: '#5fc081' },
      { l: 'E', bg: '#7aa9e6' },
    ],
    time: 'hace 2 h', read: '2 min', perspectives: 2, photo: 'cool',
    spark: sparkSeed(5, 18, 0.4, 0.5),
    importance: 58,
  },
  {
    id: 'e',
    cat: 'Cultura', catColor: BR.cool,
    headline: 'Spotify lanza modo radio editorial curado por humanos — guiño a la audiencia que dejó podcasts',
    summary: 'Disponible inicialmente en CABA y CDMX. Cada estación tendrá curador con nombre y rostro. Internamente lo llaman "anti-algoritmo".',
    whyItMatters: 'Primera gran apuesta de una plataforma masiva por curaduría humana — señal de fatiga del feed algorítmico.',
    src: 6,
    sources: [
      { l: 'V', bg: '#a994f0' },
      { l: 'P', bg: '#ff7a1a' },
    ],
    time: 'hace 3 h', read: '3 min', perspectives: 2, photo: 'amber',
    spark: sparkSeed(8, 18, 0.45, 0.2),
    importance: 41,
  },
];

export const TRENDING = [
  { l: 'Claude 5',         cat: 'IA',         c: BR.accent, delta: '+218%', mentions: '14.2k', spark: sparkSeed(2, 24, 0.2, 0.7), peak: true },
  { l: 'Tasa BCRA',        cat: 'Mercados',   c: BR.info,   delta: '+62%',  mentions: '8.7k',  spark: sparkSeed(4, 24, 0.4, 0.4) },
  { l: 'Reforma laboral',  cat: 'Política',   c: BR.cool,   delta: '+44%',  mentions: '6.1k',  spark: sparkSeed(7, 24, 0.45, 0.3) },
  { l: 'Viento solar G3',  cat: 'Ciencia',    c: BR.pos,    delta: '+38%',  mentions: '3.9k',  spark: sparkSeed(9, 24, 0.3, 0.5) },
  { l: 'Boca — Riestra',   cat: 'Deportes',   c: BR.alert,  delta: '+28%',  mentions: '12.4k', spark: sparkSeed(11, 24, 0.5, 0.3) },
  { l: 'Spotify editorial', cat: 'Cultura',   c: BR.cool,   delta: '−12%',  mentions: '2.1k',  spark: sparkSeed(13, 24, 0.6, -0.3), down: true },
];
