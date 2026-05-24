// lib/store.tsx
// Global user preferences store — interests, weights, sources.
// Persists to AsyncStorage. Provides a React Context consumed app-wide.

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Interest, PREDEFINED_INTERESTS, makeCustomInterest } from './interests';

const STORAGE_KEY = '@briefing:preferences:v1';

// ─── State shape ─────────────────────────────────────────────
interface PrefsState {
  // Selected interests (could be subset of predefined + all custom ones)
  interests: Interest[];
  // Whether onboarding is complete
  onboarded: boolean;
  // UI preference: home variant
  homeVariant: 'copilot' | 'editorial' | 'hybrid';
}

const DEFAULT_STATE: PrefsState = {
  interests: PREDEFINED_INTERESTS.filter(i =>
    ['ia-tech', 'mercados', 'politica-ar', 'clima', 'cultura', 'startups', 'local-caba'].includes(i.id)
  ),
  onboarded: false,
  homeVariant: 'copilot',
};

// ─── Actions ─────────────────────────────────────────────────
type Action =
  | { type: 'HYDRATE'; payload: PrefsState }
  | { type: 'TOGGLE_PREDEFINED'; id: string }
  | { type: 'ADD_CUSTOM'; label: string }
  | { type: 'REMOVE_INTEREST'; id: string }
  | { type: 'UPDATE_WEIGHT'; id: string; weight: number }
  | { type: 'REORDER'; from: number; to: number }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'SET_HOME_VARIANT'; variant: PrefsState['homeVariant'] };

function reducer(state: PrefsState, action: Action): PrefsState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;

    case 'TOGGLE_PREDEFINED': {
      const exists = state.interests.find(i => i.id === action.id);
      if (exists) {
        // Remove (but keep custom ones unaffected)
        return { ...state, interests: state.interests.filter(i => i.id !== action.id) };
      } else {
        // Add from predefined list
        const predefined = PREDEFINED_INTERESTS.find(i => i.id === action.id);
        if (!predefined) return state;
        return { ...state, interests: [...state.interests, predefined] };
      }
    }

    case 'ADD_CUSTOM': {
      const trimmed = action.label.trim();
      if (!trimmed) return state;
      // Prevent duplicates (case-insensitive)
      const already = state.interests.find(
        i => i.label.toLowerCase() === trimmed.toLowerCase()
      );
      if (already) return state;
      const newInterest = makeCustomInterest(trimmed);
      return { ...state, interests: [...state.interests, newInterest] };
    }

    case 'REMOVE_INTEREST':
      return { ...state, interests: state.interests.filter(i => i.id !== action.id) };

    case 'UPDATE_WEIGHT':
      return {
        ...state,
        interests: state.interests.map(i =>
          i.id === action.id ? { ...i, weight: action.weight } : i
        ),
      };

    case 'REORDER': {
      const arr = [...state.interests];
      const [moved] = arr.splice(action.from, 1);
      arr.splice(action.to, 0, moved);
      return { ...state, interests: arr };
    }

    case 'COMPLETE_ONBOARDING':
      return { ...state, onboarded: true };

    case 'SET_HOME_VARIANT':
      return { ...state, homeVariant: action.variant };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────
interface StoreCtx {
  prefs: PrefsState;
  dispatch: React.Dispatch<Action>;
  // Convenience helpers
  isSelected: (id: string) => boolean;
  togglePredefined: (id: string) => void;
  addCustom: (label: string) => void;
  removeInterest: (id: string) => void;
  updateWeight: (id: string, weight: number) => void;
  completeOnboarding: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [prefs, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try {
          const saved = JSON.parse(raw) as PrefsState;
          dispatch({ type: 'HYDRATE', payload: saved });
        } catch {}
      }
      setHydrated(true);
    }).catch(() => setHydrated(true));
  }, []);

  // Persist on every state change (debounced)
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [prefs, hydrated]);

  const isSelected = useCallback((id: string) =>
    prefs.interests.some(i => i.id === id), [prefs.interests]);

  const togglePredefined = useCallback((id: string) =>
    dispatch({ type: 'TOGGLE_PREDEFINED', id }), []);

  const addCustom = useCallback((label: string) =>
    dispatch({ type: 'ADD_CUSTOM', label }), []);

  const removeInterest = useCallback((id: string) =>
    dispatch({ type: 'REMOVE_INTEREST', id }), []);

  const updateWeight = useCallback((id: string, weight: number) =>
    dispatch({ type: 'UPDATE_WEIGHT', id, weight }), []);

  const completeOnboarding = useCallback(() =>
    dispatch({ type: 'COMPLETE_ONBOARDING' }), []);

  if (!hydrated) return null;

  return (
    <Ctx.Provider value={{
      prefs, dispatch,
      isSelected, togglePredefined, addCustom, removeInterest,
      updateWeight, completeOnboarding,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}
