import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BR } from '../../lib/design';
import { ARTICLES } from '../../lib/data';
import { BriefingLogo, SourceStack } from '../../components/Primitives';
import { Icon } from '../../components/Icon';

type Variant = 'compact' | 'editorial';

export default function BriefingScreen() {
  const [variant, setVariant] = useState<Variant>('compact');

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Variant toggle */}
      <View style={s.variantRow}>
        {(['compact', 'editorial'] as Variant[]).map((v) => (
          <TouchableOpacity
            key={v}
            onPress={() => setVariant(v)}
            style={[s.variantBtn, variant === v && s.variantBtnActive]}
            activeOpacity={0.7}>
            <Text style={[s.variantText, { color: variant === v ? BR.bg : BR.textMuted }]}>
              {v === 'compact' ? 'Compacto' : 'Editorial'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {variant === 'compact' ? <CompactBriefing /> : <EditorialBriefing />}
    </SafeAreaView>
  );
}

function CompactBriefing() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 22, paddingTop: 8, paddingBottom: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <TouchableOpacity style={s.iconBtn}>
            <Icon name="chevR" size={16} color={BR.text} strokeWidth={2} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={s.iconBtn}>
              <Icon name="share" size={16} color={BR.text} />
            </TouchableOpacity>
            <TouchableOpacity style={s.listenBtn}>
              <Icon name="play" size={11} color={BR.bg} />
              <Text style={{ fontSize: 12, fontWeight: '600', color: BR.bg }}>Escuchar · 4:32</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={s.monoLabel}>· Briefing · mar 23 may</Text>
        <Text style={s.bigTitle}>
          Cinco historias{'\n'}para arrancar{'\n'}
          <Text style={{ fontStyle: 'italic', color: BR.accent }}>tu martes</Text>.
        </Text>
        <Text style={{ fontSize: 13, color: BR.textMuted, lineHeight: 20, marginTop: 14, maxWidth: 320 }}>
          Lo importante de las últimas 14 horas, deduplicado de 612 fuentes y priorizado para tu perfil.
        </Text>
      </View>

      {/* Numbered list */}
      <View style={{ paddingHorizontal: 22, gap: 16 }}>
        {ARTICLES.slice(0, 5).map((article, i) => (
          <View key={article.id} style={[s.articleRow, i < 4 && { borderBottomWidth: 1, borderBottomColor: BR.hairlineLo, paddingBottom: 16 }]}>
            {/* Number + read time */}
            <View style={{ width: 32, alignItems: 'center' }}>
              <Text style={[s.bigTitle, { fontSize: 22, color: BR.accent }]}>
                0{i + 1}
              </Text>
              <Text style={{ fontFamily: 'SpaceMono', fontSize: 9, color: BR.textDim, marginTop: 4, letterSpacing: 0.5 }}>
                {article.read.toUpperCase()}
              </Text>
            </View>

            {/* Content */}
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: article.catColor }} />
                <Text style={[s.monoLabel, { color: article.catColor, marginBottom: 0 }]}>{article.cat}</Text>
                <Text style={s.dimText}>· {article.src} fuentes</Text>
              </View>
              <Text style={s.articleHeadline}>{article.headline}</Text>
              <Text style={{ fontSize: 12.5, color: BR.textMuted, lineHeight: 20, marginTop: 6 }}>
                {article.summary}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <View style={s.ghostChip}>
                  <Icon name="layers" size={10} color={BR.textMuted} />
                  <Text style={s.ghostChipText}>{article.perspectives} ángulos</Text>
                </View>
                <View style={s.ghostChip}>
                  <Icon name="bolt" size={10} color={BR.accent} />
                  <Text style={s.ghostChipText}>Por qué importa</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function EditorialBriefing() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Cover header */}
      <View style={{ paddingHorizontal: 22, paddingTop: 14, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <BriefingLogo size={20} />
            <Text style={{ fontSize: 12, fontWeight: '500', color: BR.textMuted }}>El Briefing</Text>
          </View>
          <Text style={s.dimText}>VOL 142 · MAR 23 MAY 2026</Text>
        </View>

        {/* Editorial rule */}
        <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: BR.text, paddingVertical: 6, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: 'SpaceMono', fontSize: 11, color: BR.text }}>HOY · 5 HISTORIAS</Text>
          <Text style={{ fontFamily: 'SpaceMono', fontSize: 11, color: BR.text }}>LECTURA · 12 MIN</Text>
        </View>

        <Text style={[s.bigTitle, { fontSize: 48, lineHeight: 50, marginBottom: 18 }]}>
          El día que la <Text style={{ fontStyle: 'italic', color: BR.accent }}>IA</Text> firmó contratos sin pedir permiso.
        </Text>

        <Text style={{ fontSize: 13, color: BR.textMuted, lineHeight: 22 }}>
          Claude 5 razona durante ocho horas seguidas. El BCRA recorta y el peso aguanta. La reforma laboral pasa en general. Y por primera vez una tormenta solar amenaza al GPS de las flotas comerciales.
        </Text>
      </View>

      {/* Agenda timeline */}
      <View style={{ paddingHorizontal: 22, paddingBottom: 16 }}>
        <Text style={[s.dimText, { fontFamily: 'SpaceMono', fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }]}>
          · La agenda · 06:00 — 09:30
        </Text>
        {[
          { t: '06:42', who: 'Anthropic', what: 'Anuncio Claude 5 desde San Francisco', c: BR.accent },
          { t: '07:15', who: 'BCRA',      what: 'Comunicado de tasa — recorta al 28%',  c: BR.info },
          { t: '08:30', who: 'Diputados', what: 'Sesión por reforma laboral',           c: BR.cool },
          { t: '09:10', who: 'NOAA',      what: 'Alerta G3 viento solar',               c: BR.pos },
        ].map((row, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: BR.hairlineLo }}>
            <Text style={{ fontFamily: 'SpaceMono', fontSize: 13, color: BR.text, width: 52 }}>{row.t}</Text>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: row.c }} />
            <Text style={{ flex: 1, fontSize: 13, color: BR.text, lineHeight: 20 }}>
              <Text style={{ color: row.c }}>{row.who}</Text> · <Text style={{ color: BR.textMuted }}>{row.what}</Text>
            </Text>
          </View>
        ))}
      </View>

      {/* Por qué importa */}
      <View style={{ marginHorizontal: 18, marginBottom: 16, padding: 20, borderRadius: 16, backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline }}>
        <Text style={[s.monoLabel, { marginBottom: 10 }]}>· Por qué importa, hoy</Text>
        <Text style={{ fontSize: 17, fontWeight: '400', color: BR.text, lineHeight: 26, marginBottom: 14 }}>
          Tres de las cinco historias del día empujan a la misma dirección:{' '}
          <Text style={{ color: BR.accent, fontStyle: 'italic' }}>la economía está aprendiendo a operar con menos humanos al volante</Text>.
        </Text>
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {['↗ Profundizar', '↗ Otras lecturas', '↗ Audio · 4:32'].map((l, i) => (
            <View key={i} style={s.ghostChip}>
              <Text style={s.ghostChipText}>{l}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BR.bg },
  variantRow: {
    flexDirection: 'row', gap: 4, margin: 18, padding: 4,
    borderRadius: 14, backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
  },
  variantBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
  },
  variantBtnActive: { backgroundColor: BR.text },
  variantText: { fontSize: 13, fontWeight: '500' },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
    alignItems: 'center', justifyContent: 'center',
  },
  listenBtn: {
    height: 36, paddingHorizontal: 14, borderRadius: 18,
    backgroundColor: BR.accent, flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  monoLabel: {
    fontFamily: 'SpaceMono', fontSize: 10, color: BR.accent,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8,
  },
  dimText: { fontFamily: 'SpaceMono', fontSize: 10, color: BR.textDim },
  bigTitle: {
    fontSize: 30, fontWeight: '400', color: BR.text, lineHeight: 36, letterSpacing: -0.4,
  },
  articleRow: { flexDirection: 'row' },
  articleHeadline: {
    fontSize: 16, fontWeight: '400', color: BR.text, lineHeight: 22, letterSpacing: -0.2,
  },
  ghostChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999,
    backgroundColor: 'transparent', borderWidth: 1, borderColor: BR.hairlineLo,
  },
  ghostChipText: { fontSize: 11, fontWeight: '500', color: BR.textMuted },
});
