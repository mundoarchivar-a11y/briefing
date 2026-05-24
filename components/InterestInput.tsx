// components/InterestInput.tsx
// Free-text interest input with live suggestions from both predefined list
// and popular custom topics. Supports any keyword — from "recetas" to
// "física cuántica" to "astrología medieval".

import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, Animated, Keyboard,
} from 'react-native';
import { BR } from '../lib/design';
import { PREDEFINED_INTERESTS, Interest, guessEmoji } from '../lib/interests';
import { Icon } from './Icon';

// Extra suggestion pool beyond predefined — the "free will" ideas
const EXTRA_SUGGESTIONS = [
  { label: 'Recetas & Cocina',          emoji: '🍳' },
  { label: 'Astrología',                emoji: '⭐' },
  { label: 'Física Cuántica',           emoji: '⚛️' },
  { label: 'Psicología',                emoji: '🧠' },
  { label: 'Filosofía',                 emoji: '💭' },
  { label: 'Historia Mundial',          emoji: '📜' },
  { label: 'Bienestar Mental',          emoji: '🌿' },
  { label: 'Yoga & Meditación',         emoji: '🧘' },
  { label: 'Fotografía',               emoji: '📷' },
  { label: 'Diseño Gráfico',           emoji: '🎨' },
  { label: 'Arquitectura',             emoji: '🏛️' },
  { label: 'Moda & Estilo',            emoji: '👗' },
  { label: 'Viajes & Turismo',         emoji: '✈️' },
  { label: 'Anime & Manga',            emoji: '🎌' },
  { label: 'Podcasts',                 emoji: '🎙️' },
  { label: 'Literatura',               emoji: '📚' },
  { label: 'Ilustración',              emoji: '✏️' },
  { label: 'Numismática',              emoji: '🪙' },
  { label: 'Jardinería',               emoji: '🌻' },
  { label: 'Mascotas',                 emoji: '🐾' },
  { label: 'Automóviles',              emoji: '🚗' },
  { label: 'Astronomía',              emoji: '🔭' },
  { label: 'Biohacking',               emoji: '🧬' },
  { label: 'Finanzas Personales',      emoji: '💰' },
  { label: 'Programación',             emoji: '💻' },
  { label: 'Marketing Digital',        emoji: '📱' },
  { label: 'Derecho & Justicia',       emoji: '⚖️' },
  { label: 'Rugby',                    emoji: '🏉' },
  { label: 'Tenis',                    emoji: '🎾' },
  { label: 'Golf & Pádel',            emoji: '⛳' },
  { label: 'Ciclismo',                 emoji: '🚴' },
  { label: 'Nutrición',               emoji: '🥗' },
  { label: 'Vinos & Sommelier',        emoji: '🍷' },
  { label: 'Criptografía',            emoji: '🔐' },
  { label: 'Misterios & Ocultismo',    emoji: '🔍' },
  { label: 'Geología',                emoji: '🪨' },
  { label: 'Paleontología',           emoji: '🦕' },
  { label: 'Lingüística',             emoji: '🗣️' },
  { label: 'Educación & Pedagogía',   emoji: '🎓' },
  { label: 'Urbanismo',               emoji: '🏙️' },
];

const ALL_SUGGESTIONS = [
  ...PREDEFINED_INTERESTS.map(i => ({ label: i.label, emoji: i.emoji || '📌' })),
  ...EXTRA_SUGGESTIONS,
];

interface Props {
  onAdd: (label: string) => void;
  selectedLabels: string[];
  placeholder?: string;
}

export function InterestInput({ onAdd, selectedLabels, placeholder }: Props) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const heightAnim = useRef(new Animated.Value(0)).current;

  const filtered = query.length > 0
    ? ALL_SUGGESTIONS.filter(s =>
        s.label.toLowerCase().includes(query.toLowerCase()) &&
        !selectedLabels.map(l => l.toLowerCase()).includes(s.label.toLowerCase())
      ).slice(0, 6)
    : [];

  const showSuggestions = focused && (filtered.length > 0 || query.length >= 2);

  // animate suggestions panel
  React.useEffect(() => {
    Animated.spring(heightAnim, {
      toValue: showSuggestions ? 1 : 0,
      useNativeDriver: false,
      tension: 100, friction: 12,
    }).start();
  }, [showSuggestions]);

  const handleAdd = (label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setQuery('');
    inputRef.current?.blur();
  };

  const handleSubmit = () => {
    if (query.trim()) handleAdd(query);
  };

  return (
    <View>
      {/* Input row */}
      <View style={[s.inputRow, focused && s.inputRowFocused]}>
        <View style={s.inputEmoji}>
          <Text style={{ fontSize: 16 }}>{query ? guessEmoji(query) : '🔍'}</Text>
        </View>
        <TextInput
          ref={inputRef}
          style={s.input}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder || 'Añadir tema: recetas, astrología, física…'}
          placeholderTextColor={BR.textDim}
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity
            style={s.addBtn}
            onPress={handleSubmit}
            activeOpacity={0.8}>
            <Icon name="plus" size={16} color={BR.bg} />
          </TouchableOpacity>
        )}
      </View>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <Animated.View style={[s.suggestions, {
          opacity: heightAnim,
          transform: [{ translateY: heightAnim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) }],
        }]}>
          {/* Exact-match custom add option */}
          {query.length >= 2 && !ALL_SUGGESTIONS.some(s => s.label.toLowerCase() === query.toLowerCase()) && (
            <TouchableOpacity style={[s.suggRow, s.suggRowCustom]} onPress={() => handleAdd(query)} activeOpacity={0.8}>
              <Text style={s.suggEmoji}>{guessEmoji(query)}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: BR.accent }}>
                  Añadir "{query}"
                </Text>
                <Text style={{ fontSize: 11, color: BR.textDim, marginTop: 2 }}>Tema personalizado</Text>
              </View>
              <Icon name="plus" size={14} color={BR.accent} />
            </TouchableOpacity>
          )}

          {/* Matched suggestions */}
          {filtered.map((sug, i) => (
            <TouchableOpacity
              key={i}
              style={[s.suggRow, i < filtered.length - 1 && s.suggRowBorder]}
              onPress={() => handleAdd(sug.label)}
              activeOpacity={0.8}>
              <Text style={s.suggEmoji}>{sug.emoji}</Text>
              <Text style={{ flex: 1, fontSize: 14, color: BR.text }}>{sug.label}</Text>
              <Icon name="plus" size={14} color={BR.textDim} />
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 14, backgroundColor: BR.surface,
    borderWidth: 1, borderColor: BR.hairline,
  },
  inputRowFocused: {
    borderColor: BR.accentLine,
    backgroundColor: BR.elevated,
  },
  inputEmoji: {
    width: 28, height: 28, alignItems: 'center', justifyContent: 'center',
  },
  input: {
    flex: 1, fontSize: 14, color: BR.text,
    paddingVertical: 0,
  },
  addBtn: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: BR.accent, alignItems: 'center', justifyContent: 'center',
  },
  suggestions: {
    marginTop: 6, borderRadius: 14,
    backgroundColor: BR.elevated, borderWidth: 1, borderColor: BR.hairline,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 12,
  },
  suggRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  suggRowBorder: {
    borderBottomWidth: 1, borderBottomColor: BR.hairlineLo,
  },
  suggRowCustom: {
    backgroundColor: BR.accentSoft,
    borderBottomWidth: 1, borderBottomColor: BR.accentLine,
  },
  suggEmoji: { fontSize: 18, width: 28, textAlign: 'center' },
});
