import React from 'react';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

interface WoodTextureSvgProps {
  width: number;
  height: number;
  variant?: 'light' | 'dark' | 'weathered' | 'rich';
  borderRadius?: number;
}

const woodColors = {
  light: {
    outer: '#B06B34',
    border: '#5C330F',
    inner: '#D48A4C',
  },
  dark: {
    outer: '#8B4513',
    border: '#3D1F0A',
    inner: '#A0522D',
  },
  weathered: {
    outer: '#9B6B3D',
    border: '#4A3520',
    inner: '#C19A6B',
  },
  rich: {
    outer: '#D2691E',
    border: '#6B3410',
    inner: '#F4A460',
  },
};

export function WoodTextureSvg({ 
  width, 
  height, 
  variant = 'light',
  borderRadius = 25 
}: WoodTextureSvgProps) {
  const colors = woodColors[variant];
  const borderWidth = 10;
  const innerX = borderWidth;
  const innerY = borderWidth;
  const innerWidth = width - (borderWidth * 2);
  const innerHeight = height - (borderWidth * 2);
  const innerRadius = Math.max(0, borderRadius - borderWidth);

  return (
    <Svg width={width} height={height}>
      <Defs>
        {/* Wood grain gradient for inner surface */}
        <LinearGradient id={`woodGrain-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={colors.inner} stopOpacity="1" />
          <Stop offset="50%" stopColor={colors.outer} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={colors.inner} stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Outer rect with dark border (shadow effect) */}
      <Rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx={borderRadius}
        ry={borderRadius}
        fill={colors.outer}
        stroke={colors.border}
        strokeWidth={borderWidth}
      />

      {/* Inner rect with lighter wood color (3D depth) */}
      <Rect
        x={innerX}
        y={innerY}
        width={innerWidth}
        height={innerHeight}
        rx={innerRadius}
        ry={innerRadius}
        fill={`url(#woodGrain-${variant})`}
      />
    </Svg>
  );
}
