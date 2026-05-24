// app/index.tsx — Onboarding flow (4 steps), connected to global store.
// Step 2 allows both predefined + fully custom interests.

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BR } from '../lib/design';
import { PREDEFINED_INTERESTS } from '../lib/interests';
import { useStore } from '../lib/store';
import { BriefingLogo, RadarViz } from '../components/Primitives';
import { InterestInput } from '../components/InterestInput';
import { Icon } from '../components/Icon';

type Step = 'welcome' | 'interests' | 'sources' | 'ready';

const SOURCES = [
  { l: 'La Nación',       bias: 'centro-derecha',   tone: BR.cool  },
  { l: 'Página/12',       bias: 'centro-izquierda', tone: BR.cool  },
  { l: 'Infobae',         bias: 'centro',           tone: BR.cool  },
  { l: 'Bloomberg',       bias: 'mercados',         tone: BR.info  },
  { l: 'Reuters',         bias: 'neutral',          tone: BR.info  },
  { l: 'The Verge',       bias: 'tech',             tone: BR.cool  },
  { l: 'Financial Times', bias: 'mercados',         tone: BR.info  },
];

// Predefined shown in onboarding (curated subset)
const ONBOARDING_PREDEFINED = PREDEFINED_INTERESTS.filter(i => [
  'ia-tech', 'mercados', 'politica-ar', 'clima', 'ciencia',
  'gaming', 'cultura', 'deportes', 'startups', 'salud',
  'cine-series', 'local-caba', 'geopolitica', 'crypto', 'espacio', 'musica',
].includes(i.id));

