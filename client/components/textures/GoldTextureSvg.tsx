import React from 'react';
import Svg, { Rect, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

interface GoldTextureSvgProps {
  width: number;
  height: number;
  variant?: 'bright' | 'matte' | 'bronze';
  borderRadius?: number;
}

const goldColors = {
  bright: {
    outer: '#D4AF37',
    border: '#8B6914',
    inner: '#FFD700',
    highlight: '#FFF8DC',
  },
  matte: {
    outer: '#B8860B',
    border: '#6B4A0B',
    inner: '#DAA520',
    highlight: '#F0E68C',
  },
  bronze: {
    outer: '#CD7F32',
    border: '#6B3E1A',
    inner: '#E5A55D',
    highlight: '#F5DEB3',
  },
};

export function GoldTextureSvg({ 
  width, 
  height, 
  variant = 'bright',
  borderRadius = 25 
}: GoldTextureSvgProps) {
  const colors = goldColors[variant];
  const borderWidth = 10;
  const innerX = borderWidth;
  const innerY = borderWidth;
  const innerWidth = width - (borderWidth * 2);
  const innerHeight = height - (borderWidth * 2);
  const innerRadius = Math.max(0, borderRadius - borderWidth);

  return (
    <Svg width={width} height={height}>
      <Defs>
        {/* Gold metallic gradient */}
        <LinearGradient id={`goldGradient-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={colors.highlight} stopOpacity="0.6" />
          <Stop offset="30%" stopColor={colors.inner} stopOpacity="1" />
          <Stop offset="70%" stopColor={colors.outer} stopOpacity="1" />
          <Stop offset="100%" stopColor={colors.inner} stopOpacity="1" />
        </LinearGradient>

        {/* Gold shine effect */}
        <RadialGradient id={`goldShine-${variant}`} cx="50%" cy="20%">
          <Stop offset="0%" stopColor={colors.highlight} stopOpacity="0.8" />
          <Stop offset="50%" stopColor={colors.inner} stopOpacity="0.4" />
          <Stop offset="100%" stopColor={colors.outer} stopOpacity="0" />
        </RadialGradient>
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

      {/* Inner rect with gold gradient */}
      <Rect
        x={innerX}
        y={innerY}
        width={innerWidth}
        height={innerHeight}
        rx={innerRadius}
        ry={innerRadius}
        fill={`url(#goldGradient-${variant})`}
      />

      {/* Metallic shine overlay */}
      <Rect
        x={innerX}
        y={innerY}
        width={innerWidth}
        height={innerHeight}
        rx={innerRadius}
        ry={innerRadius}
        fill={`url(#goldShine-${variant})`}
      />
    </Svg>
  );
}
