// app/interests.tsx
// Full-featured interests management — predefined topics + unlimited custom ones.
// Users can add anything: "Recetas", "Astrología", "Física Cuántica", etc.

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BR } from '../lib/design';
import { PREDEFINED_INTERESTS } from '../lib/interests';
import { useStore } from '../lib/store';
import { InterestInput } from '../components/InterestInput';
import { Icon } from '../components/Icon';

const { width } = Dimensions.get('window');

// Category groups for predefined browser
const GROUPS = [
  {
    label: 'Tecnología',
    ids: ['ia-tech', 'ciencia', 'espacio', 'startups', 'programacion'],
  },
  {
    label: 'Economía & Finanzas',
    ids: ['mercados', 'crypto', 'negocios'],
  },
  {
    label: 'Política & Sociedad',
    ids: ['politica-ar', 'geopolitica', 'local-caba'],
  },
  {
    label: 'Bienestar & Naturaleza',
    ids: ['clima', 'salud'],
  },
  {
    label: 'Cultura & Entretenimiento',
    ids: ['cultura', 'cine-series', 'gaming', 'musica'],
  },
  {
    label: 'Deportes',
    ids: ['deportes'],
  },
];

export default function InterestsScreen() {
  const { prefs, isSelected, togglePredefined, addCustom, removeInterest, updateWeight } = useStore();
  const [tab, setTab] = useState<'mis' | 'explorar'>('mis');
  const [showWeights, setShowWeights] = useState(false);

  const customInterests = prefs.interests.filter(i => i.source === 'custom');
  const selectedLabels = prefs.interests.map(i => i.label);

  const handleRemove = (id: string, label: string) => {
    Alert.alert(
      'Eliminar interés',
      `¿Querés quitar "${label}" de tu radar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => removeInterest(id) },
      ]
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Nav */}
      <View style={s.nav}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Icon name="chevR" size={16} color={BR.text} strokeWidth={2} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={s.navTitle}>Mis intereses</Text>
        </View>
        <TouchableOpacity onPress={() => setShowWeights(!showWeights)} activeOpacity={0.8}
          style={[s.weightToggle, showWeights && s.weightToggleActive]}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: showWeights ? BR.bg : BR.textMuted }}>
            Pesos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={s.tabBar}>
        {(['mis', 'explorar'] as const).map(t => (
          <TouchableOpacity key={t} style={[s.tabBtn, tab === t && s.tabBtnActive]}
            onPress={() => setTab(t)} activeOpacity={0.8}>
            <Text style={[s.tabText, { color: tab === t ? BR.bg : BR.textMuted }]}>
              {t === 'mis' ? `Mis temas · ${prefs.interests.length}` : 'Explorar todos'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'mis' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Add custom topic */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>· Añadir tema libre</Text>
            <InterestInput
              onAdd={addCustom}
              selectedLabels={selectedLabels}
            />
          </View>

          {/* Custom topics */}
          {customInterests.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionLabel}>· Tus temas personalizados · {customInterests.length}</Text>
              <View style={s.chipWrap}>
                {customInterests.map(it => (
                  <InterestChip
                    key={it.id}
                    interest={it}
                    onRemove={() => handleRemove(it.id, it.label)}
                    showWeight={showWeights}
                    onWeightChange={(w) => updateWeight(it.id, w)}
                    isCustom
                  />
                ))}
              </View>
            </View>
          )}

          {/* Selected predefined */}
          {prefs.interests.filter(i => i.source === 'predefined').length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionLabel}>· Categorías activas</Text>
              <View style={s.chipWrap}>
                {prefs.interests.filter(i => i.source === 'predefined').map(it => (
                  <InterestChip
                    key={it.id}
                    interest={it}
                    onRemove={() => removeInterest(it.id)}
                    showWeight={showWeights}
                    onWeightChange={(w) => updateWeight(it.id, w)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Weight bars when enabled */}
          {showWeights && prefs.interests.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionLabel}>· Calibración del radar</Text>
              <View style={{ gap: 14 }}>
                {[...prefs.interests].sort((a, b) => b.weight - a.weight).map(it => (
                  <WeightRow key={it.id} interest={it} onWeightChange={(w) => updateWeight(it.id, w)} />
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Search / add custom at top of explore */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>· Buscá cualquier tema</Text>
            <InterestInput
              onAdd={addCustom}
              selectedLabels={selectedLabels}
              placeholder="Ej: recetas, astrología, física cuántica…"
            />
            <Text style={{ fontSize: 12, color: BR.textDim, marginTop: 8, lineHeight: 18 }}>
              Podés añadir cualquier tema que quieras. Briefing lo rastreará y te traerá lo más relevante de internet.
            </Text>
          </View>

          {/* Browse by group */}
          {GROUPS.map(group => {
            const items = PREDEFINED_INTERESTS.filter(i => group.ids.includes(i.id));
            if (items.length === 0) return null;
            return (
              <View key={group.label} style={s.section}>
                <Text style={s.sectionLabel}>· {group.label}</Text>
                <View style={s.chipWrap}>
                  {items.map(it => {
                    const sel = isSelected(it.id);
                    return (
                      <TouchableOpacity
                        key={it.id}
                        onPress={() => togglePredefined(it.id)}
                        activeOpacity={0.8}
                        style={[s.browseChip, sel && s.browseChipActive]}>
                        <Text style={{ fontSize: 16 }}>{it.emoji}</Text>
                        <Text style={[s.browseChipText, { color: sel ? BR.bg : BR.text }]}>
                          {it.label}
                        </Text>
                        {sel && <Icon name="check" size={14} color={BR.bg} strokeWidth={2.2} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}

          {/* Inspiration for custom topics */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>· Ideas para tu radar personalizado</Text>
            <View style={s.inspoGrid}>
              {[
                { emoji: '🍳', label: 'Recetas' },
                { emoji: '⭐', label: 'Astrología' },
                { emoji: '⚛️', label: 'Física Cuántica' },
                { emoji: '🧠', label: 'Psicología' },
                { emoji: '📚', label: 'Literatura' },
                { emoji: '🔭', label: 'Astronomía' },
                { emoji: '🧘', label: 'Meditación' },
                { emoji: '🍷', label: 'Sommelier' },
                { emoji: '🧬', label: 'Biohacking' },
                { emoji: '🎨', label: 'Diseño' },
                { emoji: '✈️', label: 'Viajes' },
                { emoji: '🔐', label: 'Criptografía' },
              ].filter(s => !selectedLabels.some(l => l.toLowerCase().includes(s.label.toLowerCase()))).map((sug, i) => (
                <TouchableOpacity key={i} style={s.inspoChip} onPress={() => addCustom(sug.label)} activeOpacity={0.8}>
                  <Text style={{ fontSize: 20 }}>{sug.emoji}</Text>
                  <Text style={{ fontSize: 12, color: BR.textMuted, marginTop: 4 }}>{sug.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── Interest chip with optional remove + weight ─────────────
function InterestChip({
  interest, onRemove, isCustom = false,
  showWeight, onWeightChange,
}: {
  interest: { id: string; label: string; color: string; weight: number; emoji?: string };
  onRemove: () => void;
  isCustom?: boolean;
  showWeight: boolean;
  onWeightChange: (w: number) => void;
}) {
  return (
    <View style={[s.activeChip, { borderColor: interest.color + '50' }]}>
      <View style={[s.activeChipInner, { backgroundColor: interest.color + '18' }]}>
        {interest.emoji && <Text style={{ fontSize: 14 }}>{interest.emoji}</Text>}
        <Text style={{ fontSize: 13, fontWeight: '500', color: BR.text, flex: 1 }}>{interest.label}</Text>
        {isCustom && (
          <View style={{ paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4, backgroundColor: BR.accentSoft }}>
            <Text style={{ fontSize: 9, color: BR.accent, fontFamily: 'SpaceMono' }}>CUSTOM</Text>
          </View>
        )}
        <TouchableOpacity onPress={onRemove} style={s.removeBtn} activeOpacity={0.7}>
          <Icon name="close" size={12} color={BR.textDim} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Weight adjustment row ────────────────────────────────────
function WeightRow({ interest, onWeightChange }: {
  interest: { label: string; color: string; weight: number; emoji?: string };
  onWeightChange: (w: number) => void;
}) {
  const steps = [10, 25, 40, 55, 70, 85, 100];
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        {interest.emoji && <Text style={{ fontSize: 14 }}>{interest.emoji}</Text>}
        <Text style={{ fontSize: 13, fontWeight: '500', color: BR.text, flex: 1 }}>{interest.label}</Text>
        <Text style={{ fontFamily: 'SpaceMono', fontSize: 11, color: interest.color }}>
          {interest.weight}%
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {steps.map(step => (
          <TouchableOpacity
            key={step}
            onPress={() => onWeightChange(step)}
            style={[
              s.weightStep,
              interest.weight >= step && { backgroundColor: interest.color },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BR.bg },
  nav: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14, gap: 12,
  },
  navTitle: { fontSize: 17, fontWeight: '600', color: BR.text },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
    alignItems: 'center', justifyContent: 'center',
  },
  weightToggle: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999,
    backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
  },
  weightToggleActive: { backgroundColor: BR.accent, borderColor: BR.accent },
  tabBar: {
    flexDirection: 'row', gap: 4,
    marginHorizontal: 18, marginBottom: 4,
    padding: 4, borderRadius: 14,
    backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
  },
  tabBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  tabBtnActive: { backgroundColor: BR.text },
  tabText: { fontSize: 13, fontWeight: '500' },
  section: { paddingHorizontal: 18, paddingTop: 20 },
  sectionLabel: {
    fontFamily: 'SpaceMono', fontSize: 10, color: BR.textDim,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  activeChip: {
    borderRadius: 14, borderWidth: 1, overflow: 'hidden',
  },
  activeChipInner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  removeBtn: { padding: 4 },
  browseChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999,
    backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
  },
  browseChipActive: { backgroundColor: BR.text, borderColor: BR.text },
  browseChipText: { fontSize: 13, fontWeight: '500' },
  inspoGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
  },
  inspoChip: {
    width: (width - 56) / 4,
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 14,
    backgroundColor: BR.surface, borderWidth: 1, borderColor: BR.hairline,
  },
  weightStep: {
    flex: 1, height: 6, borderRadius: 3,
    backgroundColor: BR.subtle,
  },
});
