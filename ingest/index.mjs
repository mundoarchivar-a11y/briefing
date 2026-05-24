// Briefing ingester — reads RSS feeds, summarizes with Gemini, writes to Supabase.
// Run by GitHub Actions on cron. Local debug: copy .env.example to .env and `node index.mjs`.

import { readFile } from 'node:fs/promises';
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const { SUPABASE_URL, SUPABASE_SERVICE_KEY, GEMINI_API_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GEMINI_API_KEY) {
  console.error('Missing env: SUPABASE_URL, SUPABASE_SERVICE_KEY, GEMINI_API_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });
const genai = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash' });
const parser = new Parser({ timeout: 15000, headers: { 'User-Agent': 'BriefingBot/1.0' } });

const MAX_AGE_HOURS = 24;
const MAX_PER_FEED  = 4;
const PAUSE_MS      = 600;

const CAT_COLOR = {
  'IA & Tech':   '#b8553a',
  'Mercados':    '#3a6b94',
  'Política AR': '#6b5b9a',
  'Mundo':       '#a04839',
  'Cultura':     '#6b5b9a',
  'Clima':       '#3f7a52',
};

async function summarize(title, content) {
  const prompt = `Sos editor de un brief premium en español rioplatense. Devolvé SOLO JSON válido sin markdown, sin backticks:
{"summary":"resumen humano en 2-3 frases, máximo 240 caracteres, sin clichés periodísticos","whyItMatters":"una sola línea explicando por qué importa al lector, máximo 160 caracteres","importance":<0-100>}

TÍTULO: ${title}

CONTENIDO: ${(content || '').slice(0, 2000)}`;
  const r = await model.generateContent(prompt);
  const txt = r.response.text().replace(/^```(?:json)?|```$/gm, '').trim();
  return JSON.parse(txt);
}

async function ingestFeed({ url, category }) {
  console.log(`\n→ [${category}] ${url}`);
  let feed;
  try { feed = await parser.parseURL(url); }
  catch (e) { console.log(`  ✗ feed: ${e.message}`); return; }

  const cutoff = Date.now() - MAX_AGE_HOURS * 3600_000;
  const items = (feed.items || [])
    .filter(i => {
      const ts = new Date(i.isoDate || i.pubDate || 0).getTime();
      return ts > cutoff;
    })
    .slice(0, MAX_PER_FEED);

  for (const it of items) {
    const link = it.link;
    if (!link || !it.title) continue;

    const { data: exists } = await sb
      .from('articles').select('id').eq('source_url', link).maybeSingle();
    if (exists) continue;

    try {
      const { summary, whyItMatters, importance } = await summarize(
        it.title,
        it.contentSnippet || it.content || it.summary || '',
      );
      const { error } = await sb.from('articles').insert({
        source_url:    link,
        source_name:   feed.title || new URL(link).hostname,
        cat:           category,
        cat_color:     CAT_COLOR[category] || '#b8553a',
        headline:      it.title.trim(),
        summary,
        why_it_matters: whyItMatters,
        importance:    Math.max(0, Math.min(100, Number(importance) || 50)),
        published_at:  it.isoDate || it.pubDate || new Date().toISOString(),
      });
      if (error) throw error;
      console.log(`  ✓ ${it.title.slice(0, 70)}`);
    } catch (e) {
      console.log(`  ✗ ${(e.message || String(e)).slice(0, 300)}`);
    }
    await new Promise(r => setTimeout(r, PAUSE_MS));
  }
}

const feeds = JSON.parse(await readFile(new URL('./feeds.json', import.meta.url), 'utf8'));
for (const f of feeds) {
  try { await ingestFeed(f); } catch (e) { console.log(`feed crash: ${e.message}`); }
}
console.log('\n✓ ingest done');
