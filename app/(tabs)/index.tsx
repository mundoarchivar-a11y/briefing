// Home — calm editorial feed. Data from Supabase.
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BR } from '../../lib/design';
import { fetchArticles } from '../../lib/articles';
import type { Article } from '../../lib/data';
import { NewsCard } from '../../components/NewsCard';

const CATEGORIES = ['Todo', 'IA & Tech', 'Mercados', 'Política AR', 'Mundo', 'Cultura'];

function formatToday() {
  return new Date()
    .toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
    .replace(/^\w/, c => c.toUpperCase());
}

export default function HomeScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCat, setActiveCat] = useState('Todo');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchArticles(30);
      setArticles(data);
    } catch (e: any) {
      setError(e.message || 'No pude cargar las noticias');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(); };

  const shown = useMemo(() => {
    if (activeCat === 'Todo') return articles;
    return articles.filter(a => a.cat === activeCat);
  }, [articles, activeCat]);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BR.textMuted} />}>
        {/* Masthead */}
        <View style={s.masthead}>
          <Text style={s.date}>{formatToday()}</Text>
          <Text style={s.wordmark}>Briefing<Text style={{ color: BR.accent }}>.</Text></Text>
        </View>

        {/* Category strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catStrip}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 22 }}>
          {CATEGORIES.map(cat => {
            const active = cat === activeCat;
            return (
              <Pressable key={cat} onPress={() => setActiveCat(cat)}>
                <Text style={[s.catItem, active && s.catItemActive]}>{cat}</Text>
                {active && <View style={s.catUnderline} />}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Section label */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionLabel}>
            {activeCat === 'Todo' ? 'Lo importante ahora' : activeCat}
          </Text>
          <Text style={s.sectionMeta}>
            {shown.length} {shown.length === 1 ? 'historia' : 'historias'}
          </Text>
        </View>

        {/* States */}
        <View style={{ paddingHorizontal: 24 }}>
          {loading && (
            <View style={{ paddingVertical: 80, alignItems: 'center' }}>
              <ActivityIndicator color={BR.textMuted} />
            </View>
          )}

          {!loading && error && (
            <View style={{ paddingVertical: 40 }}>
              <Text style={{ color: BR.alert, fontSize: 14, marginBottom: 8 }}>{error}</Text>
              <Pressable onPress={load}>
                <Text style={{ color: BR.accent, fontSize: 13 }}>Reintentar →</Text>
              </Pressable>
            </View>
          )}

          {!loading && !error && shown.length === 0 && (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}>
              <Text style={{ color: BR.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
                Aún no hay historias.{'\n'}El ingester corre cada 30 min — deslizá para refrescar.
              </Text>
            </View>
          )}

          {!loading && !error && shown.slice(0, 10).map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BR.bg },
  masthead: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 22 },
  date: {
    fontFamily: 'SpaceMono', fontSize: 10, letterSpacing: 1.2,
    textTransform: 'uppercase', color: BR.textMuted, marginBottom: 8,
  },
  wordmark: { fontFamily: 'Newsreader_600SemiBold', fontSize: 36, letterSpacing: -1, color: BR.text },
  catStrip: {
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: BR.hairline,
    paddingVertical: 14, marginBottom: 6,
  },
  catItem: { fontSize: 13, color: BR.textMuted, letterSpacing: -0.1 },
  catItemActive: { color: BR.text, fontWeight: '500' },
  catUnderline: { height: 1, backgroundColor: BR.text, marginTop: 6 },
  sectionHeader: {
    paddingHorizontal: 24, paddingTop: 30, paddingBottom: 8,
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
  },
  sectionLabel: { fontFamily: 'Newsreader_500Medium', fontSize: 17, letterSpacing: -0.2, color: BR.text },
  sectionMeta: {
    fontFamily: 'SpaceMono', fontSize: 10, letterSpacing: 1,
    color: BR.textDim, textTransform: 'uppercase',
  },
});
