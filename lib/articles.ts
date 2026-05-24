import { supabase } from './supabase';
import type { Article } from './data';

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} d`;
}

export async function fetchArticles(limit = 20): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) throw error;

  return (data || []).map((r): Article => ({
    id:           r.id,
    cat:          r.cat,
    catColor:     r.cat_color || '#b8553a',
    headline:     r.headline,
    summary:      r.summary || '',
    whyItMatters: r.why_it_matters || '',
    src:          1,
    sources:      [{ l: (r.source_name || '?').slice(0, 1).toUpperCase(), bg: r.cat_color || '#b8553a' }],
    time:         relativeTime(r.published_at),
    read:         '3 min',
    perspectives: 0,
    photo:        'neutral',
    spark:        [],
    importance:   r.importance ?? 50,
  }));
}
