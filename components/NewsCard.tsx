// NewsCard — the atom of Briefing.
// Calm, editorial, no widgets. Five elements only:
//   1. Category tag (small, with color dot)
//   2. Headline (serif, large, max 2 lines)
//   3. Summary (sans, 3 lines, muted)
//   4. "Por qué importa" (single line, italic accent)
//   5. "Profundizar →" affordance
// Tapping anywhere on the card opens the article detail.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { BR } from '../lib/design';
import type { Article } from '../lib/data';

interface Props {
  article: Article;
}

export function NewsCard({ article }: Props) {
  return (
    <Pressable
      onPress={() => router.push(`/article/${article.id}`)}
      style={({ pressed }) => [s.card, pressed && { opacity: 0.92, transform: [{ scale: 0.998 }] }]}>
      {/* Category */}
      <View style={s.catRow}>
        <View style={[s.catDot, { backgroundColor: article.catColor }]} />
        <Text style={s.catLabel}>{article.cat.toUpperCase()}</Text>
      </View>

      {/* Headline — serif, generous line height */}
      <Text style={s.headline} numberOfLines={2}>
        {article.headline}
      </Text>

      {/* Summary — sans, dim */}
      <Text style={s.summary} numberOfLines={3}>
        {article.summary}
      </Text>

      {/* Why it matters — the differential field */}
      <View style={s.whyBlock}>
        <Text style={s.whyLabel}>POR QUÉ IMPORTA</Text>
        <Text style={s.whyText}>{article.whyItMatters}</Text>
      </View>

      {/* Profundizar affordance */}
      <View style={s.cta}>
        <Text style={s.ctaText}>Profundizar</Text>
        <Text style={s.ctaArrow}>→</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    paddingVertical: 28,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: BR.hairline,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 14,
  },
  catDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  catLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    letterSpacing: 1.2,
    color: BR.textMuted,
  },
  headline: {
    fontFamily: 'Newsreader_500Medium',
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.4,
    color: BR.text,
    marginBottom: 14,
  },
  summary: {
    fontSize: 15,
    lineHeight: 23,
    color: BR.textMuted,
    marginBottom: 18,
  },
  whyBlock: {
    borderLeftWidth: 2,
    borderLeftColor: BR.accent,
    paddingLeft: 14,
    paddingVertical: 2,
    marginBottom: 20,
  },
  whyLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 9,
    letterSpacing: 1.4,
    color: BR.accent,
    marginBottom: 6,
  },
  whyText: {
    fontFamily: 'Newsreader_400Regular',
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 21,
    color: BR.text,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '500',
    color: BR.text,
    letterSpacing: -0.1,
  },
  ctaArrow: {
    fontSize: 15,
    color: BR.accent,
  },
});
