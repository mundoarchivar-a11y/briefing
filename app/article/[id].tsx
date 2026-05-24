import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { BR, sparkSeed } from '../../lib/design';
import { ARTICLES } from '../../lib/data';
import { Photo, SourceStack, Spark } from '../../components/Primitives';
import { Icon } from '../../components/Icon';

const { width } = Dimensions.get('window');

const PERSPECTIVES = [
  {
    src: 'Reuters', bias: 'Neutral', bg: '#7aa9e6', tone: BR.info,
    blurb: '"El anuncio acelera la consolidación del mercado de modelos de uso prolongado." Reporte técnico, sin proyección.',
  },
  {
    src: 'Bloomberg', bias: 'Mercados', bg: '#5fc081', tone: BR.pos,
    blurb: 'Foco en compresión de márgenes BPO en India. Lectura financiera, atribuye el rally tech a la noticia.', up: true,
  },
  {
    src: 'The Verge', bias: 'Crítico tech', bg: '#a994f0', tone: BR.cool,
    blurb: 'Cuestiona el benchmark de "8 horas" y la falta de auditoría externa. Advierte sobre concentración.',
  },
];

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = ARTICLES.find(a => a.id === id) || ARTICLES[0];

  return (
    <View style={{ flex: 1, backgroundColor: BR.bg }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* Nav */}
        <View style={s.nav}>
          <TouchableOpacity style={s.iconBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Icon name="chevR" size={16} color={BR.text} strokeWidth={2} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={s.iconBtn} activeOpacity={0.8}>
              <Icon name="bookmark" size={16} color={BR.text} />
            </TouchableOpacity>
            <TouchableOpacity style={s.iconBtn} activeOpacity={0.8}>
              <Icon name="share" size={16} color={BR.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Hero image */}
          <View style={{ paddingHorizontal: 22, paddingTop: 10, paddingBottom: 8 }}>
            <Photo tone={article.photo as any} height={200} radius={14} />
          </View>

          {/* Metadata + title */}
          <View style={{ paddingHorizontal: 22, paddingBottom: 14 }}>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <View style={[s.chip, { backgroundColor: BR.accentSoft, borderColor: BR.accentLine }]}>
                <Text style={[s.chipText, { color: BR.accent }]}>{article.cat}</Text>
              </View>
              <View style={s.chip}>
                <Text style={s.chipText}>{article.time}</Text>
              </View>
              <View style={s.chip}>
                <Icon name="clock" size={10} color={BR.textMuted} />
                <Text style={s.chipText}>{article.read}</Text>
              </View>
            </View>
            <Text style={s.headline}>{article.headline}</Text>
          </View>

          {/* AI summary */}
          <View style={[s.aiBox, { marginHorizontal: 18, marginBottom: 18 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Icon name="sparkles" size={14} color={BR.accent} />
              <Text style={[s.monoLabel, { marginBottom: 0 }]}>RESUMEN · 30 SEG</Text>
              <View style={{ flex: 1 }} />
              <View style={s.chip}>
                <Text style={s.chipText}>{article.src} fuentes</Text>
              </View>
            </View>
            {[
              'Claude 5 mantiene contexto coherente durante 8 horas y ejecuta acciones encadenadas sin supervisión humana.',
              'Mural, Auth0 y Mercado Pago confirmaron pruebas internas; 14 startups argentinas migrando su stack.',
              'Costo por millón de tokens cae 38%. Anthropic apunta a desplazar trabajos de oficina rutinarios.',
            ].map((bullet, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                <Text style={{ fontFamily: 'SpaceMono', fontSize: 11, color: BR.accent, lineHeight: 22 }}>·</Text>
                <Text style={{ flex: 1, fontSize: 13, color: BR.textMuted, lineHeight: 22 }}>{bullet}</Text>
              </View>
            ))}
          </View>

          {/* Perspectives */}
          <View style={{ paddingHorizontal: 22, paddingBottom: 14 }}>
            <Text style={[s.sectionLabel, { marginBottom: 12 }]}>· Perspectivas · 3 ángulos</Text>
            <View style={{ gap: 8 }}>
              {PERSPECTIVES.map((p, i) => (
                <View key={i} style={s.perspCard}>
                  <View style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    backgroundColor: p.bg + '33', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: p.tone }}>{p.src[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: BR.text }}>{p.src}</Text>
                      <View style={[s.chip, { borderColor: p.tone + '40', paddingVertical: 2, paddingHorizontal: 6 }]}>
                        <Text style={[s.chipText, { color: p.tone, fontSize: 9 }]}>{p.bias}</Text>
                      </View>
                      {p.up && <Icon name="trend" size={11} color={BR.pos} />}
                    </View>
                    <Text style={{ fontSize: 12, color: BR.textMuted, lineHeight: 20 }}>{p.blurb}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Trend chart */}
          <View style={[s.aiBox, { marginHorizontal: 18, marginBottom: 20 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={s.sectionLabel}>· Menciones · 24h</Text>
              <Text style={{ fontFamily: 'SpaceMono', fontSize: 13, fontWeight: '600', color: BR.pos }}>+218%</Text>
            </View>
            <Spark
              values={sparkSeed(2, 28, 0.2, 0.7)}
              width={width - 68}
              height={56}
              color={BR.accent}
              strokeWidth={1.6}
              fill
            />
          </View>
        </ScrollView>

        {/* Floating ask bar */}
        <View style={s.askBar}>
          <Icon name="sparkles" size={16} color={BR.accent} />
          <Text style={{ flex: 1, fontSize: 13, color: BR.textMuted }}>Preguntar sobre esta historia…</Text>
          <Icon name="mic" size={16} color={BR.textMuted} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  nav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 6, paddingBottom: 4,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
    alignItems: 'center', justifyContent: 'center',
  },
  headline: {
    fontSize: 24, fontWeight: '400', color: BR.text,
    lineHeight: 30, letterSpacing: -0.3,
  },
  monoLabel: {
    fontFamily: 'SpaceMono', fontSize: 10, color: BR.accent,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4,
  },
  sectionLabel: {
    fontFamily: 'SpaceMono', fontSize: 10, color: BR.textDim,
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999,
    backgroundColor: BR.subtle, borderWidth: 1, borderColor: BR.hairlineLo,
  },
  chipText: {
    fontFamily: 'SpaceMono', fontSize: 11, color: BR.textMuted,
  },
  aiBox: {
    padding: 16, borderRadius: 14,
    backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
  },
  perspCard: {
    flexDirection: 'row', gap: 12, padding: 14,
    borderRadius: 12, backgroundColor: BR.surface,
    borderWidth: 1, borderColor: BR.hairline,
  },
  askBar: {
    position: 'absolute', left: 16, right: 16, bottom: 30,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 999, backgroundColor: 'rgba(20,20,24,0.95)',
    borderWidth: 1, borderColor: BR.hairline,
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 20,
  },
});
