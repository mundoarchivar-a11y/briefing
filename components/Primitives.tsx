import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Polyline, Path, Circle, Line, Defs, RadialGradient, LinearGradient, Stop, G } from 'react-native-svg';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { BR, PHOTO_TONES, PhotoTone } from '../lib/design';

// ─── Spark ───────────────────────────────────────────────────
interface SparkProps {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
}

export function Spark({ values, width = 80, height = 24, color = BR.text, fill = false, strokeWidth = 1.2 }: SparkProps) {
  const N = values.length;
  if (N < 2) return null;
  const x = (i: number) => (i / (N - 1)) * width;
  const y = (v: number) => height - 1 - v * (height - 2);
  const pts = values.map((v, i) => `${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
  const areaD = `M0,${height} L${pts.split(' ').map(p => `${p}`).join(' L')} L${width},${height} Z`;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {fill && (
        <Path d={areaD} fill={color} fillOpacity={0.10} stroke="none" />
      )}
      <Polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Photo placeholder ───────────────────────────────────────
interface PhotoProps {
  tone?: PhotoTone;
  label?: string;
  height?: number;
  radius?: number;
  style?: object;
}

export function Photo({ tone = 'neutral', label, height = 120, radius = 12, style = {} }: PhotoProps) {
  const [a, b] = PHOTO_TONES[tone] || PHOTO_TONES.neutral;
  return (
    <View style={[{ borderRadius: radius, overflow: 'hidden', height }, style]}>
      <ExpoLinearGradient
        colors={[a, b]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* stripe overlay */}
      <View style={[StyleSheet.absoluteFill, { opacity: 0.15 }]}>
        <Svg width="100%" height="100%">
          <Path d="" stroke="white" strokeWidth="0" />
        </Svg>
      </View>
      {label && (
        <View style={{ position: 'absolute', bottom: 8, left: 10 }}>
          <Text style={{ fontFamily: 'SpaceMono', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Text>
        </View>
      )}
    </View>
  );
}

// ─── SourceStack ─────────────────────────────────────────────
interface SourceDot {
  l: string;
  bg?: string;
  fg?: string;
}

export function SourceStack({ sources }: { sources: SourceDot[] }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {sources.map((s, i) => (
        <View key={i} style={{
          width: 18, height: 18, borderRadius: 9,
          backgroundColor: s.bg || BR.subtle,
          borderWidth: 1.5, borderColor: BR.bg,
          marginLeft: i === 0 ? 0 : -6,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 8, fontWeight: '700', color: s.fg || BR.text }}>{s.l}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── RadarViz ─────────────────────────────────────────────────
interface RadarNode {
  a: number; // angle degrees
  d: number; // distance 0..1
  c: string; // color
  l: string; // label
}

interface RadarVizProps {
  size?: number;
  nodes?: RadarNode[];
}

export function RadarViz({ size = 220, nodes }: RadarVizProps) {
  const r = size / 2;
  const rings = [0.95, 0.72, 0.48, 0.25];
  const defaults: RadarNode[] = [
    { a: 25,  d: 0.85, c: BR.accent, l: 'IA' },
    { a: 110, d: 0.62, c: BR.info,   l: 'Mercados' },
    { a: 200, d: 0.7,  c: BR.cool,   l: 'Política' },
    { a: 295, d: 0.5,  c: BR.pos,    l: 'Ciencia' },
    { a: 340, d: 0.32, c: BR.alert,  l: 'Local' },
  ];
  const items = nodes || defaults;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <RadialGradient id="rd-glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={BR.accent} stopOpacity="0.18" />
          <Stop offset="60%" stopColor={BR.accent} stopOpacity="0.04" />
          <Stop offset="100%" stopColor={BR.accent} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx={r} cy={r} r={r * 0.95} fill="url(#rd-glow)" />
      {rings.map((rad, i) => (
        <Circle key={i} cx={r} cy={r} r={r * rad}
          fill="none" stroke={BR.hairline}
          strokeWidth={i === 0 ? 1 : 0.6}
          strokeDasharray={i === 0 ? undefined : '2 4'}
        />
      ))}
      <Line x1={r} y1={4} x2={r} y2={size - 4} stroke={BR.hairlineLo} strokeWidth="0.6" />
      <Line x1={4} y1={r} x2={size - 4} y2={r} stroke={BR.hairlineLo} strokeWidth="0.6" />
      {items.map((n, i) => {
        const rad = (n.a * Math.PI) / 180;
        const cx = r + Math.cos(rad) * n.d * r * 0.95;
        const cy = r + Math.sin(rad) * n.d * r * 0.95;
        return (
          <G key={i}>
            <Circle cx={cx} cy={cy} r={9} fill={n.c} opacity={0.12} />
            <Circle cx={cx} cy={cy} r={3.5} fill={n.c} />
          </G>
        );
      })}
      <Circle cx={r} cy={r} r={3} fill={BR.text} />
      <Circle cx={r} cy={r} r={6} fill="none" stroke={BR.text} strokeOpacity={0.4} />
    </Svg>
  );
}

// ─── BriefingLogo ─────────────────────────────────────────────
interface LogoProps {
  size?: number;
  color?: string;
  accent?: string;
}

export function BriefingLogo({ size = 28, color = BR.text, accent = BR.accent }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="13" stroke={color} strokeOpacity={0.18} strokeWidth={1} />
      <Path d="M14 4a10 10 0 010 20" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Path d="M14 8a6 6 0 010 12" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <Circle cx="14" cy="14" r="2.4" fill={accent} />
    </Svg>
  );
}

// ─── SignalDot ──────────────────────────────────────────────
export function SignalDot({ color = BR.accent, size = 7 }: { color?: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: color, opacity: 0.4,
        position: 'absolute',
      }} />
      <View style={{
        width: size * 0.6, height: size * 0.6, borderRadius: size / 2,
        backgroundColor: color,
      }} />
    </View>
  );
}
