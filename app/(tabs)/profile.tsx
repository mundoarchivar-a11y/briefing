import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BR, sparkSeed } from '../../lib/design';
import { Spark } from '../../components/Primitives';
import { Icon } from '../../components/Icon';
import { useStore } from '../../lib/store';

const SETTINGS = [
  { i: 'bell',     l: 'Notificaciones', d: '3 por día · 7:00 / 13:00 / 19:00' },
  { i: 'layers',   l: 'Perspectivas',   d: 'Equilibrado' },
  { i: 'globe',    l: 'Idiomas',        d: 'ES · AR + intl' },
  { i: 'eye',      l: 'Modo lectura',   d: 'Foco · 16pt' },
  { i: 'settings', l: 'Ajustes',        d: '' },
];

export default function ProfileScreen() {
  const { prefs } = useStore();
  const interests = prefs.interests;
  const customCount = interests.filter(i => i.source === 'custom').length;
  const predefinedCount = interests.filter(i => i.source === 'predefined').length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Header */}
        <View style={{ paddingHorizontal: 22, paddingTop: 6, paddingBottom: 18 }}>
          <Text style={s.monoLabel}>· tu radar</Text>
          <Text style={s.pageTitle}>Tomás Iturri</Text>
          <Text style={{ fontSize: 13, color: BR.textMuted, marginTop: 4 }}>
            Periodista · Suscriptor desde mar 2026
          </Text>
        </View>

        {/* Stats card */}
        <View style={[s.card, { marginHorizontal: 18, marginBottom: 18 }]}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[
              { l: 'Historias leídas', v: '1.4k', c: BR.text },
              { l: 'Esta semana',      v: '83',   c: BR.accent },
              { l: 'Foco %',           v: '67%',  c: BR.pos },
            ].map((stat, i) => (
              <View key={i} style={{ flex: 1 }}>
                <Text style={{ fontSize: 28, fontWeight: '400', color: stat.c, marginBottom: 4 }}>{stat.v}</Text>
                <Text style={{ fontFamily: 'SpaceMono', fontSize: 9, color: BR.textDim, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {stat.l}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: BR.hairlineLo, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Spark values={sparkSeed(1, 24, 0.4, 0.5)} width={120} height={24} color={BR.accent} fill />
            <Text style={{ fontSize: 11, color: BR.textMuted, flex: 1, lineHeight: 16 }}>
              Tu atención sube los martes. Briefing está ajustando el horario de notificaciones.
            </Text>
          </View>
        </View>

        {/* Interests section */}
        <View style={{ paddingHorizontal: 18, marginBottom: 18 }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/interests')}
            style={s.interestsBanner}>
            <View style={{ flex: 1 }}>
              <Text style={s.sectionLabel}>· Mis intereses</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <View style={s.countPill}>
                  <Text style={{ fontFamily: 'SpaceMono', fontSize: 10, color: BR.accent }}>
                    {predefinedCount} categorías
                  </Text>
                </View>
                {customCount > 0 && (
                  <View style={[s.countPill, { backgroundColor: BR.accentSoft, borderColor: BR.accentLine }]}>
                    <Text style={{ fontFamily: 'SpaceMono', fontSize: 10, color: BR.accent }}>
                      {customCount} personalizados
                    </Text>
                  </View>
                )}
              </View>
              {interests.length === 0 ? (
                <Text style={{ fontSize: 13, color: BR.textDim, marginTop: 8 }}>
                  Añadí temas a tu radar para personalizar Briefing.
                </Text>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {interests.slice(0, 8).map(it => (
                    <View key={it.id} style={[s.interestTag, { borderColor: it.color + '40', backgroundColor: it.color + '14' }]}>
                      {it.emoji && <Text style={{ fontSize: 11 }}>{it.emoji}</Text>}
                      <Text style={{ fontSize: 11, color: BR.text, fontWeight: '500' }}>{it.label}</Text>
                    </View>
                  ))}
                  {interests.length > 8 && (
                    <View style={s.interestTag}>
                      <Text style={{ fontSize: 11, color: BR.textMuted }}>+{interests.length - 8} más</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
            <View style={s.editBtn}>
              <Icon name="chevR" size={14} color={BR.accent} strokeWidth={2} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Radar calibration */}
        {interests.length > 0 && (
          <View style={{ paddingHorizontal: 22, marginBottom: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <Text style={s.sectionLabel}>· Peso de cada interés</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/interests')}>
                <Text style={{ fontSize: 11, fontWeight: '500', color: BR.accent }}>Recalibrar</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 12 }}>
              {[...interests].sort((a, b) => b.weight - a.weight).slice(0, 6).map((it) => (
                <View key={it.id}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    {it.emoji ? (
                      <Text style={{ fontSize: 12 }}>{it.emoji}</Text>
                    ) : (
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: it.color }} />
                    )}
                    <Text style={{ fontSize: 13, fontWeight: '500', color: BR.text, flex: 1 }}>{it.label}</Text>
                    <Text style={{ fontFamily: 'SpaceMono', fontSize: 11, color: BR.textDim }}>{it.weight}%</Text>
                  </View>
                  <View style={{ height: 5, borderRadius: 3, backgroundColor: BR.subtle, overflow: 'hidden' }}>
                    <View style={{ height: 5, width: `${it.weight}%`, backgroundColor: it.color, opacity: 0.7, borderRadius: 3 }} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Settings list */}
        <View style={{ paddingHorizontal: 18 }}>
          <View style={{ borderRadius: 14, backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline, overflow: 'hidden' }}>
            {SETTINGS.map((row, i) => (
              <TouchableOpacity key={i} activeOpacity={0.8}
                style={[s.settingsRow, i < SETTINGS.length - 1 && { borderBottomWidth: 1, borderBottomColor: BR.hairlineLo }]}>
                <Icon name={row.i} size={18} color={BR.textMuted} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: BR.text }}>{row.l}</Text>
                  {row.d && (
                    <Text style={{ fontFamily: 'SpaceMono', fontSize: 11, color: BR.textDim, marginTop: 4 }}>{row.d}</Text>
                  )}
                </View>
                <Icon name="chevR" size={14} color={BR.textDim} />
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
  sectionLabel: {
    fontFamily: 'SpaceMono', fontSize: 10, color: BR.textDim,
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
  pageTitle: { fontSize: 28, fontWeight: '400', color: BR.text, lineHeight: 34 },
  card: {
    padding: 18, borderRadius: 16,
    backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
  },
  interestsBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 16, borderRadius: 16,
    backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
  },
  countPill: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999,
    backgroundColor: BR.subtle, borderWidth: 1, borderColor: BR.hairline,
  },
  interestTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999,
    backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
  },
  editBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: BR.accentSoft, borderWidth: 1, borderColor: BR.accentLine,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 2,
  },
  settingsRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingHorizontal: 16,
  },
});
