import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BR } from '../../lib/design';
import { ARTICLES } from '../../lib/data';
import { Photo } from '../../components/Primitives';
import { Icon } from '../../components/Icon';

const COLLECTIONS = [
  { l: 'Todo',           n: 32, c: BR.text,   on: true },
  { l: 'Para el viaje',  n: 8,  c: BR.accent },
  { l: 'Hilos vivos',    n: 5,  c: BR.info },
  { l: 'Para columna',   n: 12, c: BR.cool },
  { l: 'Investigación',  n: 7,  c: BR.pos },
];

const THREADS = [
  { l: 'Claude 5 — adopción AR',      n: 14, last: 'hace 18 min', c: BR.accent, newN: 4 },
  { l: 'Reforma laboral 2026',         n: 22, last: 'hace 1 h',   c: BR.cool,   newN: 2 },
  { l: 'BCRA — política monetaria',    n: 31, last: 'hace 3 h',   c: BR.info,   newN: 1 },
];

export default function SavedScreen() {
  const [activeCol, setActiveCol] = useState(0);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Header */}
        <View style={{ paddingHorizontal: 22, paddingTop: 6, paddingBottom: 16 }}>
          <Text style={s.monoLabel}>· biblioteca</Text>
          <Text style={s.pageTitle}>Guardados</Text>
          <Text style={{ fontSize: 13, color: BR.textMuted, marginTop: 6 }}>32 historias · 8 hilos seguidos</Text>
        </View>

        {/* Collections */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 22, gap: 10 }}
          style={{ marginBottom: 18 }}>
          {COLLECTIONS.map((c, i) => (
            <TouchableOpacity key={i} onPress={() => setActiveCol(i)} activeOpacity={0.8}
              style={[s.collBtn, i === activeCol && s.collBtnActive]}>
              <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: c.c, opacity: i === activeCol ? 0.6 : 1 }} />
              <Text style={[s.collText, { color: i === activeCol ? BR.bg : BR.text }]}>{c.l}</Text>
              <Text style={[s.collCount, { color: i === activeCol ? 'rgba(8,8,10,0.5)' : BR.textDim }]}>{c.n}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Followed threads */}
        <View style={{ paddingHorizontal: 22, marginBottom: 18 }}>
          <Text style={[s.sectionLabel, { marginBottom: 10 }]}>· Hilos vivos · 5 actualizados hoy</Text>
          <View style={{ gap: 8 }}>
            {THREADS.map((t, i) => (
              <TouchableOpacity key={i} style={s.threadCard} activeOpacity={0.8}>
                <Icon name="pin" size={14} color={t.c} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13.5, fontWeight: '500', color: BR.text }}>{t.l}</Text>
                  <Text style={{ fontFamily: 'SpaceMono', fontSize: 11, color: BR.textDim, marginTop: 4 }}>
                    {t.n} historias · {t.last}
                  </Text>
                </View>
                {t.newN > 0 && (
                  <View style={s.newBadge}>
                    <Text style={{ fontFamily: 'SpaceMono', fontSize: 10, fontWeight: '700', color: BR.accent }}>+{t.newN}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Saved articles */}
        <View style={{ paddingHorizontal: 22 }}>
          <Text style={[s.sectionLabel, { marginBottom: 10 }]}>· Historias · ordenadas por relevancia</Text>
          <View style={{ gap: 14 }}>
            {ARTICLES.slice(0, 4).map((article, i) => (
              <TouchableOpacity key={article.id} activeOpacity={0.8}
                style={[{ flexDirection: 'row', gap: 12 }, i < 3 && { borderBottomWidth: 1, borderBottomColor: BR.hairlineLo, paddingBottom: 14 }]}>
                <Photo tone={article.photo as any} height={64} style={{ width: 64, borderRadius: 10 }} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: article.catColor }} />
                    <Text style={[s.monoLabel, { color: article.catColor, marginBottom: 0 }]}>{article.cat}</Text>
                    <Text style={{ fontFamily: 'SpaceMono', fontSize: 9, color: BR.textDim }}>
                      · guardado {i === 0 ? 'hoy' : `${i} d`}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '400', color: BR.text, lineHeight: 20 }}>
                    {article.headline}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BR.bg },
  monoLabel: {
    fontFamily: 'SpaceMono', fontSize: 10, color: BR.accent,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6,
  },
  pageTitle: { fontSize: 30, fontWeight: '400', color: BR.text, lineHeight: 36 },
  sectionLabel: {
    fontFamily: 'SpaceMono', fontSize: 10, color: BR.textDim,
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
  collBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
  },
  collBtnActive: { backgroundColor: BR.text, borderColor: BR.text },
  collText: { fontSize: 13, fontWeight: '500' },
  collCount: { fontFamily: 'SpaceMono', fontSize: 11 },
  threadCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 12,
    backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
  },
  newBadge: {
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999,
    backgroundColor: BR.accentSoft, borderWidth: 1, borderColor: BR.accentLine,
  },
});
