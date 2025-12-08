import React from 'react';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

interface MetalTextureSvgProps {
  width: number;
  height: number;
  variant?: 'silver' | 'steel' | 'iron';
  borderRadius?: number;
}

const metalColors = {
  silver: {
    outer: '#8C92AC',
    border: '#2C3E50',
    inner: '#C0C0C0',
    highlight: '#E8E8E8',
  },
  steel: {
    outer: '#6C7A89',
    border: '#1A252F',
    inner: '#95A5A6',
    highlight: '#BDC3C7',
  },
  iron: {
    outer: '#4A5568',
    border: '#1A202C',
    inner: '#718096',
    highlight: '#A0AEC0',
  },
};

export function MetalTextureSvg({ 
  width, 
  height, 
  variant = 'silver',
  borderRadius = 25 
}: MetalTextureSvgProps) {
  const colors = metalColors[variant];
  const borderWidth = 10;
  const innerX = borderWidth;
  const innerY = borderWidth;
  const innerWidth = width - (borderWidth * 2);
  const innerHeight = height - (borderWidth * 2);
  const innerRadius = Math.max(0, borderRadius - borderWidth);

  return (
    <Svg width={width} height={height}>
      <Defs>
        {/* Metallic gradient */}
        <LinearGradient id={`metalGradient-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={colors.highlight} stopOpacity="1" />
          <Stop offset="40%" stopColor={colors.inner} stopOpacity="1" />
          <Stop offset="60%" stopColor={colors.outer} stopOpacity="1" />
          <Stop offset="100%" stopColor={colors.inner} stopOpacity="1" />
        </LinearGradient>

        {/* Metal shine stripe */}
        <LinearGradient id={`metalShine-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={colors.inner} stopOpacity="0" />
          <Stop offset="30%" stopColor={colors.highlight} stopOpacity="0.5" />
          <Stop offset="50%" stopColor={colors.highlight} stopOpacity="0.8" />
          <Stop offset="70%" stopColor={colors.highlight} stopOpacity="0.5" />
          <Stop offset="100%" stopColor={colors.inner} stopOpacity="0" />
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

      {/* Inner rect with metal gradient */}
      <Rect
        x={innerX}
        y={innerY}
        width={innerWidth}
        height={innerHeight}
        rx={innerRadius}
        ry={innerRadius}
        fill={`url(#metalGradient-${variant})`}
      />

      {/* Metallic shine overlay */}
      <Rect
        x={innerX}
        y={innerY + innerHeight * 0.2}
        width={innerWidth}
        height={innerHeight * 0.15}
        rx={5}
        ry={5}
        fill={`url(#metalShine-${variant})`}
      />
    </Svg>
  );
}
