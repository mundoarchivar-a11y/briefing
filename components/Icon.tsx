import React from 'react';
import Svg, {
  Path, Circle, Rect, Line, G,
} from 'react-native-svg';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.6 }: IconProps) {
  const props = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  const paths: Record<string, React.ReactNode> = {
    home: <><Path d="M3.5 10L10 4l6.5 6" {...props}/><Path d="M5 9.5V16h10V9.5" {...props}/></>,
    radar: <><Circle cx="10" cy="10" r="7" {...props}/><Circle cx="10" cy="10" r="4" {...props}/><Circle cx="10" cy="10" r="1.2" fill={color} stroke="none"/><Path d="M10 10l4.5-4.5" {...props}/></>,
    briefing: <><Rect x="4" y="3.5" width="12" height="13" rx="1.5" {...props}/><Path d="M7 7h6M7 10h6M7 13h4" {...props}/></>,
    bookmark: <><Path d="M5.5 3.5h9V17l-4.5-3-4.5 3z" {...props}/></>,
    user: <><Circle cx="10" cy="7" r="3" {...props}/><Path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" {...props}/></>,
    search: <><Circle cx="9" cy="9" r="5.5" {...props}/><Path d="M13.5 13.5L17 17" {...props}/></>,
    sparkles: <><Path d="M10 3l1.3 3.7L15 8l-3.7 1.3L10 13l-1.3-3.7L5 8l3.7-1.3L10 3z" {...props}/><Path d="M15.5 13.5l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6.6-1.5z" fill={color} stroke="none"/></>,
    bell: <><Path d="M5 14V9.5a5 5 0 0110 0V14l1.5 2h-13L5 14z" {...props}/><Path d="M8.5 17.5c.3.6.9 1 1.5 1s1.2-.4 1.5-1" {...props}/></>,
    arrow: <><Path d="M4 10h12M11 5l5 5-5 5" {...props}/></>,
    arrowUp: <><Path d="M10 16V4M5 9l5-5 5 5" {...props}/></>,
    arrowDn: <><Path d="M10 4v12M5 11l5 5 5-5" {...props}/></>,
    chevR: <><Path d="M8 4l6 6-6 6" {...props}/></>,
    chevD: <><Path d="M4 8l6 6 6-6" {...props}/></>,
    plus: <><Path d="M10 4v12M4 10h12" {...props}/></>,
    check: <><Path d="M4 10.5l4 4 8-9" {...props}/></>,
    close: <><Path d="M5 5l10 10M15 5L5 15" {...props}/></>,
    flame: <><Path d="M10 17c3 0 5-2 5-5 0-2-1.5-3.5-2.5-5 0 1.5-1 2.5-2 2.5C9 9.5 9 7 11 3.5c-4 1.5-6 5-6 8.5 0 3 2 5 5 5z" {...props}/></>,
    layers: <><Path d="M10 3l7 4-7 4-7-4 7-4z" {...props}/><Path d="M3 11l7 4 7-4" {...props}/></>,
    globe: <><Circle cx="10" cy="10" r="7" {...props}/><Path d="M3 10h14M10 3c2 2 3 4.5 3 7s-1 5-3 7c-2-2-3-4.5-3-7s1-5 3-7z" {...props}/></>,
    clock: <><Circle cx="10" cy="10" r="7" {...props}/><Path d="M10 6v4l3 2" {...props}/></>,
    bolt: <><Path d="M11 3L4 11h5l-1 6 7-8h-5l1-6z" {...props}/></>,
    eye: <><Path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z" {...props}/><Circle cx="10" cy="10" r="2.5" {...props}/></>,
    share: <><Circle cx="6" cy="10" r="2" {...props}/><Circle cx="14" cy="5" r="2" {...props}/><Circle cx="14" cy="15" r="2" {...props}/><Path d="M8 9l4-3M8 11l4 3" {...props}/></>,
    filter: <><Path d="M3 5h14M5.5 10h9M8 15h4" {...props}/></>,
    settings: <><Circle cx="10" cy="10" r="2.5" {...props}/><Path d="M10 3v2M10 15v2M3 10h2M15 10h2M5 5l1.5 1.5M13.5 13.5L15 15M5 15l1.5-1.5M13.5 6.5L15 5" {...props}/></>,
    play: <><Path d="M6 4l10 6-10 6V4z" fill={color} stroke="none"/></>,
    mic: <><Rect x="8" y="3" width="4" height="9" rx="2" {...props}/><Path d="M5 10c0 3 2 5 5 5s5-2 5-5M10 15v3" {...props}/></>,
    trend: <><Path d="M3 14l4-5 3 3 7-8" {...props}/><Path d="M13 4h4v4" {...props}/></>,
    pin: <><Path d="M10 3v6m0 0l-3 4h6l-3-4zm0 4v9" {...props}/></>,
    chat: <><Path d="M3.5 6.5a3 3 0 013-3h7a3 3 0 013 3v5a3 3 0 01-3 3H9l-3.5 3v-3a3 3 0 01-2-2.8V6.5z" {...props}/></>,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      {paths[name] || null}
    </Svg>
  );
}
