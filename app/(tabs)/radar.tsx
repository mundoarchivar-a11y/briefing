import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BR } from '../../lib/design';
import { TRENDING } from '../../lib/data';
import { RadarViz, Spark, SignalDot } from '../../components/Primitives';
import { Icon } from '../../components/Icon';

const { width } = Dimensions.get('window');

const RADAR_NODES = [
  { a: 25,  d: 0.92, c: BR.accent, l: 'Claude 5' },
  { a: 75,  d: 0.68, c: BR.info,   l: 'BCRA' },
  { a: 140, d: 0.7,  c: BR.cool,   l: 'Reforma' },
  { a: 195, d: 0.45, c: BR.pos,    l: 'NOAA' },
  { a: 260, d: 0.78, c: BR.alert,  l: 'Boca' },
  { a: 320, d: 0.55, c: BR.cool,   l: 'Spotify' },
];

const TIME_FILTERS = ['30m', '1h', '6h', '24h'];

export default function RadarScreen() {
  const [activeTime, setActiveTime] = useState(1);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.monoLabel}>· radar · live</Text>
            <Text style={s.title}>Qué está explotando</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6,
            paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999,
            backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline }}>
            <SignalDot color={BR.pos} size={5} />
            <Text style={{ fontFamily: 'SpaceMono', fontSize: 10, color: BR.textMuted }}>en vivo</Text>
          </View>
        </View>

        {/* Radar viz */}
        <View style={{ alignItems: 'center', paddingVertical: 14, paddingHorizontal: 22 }}>
          <RadarViz size={Math.min(width - 44, 300)} nodes={RADAR_NODES} />
          {/* Ring labels */}
          <View style={{ position: 'absolute', right: 22, top: 30, alignItems: 'flex-end', gap: 14 }}>
            {['30 min', '1 h', '3 h', '6 h'].map((t, i) => (
              <Text key={i} style={{ fontFamily: 'SpaceMono', fontSize: 9, color: BR.textDim }}>{t}</Text>
            ))}
          </View>
        </View>

        {/* Ranking */}
        <View style={{ paddingHorizontal: 22 }}>
          <Text style={[s.monoLabel, { marginBottom: 10 }]}>· Ranking — última hora</Text>
          <View style={{ gap: 6 }}>
            {TRENDING.map((t, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                style={[s.rankRow, i === 0 && { backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline, borderRadius: 12 }]}>
                <Text style={{ fontFamily: 'SpaceMono', fontSize: 11, color: BR.textDim, width: 20, textAlign: 'right' }}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <View style={{ width: 4, height: 24, borderRadius: 2, backgroundColor: t.c }} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: BR.text }}>{t.l}</Text>
                    {t.peak && <Icon name="flame" size={11} color={BR.accent} />}
                  </View>
                  <Text style={{ fontFamily: 'SpaceMono', fontSize: 10, color: BR.textDim, marginTop: 3, textTransform: 'uppercase' }}>
                    {t.cat} · {t.mentions} menciones
                  </Text>
                </View>
                <Spark values={t.spark} width={56} height={22} color={t.down ? BR.alert : t.c} strokeWidth={1.3} fill />
                <Text style={{
                  fontFamily: 'SpaceMono', fontSize: 11,
                  color: t.down ? BR.alert : BR.pos, width: 50, textAlign: 'right',
                }}>{t.delta}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Heatmap section */}
        <View style={{ paddingHorizontal: 18, marginTop: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <View>
              <Text style={s.monoLabel}>· tendencias</Text>
              <Text style={s.title}>Mapa térmico</Text>
            </View>
            {/* Time selector */}
            <View style={{ flexDirection: 'row', gap: 2, padding: 4, borderRadius: 999, backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline }}>
              {TIME_FILTERS.map((t, i) => (
                <TouchableOpacity key={t} onPress={() => setActiveTime(i)} activeOpacity={0.7}
                  style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: i === activeTime ? BR.text : 'transparent' }}>
                  <Text style={{ fontFamily: 'SpaceMono', fontSize: 11, color: i === activeTime ? BR.bg : BR.textMuted }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tile grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[
              { l: 'Claude 5',         m: '14.2k', d: '+218%', c: BR.accent, big: true },
              { l: 'Boca Juniors',     m: '12.4k', d: '+28%',  c: BR.alert },
              { l: 'Tasa BCRA',        m: '8.7k',  d: '+62%',  c: BR.info  },
              { l: 'Reforma laboral',  m: '6.1k',  d: '+44%',  c: BR.cool  },
              { l: 'Viento solar',     m: '3.9k',  d: '+38%',  c: BR.pos   },
              { l: 'Spotify radio',    m: '2.1k',  d: '−12%',  c: BR.cool, dim: true },
            ].map((t, i) => {
              const tileWidth = t.big ? width - 36 : (width - 44) / 2;
              return (
                <View key={i} style={{
                  width: tileWidth,
                  minHeight: t.big ? 130 : 90,
                  padding: t.big ? 18 : 14,
                  borderRadius: 14,
                  backgroundColor: t.dim ? BR.surface : 'transparent',
                  borderWidth: 1,
                  borderColor: t.dim ? BR.hairline : t.c + '40',
                  overflow: 'hidden',
                }}>
                  {!t.dim && (
                    <View style={[StyleSheet.absoluteFill, { borderRadius: 14, opacity: 0.18, backgroundColor: t.c }]} />
                  )}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: t.c }} />
                    <Text style={{ fontFamily: 'SpaceMono', fontSize: 10, color: t.c, textTransform: 'uppercase' }}>{t.m}</Text>
                  </View>
                  <Text style={{
                    fontSize: t.big ? 26 : 16, fontWeight: '400', color: BR.text,
                    marginTop: 8, lineHeight: t.big ? 30 : 22,
                  }}>{t.l}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <Icon name={t.d.startsWith('−') ? 'arrowDn' : 'arrowUp'} size={12} color={t.d.startsWith('−') ? BR.alert : BR.pos} />
                    <Text style={{
                      fontFamily: 'SpaceMono', fontSize: t.big ? 18 : 13, fontWeight: '600',
                      color: t.d.startsWith('−') ? BR.alert : t.c,
                    }}>{t.d}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Connections */}
          <View style={[s.connectionCard, { marginTop: 16 }]}>
            <Text style={[s.monoLabel, { marginBottom: 6 }]}>· Conexiones detectadas</Text>
            <Text style={{ fontSize: 13, color: BR.textMuted, lineHeight: 20 }}>
              <Text style={{ color: BR.accent }}>● Claude 5</Text> y <Text style={{ color: BR.info }}>● BCRA</Text> aparecen juntos en 31 historias — analistas vinculan eficiencia IA con menos presión inflacionaria.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BR.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 22, paddingTop: 10, paddingBottom: 12,
  },
  monoLabel: {
    fontFamily: 'SpaceMono', fontSize: 10, color: BR.accent,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4,
  },
  title: { fontSize: 28, fontWeight: '400', color: BR.text, lineHeight: 32 },
  rankRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 11, paddingHorizontal: 12,
  },
  connectionCard: {
    padding: 14, borderRadius: 14,
    backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
  },
});
