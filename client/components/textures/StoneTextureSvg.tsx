import React from 'react';
import Svg, { Rect, Defs, LinearGradient, Stop, Pattern, Circle } from 'react-native-svg';

interface StoneTextureSvgProps {
  width: number;
  height: number;
  variant?: 'gray' | 'blue' | 'dark';
  borderRadius?: number;
}

const stoneColors = {
  gray: {
    outer: '#6B7280',
    border: '#1F2937',
    inner: '#9CA3AF',
  },
  blue: {
    outer: '#475569',
    border: '#0F172A',
    inner: '#64748B',
  },
  dark: {
    outer: '#374151',
    border: '#111827',
    inner: '#4B5563',
  },
};

export function StoneTextureSvg({ 
  width, 
  height, 
  variant = 'gray',
  borderRadius = 25 
}: StoneTextureSvgProps) {
  const colors = stoneColors[variant];
  const borderWidth = 10;
  const innerX = borderWidth;
  const innerY = borderWidth;
  const innerWidth = width - (borderWidth * 2);
  const innerHeight = height - (borderWidth * 2);
  const innerRadius = Math.max(0, borderRadius - borderWidth);

  return (
    <Svg width={width} height={height}>
      <Defs>
        {/* Stone texture pattern */}
        <Pattern id={`stonePattern-${variant}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <Circle cx="5" cy="5" r="2" fill={colors.border} opacity="0.1" />
          <Circle cx="15" cy="12" r="1.5" fill={colors.border} opacity="0.15" />
          <Circle cx="10" cy="15" r="1" fill={colors.border} opacity="0.1" />
        </Pattern>
        
        {/* Stone gradient */}
        <LinearGradient id={`stoneGradient-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={colors.inner} stopOpacity="1" />
          <Stop offset="50%" stopColor={colors.outer} stopOpacity="0.5" />
          <Stop offset="100%" stopColor={colors.inner} stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Outer rect with dark border */}
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

      {/* Inner rect with stone gradient */}
      <Rect
        x={innerX}
        y={innerY}
        width={innerWidth}
        height={innerHeight}
        rx={innerRadius}
        ry={innerRadius}
        fill={`url(#stoneGradient-${variant})`}
      />

      {/* Stone texture overlay */}
      <Rect
        x={innerX}
        y={innerY}
        width={innerWidth}
        height={innerHeight}
        rx={innerRadius}
        ry={innerRadius}
        fill={`url(#stonePattern-${variant})`}
      />
    </Svg>
  );
}