// ─── Step 1: Welcome ─────────────────────────────────────────
function WelcomeScreen({ onNext }: { onNext: () => void }) {
  const { prefs } = useStore();
  // If already onboarded, redirect
  React.useEffect(() => {
    if (prefs.onboarded) router.replace('/(tabs)');
  }, [prefs.onboarded]);

  return (
    <View style={s.screen}>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', opacity: 0.3 }]}>
        <RadarViz size={340} />
      </View>
      <View style={s.logoRow}>
        <BriefingLogo size={26} />
        <Text style={s.wordmark}>Briefing<Text style={{ color: BR.accent }}>.</Text></Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={s.labelMono}>· COPILOTO DE INFORMACIÓN</Text>
        <Text style={s.heroTitle}>
          La actualidad,{'\n'}
          <Text style={{ fontStyle: 'italic', color: BR.accent }}>sin ruido</Text>.
        </Text>
        <Text style={s.heroSub}>
          Seguí exactamente lo que te importa — desde{'\n'}IA y mercados hasta recetas y astrología.{'\n'}
          Tu radar, tus reglas.
        </Text>
      </View>
      <View style={{ gap: 10, paddingBottom: 8 }}>
        <TouchableOpacity style={s.btnPrimary} onPress={onNext} activeOpacity={0.8}>
          <Text style={s.btnPrimaryText}>Empezar</Text>
          <Icon name="arrow" size={16} color={BR.bg} />
        </TouchableOpacity>
        <TouchableOpacity
          style={s.btnGhost}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.7}>
          <Text style={{ color: BR.textMuted, fontSize: 13, fontWeight: '500' }}>Ya tengo cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Step 2: Interests (predefined + custom free-text) ───────
function InterestsScreen({ onNext }: { onNext: () => void }) {
  const { prefs, isSelected, togglePredefined, addCustom } = useStore();
  const selectedLabels = prefs.interests.map(i => i.label);
  const customCount = prefs.interests.filter(i => i.source === 'custom').length;

  return (
    <View style={s.screen}>
      <ProgressHeader step={2} total={4} />
      <Text style={s.labelMono}>· paso 2 de 4</Text>
      <Text style={[s.screenTitle, { marginBottom: 4 }]}>¿Qué querés{'\n'}seguir?</Text>
      <Text style={{ color: BR.textMuted, fontSize: 13, lineHeight: 20, marginBottom: 14 }}>
        Elegí categorías o escribí cualquier tema — recetas, astrología, física cuántica, lo que sea.
      </Text>

      {/* Custom input — always on top */}
      <View style={{ marginBottom: 14 }}>
        <InterestInput
          onAdd={addCustom}
          selectedLabels={selectedLabels}
          placeholder="Escribí cualquier tema…"
        />
        {customCount > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {prefs.interests.filter(i => i.source === 'custom').map(it => (
              <View key={it.id} style={[s.customBadge, { borderColor: it.color + '60' }]}>
                {it.emoji && <Text style={{ fontSize: 13 }}>{it.emoji}</Text>}
                <Text style={{ fontSize: 12, fontWeight: '600', color: it.color }}>{it.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <Text style={[s.labelMono, { marginBottom: 10 }]}>· O elegí de estas categorías</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {ONBOARDING_PREDEFINED.map((it) => {
            const sel = isSelected(it.id);
            return (
              <TouchableOpacity
                key={it.id}
                onPress={() => togglePredefined(it.id)}
                activeOpacity={0.8}
                style={[s.chip, sel && s.chipActive]}>
                <Text style={{ fontSize: 14 }}>{it.emoji}</Text>
                <Text style={[s.chipText, { color: sel ? BR.bg : BR.text }]}>{it.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ height: 90 }} />
      </ScrollView>

      <View style={s.footer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontFamily: 'SpaceMono', fontSize: 11, color: BR.textDim }}>
            {prefs.interests.length} seleccionados
          </Text>
          {prefs.interests.length >= 1 && (
            <Text style={{ fontFamily: 'SpaceMono', fontSize: 11, color: BR.pos }}>✓</Text>
          )}
        </View>
        <TouchableOpacity
          style={[s.btnAccent, prefs.interests.length === 0 && { opacity: 0.45 }]}
          onPress={prefs.interests.length > 0 ? onNext : undefined}
          activeOpacity={0.8}>
          <Text style={s.btnAccentText}>Continuar</Text>
          <Icon name="arrow" size={16} color={BR.bg} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Step 3: Sources ─────────────────────────────────────────
function SourcesScreen({ onNext }: { onNext: () => void }) {
  const [sources, setSources] = useState(SOURCES.map(s => ({ ...s, on: true })));
  const toggle = (i: number) =>
    setSources(prev => prev.map((s, idx) => idx === i ? { ...s, on: !s.on } : s));

  return (
    <View style={s.screen}>
      <ProgressHeader step={3} total={4} />
      <Text style={s.labelMono}>· paso 3 de 4</Text>
      <Text style={[s.screenTitle, { marginBottom: 6 }]}>Calibrá tus{'\n'}perspectivas.</Text>
      <Text style={{ color: BR.textMuted, fontSize: 13, lineHeight: 20, marginBottom: 16 }}>
        Elegí tus fuentes. Briefing siempre buscará equilibrio entre distintos enfoques.
      </Text>

      {/* Bias slider */}
      <View style={[s.card, { marginBottom: 16 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
          <Text style={{ fontFamily: 'SpaceMono', fontSize: 10, color: BR.textDim }}>UNA VISIÓN</Text>
          <Text style={{ fontFamily: 'SpaceMono', fontSize: 10, color: BR.accent }}>EQUILIBRADO</Text>
          <Text style={{ fontFamily: 'SpaceMono', fontSize: 10, color: BR.textDim }}>DIVERSO</Text>
        </View>
        <View style={{ height: 6, borderRadius: 3, backgroundColor: BR.subtle }}>
          <LinearGradient
            colors={[BR.info, BR.accent, BR.cool]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ width: '60%', height: 6, borderRadius: 3 }}
          />
          <View style={{ position: 'absolute', left: '60%', top: -6, marginLeft: -9,
            width: 18, height: 18, borderRadius: 9, backgroundColor: BR.text,
            borderWidth: 3, borderColor: BR.bg }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ gap: 8 }}>
          {sources.map((src, i) => (
            <View key={i} style={[s.card, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: src.tone + '22', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: src.tone }}>
                  {src.l.split(' ').map(w => w[0]).slice(0, 2).join('')}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: BR.text }}>{src.l}</Text>
                <Text style={{ fontFamily: 'SpaceMono', fontSize: 10, color: BR.textDim, marginTop: 2, textTransform: 'uppercase' }}>{src.bias}</Text>
              </View>
              <TouchableOpacity onPress={() => toggle(i)} activeOpacity={0.8}
                style={{ width: 38, height: 22, borderRadius: 11, backgroundColor: src.on ? BR.accent : BR.subtle }}>
                <View style={{ position: 'absolute', top: 2, left: src.on ? 18 : 2, width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff' }} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity style={s.btnAccent} onPress={onNext} activeOpacity={0.8}>
          <Text style={s.btnAccentText}>Continuar</Text>
          <Icon name="arrow" size={16} color={BR.bg} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Step 4: Ready ───────────────────────────────────────────
function ReadyScreen({ onFinish }: { onFinish: () => void }) {
  const { prefs } = useStore();
  const topInterests = prefs.interests.slice(0, 3);

  return (
    <View style={[s.screen, { alignItems: 'center', justifyContent: 'center' }]}>
      <View style={{ width: 90, height: 90, alignItems: 'center', justifyContent: 'center', marginBottom: 36 }}>
        {[0, 1, 2].map(i => (
          <View key={i} style={{ position: 'absolute', width: 90 + (i + 1) * 30, height: 90 + (i + 1) * 30, borderRadius: 999, borderWidth: 1, borderColor: BR.accentLine, opacity: 0.3 - i * 0.08 }} />
        ))}
        <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="sparkles" size={36} color={BR.accent} strokeWidth={1.4} />
        </View>
      </View>

      <Text style={s.labelMono}>· Sintetizando tu radar</Text>
      <Text style={[s.screenTitle, { textAlign: 'center', marginBottom: 8 }]}>
        Calibrando{'\n'}tu copiloto.
      </Text>

      {/* Show user's actual interests */}
      {topInterests.length > 0 && (
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
          {prefs.interests.slice(0, 5).map(it => (
            <View key={it.id} style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: it.color + '20', borderWidth: 1, borderColor: it.color + '40' }}>
              {it.emoji && <Text style={{ fontSize: 12 }}>{it.emoji} </Text>}
              <Text style={{ fontSize: 12, color: it.color, fontWeight: '500' }}>{it.label}</Text>
            </View>
          ))}
          {prefs.interests.length > 5 && (
            <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: BR.surface }}>
              <Text style={{ fontSize: 12, color: BR.textMuted }}>+{prefs.interests.length - 5} más</Text>
            </View>
          )}
        </View>
      )}

      <View style={{ width: '100%', maxWidth: 280 }}>
        <View style={{ height: 4, borderRadius: 2, backgroundColor: BR.subtle, overflow: 'hidden', marginBottom: 16 }}>
          <LinearGradient colors={[BR.accent, BR.alert]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '82%', height: 4 }} />
        </View>
        <View style={{ gap: 8 }}>
          {[
            { t: '✓ Conectando fuentes', v: '612', done: true },
            { t: '✓ Calibrando radar personalizado', v: prefs.interests.length + ' temas', done: true },
            { t: '  Generando briefing inicial', v: '82%', active: true },
            { t: '  Detectando tendencias', v: '—', dim: true },
          ].map((row, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: 'SpaceMono', fontSize: 12, color: row.dim ? BR.textFaint : BR.textMuted }}>{row.t}</Text>
              <Text style={{ fontFamily: 'SpaceMono', fontSize: 12, color: row.active ? BR.accent : BR.textDim }}>{row.v}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ flex: 0.2 }} />
      <TouchableOpacity style={[s.btnPrimary, { width: '100%' }]} onPress={onFinish} activeOpacity={0.8}>
        <Text style={s.btnPrimaryText}>Abrir mi briefing</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Shared: progress header ──────────────────────────────────
function ProgressHeader({ step, total }: { step: number; total: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 22 }}>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={{ width: 32, height: 3, borderRadius: 2, backgroundColor: i < step ? BR.accent : BR.subtle }} />
        ))}
      </View>
    </View>
  );
}

// ─── Main flow ───────────────────────────────────────────────
export default function OnboardingScreen() {
  const { completeOnboarding } = useStore();
  const [step, setStep] = useState<Step>('welcome');

  const next = () => {
    const steps: Step[] = ['welcome', 'interests', 'sources', 'ready'];
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };

  const finish = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BR.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: 20, paddingBottom: 20 }}>
        {step === 'welcome'   && <WelcomeScreen   onNext={next} />}
        {step === 'interests' && <InterestsScreen onNext={next} />}
        {step === 'sources'   && <SourcesScreen   onNext={next} />}
        {step === 'ready'     && <ReadyScreen     onFinish={finish} />}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: { flex: 1 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 0 },
  wordmark: { fontSize: 18, fontWeight: '600', color: BR.text, letterSpacing: -0.4 },
  labelMono: { fontFamily: 'SpaceMono', fontSize: 10, color: BR.accent, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  heroTitle: { fontSize: 38, fontWeight: '400', color: BR.text, lineHeight: 44, marginBottom: 18, textAlign: 'center', letterSpacing: -0.8 },
  heroSub: { fontSize: 14, color: BR.textMuted, lineHeight: 22, textAlign: 'center', maxWidth: 280 },
  screenTitle: { fontSize: 28, fontWeight: '400', color: BR.text, lineHeight: 34, letterSpacing: -0.4 },
  card: { padding: 16, borderRadius: 16, backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline },
  chipActive: { backgroundColor: BR.text, borderColor: BR.text },
  chipText: { fontSize: 14, fontWeight: '500' },
  customBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: BR.surface, borderWidth: 1 },
  btnPrimary: { height: 52, borderRadius: 14, backgroundColor: BR.text, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnPrimaryText: { fontSize: 15, fontWeight: '600', color: BR.bg },
  btnGhost: { height: 48, alignItems: 'center', justifyContent: 'center' },
  btnAccent: { height: 52, borderRadius: 14, backgroundColor: BR.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnAccentText: { fontSize: 15, fontWeight: '600', color: BR.bg },
  footer: { paddingTop: 20, paddingBottom: 8 },
});
