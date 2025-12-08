import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect, Circle, Ellipse, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

interface CartoonChestProps {
  size?: number;
  variant?: 'bronze' | 'silver' | 'gold' | 'legendary';
  style?: any;
}

export function CartoonChest({ size = 80, variant = 'gold', style }: CartoonChestProps) {
  const colors = {
    bronze: { main: '#CD7F32', dark: '#8B4513', light: '#D4A574', glow: '#FF8C00' },
    silver: { main: '#C0C0C0', dark: '#808080', light: '#E8E8E8', glow: '#FFFFFF' },
    gold: { main: '#FFD700', dark: '#B8860B', light: '#FFEC8B', glow: '#FFA500' },
    legendary: { main: '#9C27B0', dark: '#6A1B9A', light: '#CE93D8', glow: '#E040FB' },
  };

  const chestColor = colors[variant];

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          <LinearGradient id={`chestGradient-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={chestColor.light} />
            <Stop offset="50%" stopColor={chestColor.main} />
            <Stop offset="100%" stopColor={chestColor.dark} />
          </LinearGradient>
          <RadialGradient id={`chestGlow-${variant}`} cx="50%" cy="40%">
            <Stop offset="0%" stopColor={chestColor.glow} stopOpacity="0.8" />
            <Stop offset="70%" stopColor={chestColor.glow} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={chestColor.glow} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        
        {/* Shadow */}
        <Ellipse cx="60" cy="110" rx="45" ry="8" fill="rgba(0,0,0,0.4)" />
        
        {/* Chest base */}
        <Rect
          x="20"
          y="50"
          width="80"
          height="50"
          rx="8"
          fill={`url(#chestGradient-${variant})`}
          stroke={chestColor.dark}
          strokeWidth="3"
        />
        
        {/* Chest lid */}
        <Path
          d="M 20 50 Q 20 25 60 20 Q 100 25 100 50 L 100 60 L 20 60 Z"
          fill={`url(#chestGradient-${variant})`}
          stroke={chestColor.dark}
          strokeWidth="3"
        />
        
        {/* Lock plate */}
        <Rect
          x="48"
          y="55"
          width="24"
          height="28"
          rx="4"
          fill="#FFC107"
          stroke="#FF8F00"
          strokeWidth="2"
        />
        
        {/* Keyhole */}
        <Circle cx="60" cy="65" r="5" fill="#3E2723" />
        <Path d="M 58 70 L 62 70 L 61 80 L 59 80 Z" fill="#3E2723" />
        
        {/* Metal straps */}
        <Rect x="15" y="45" width="90" height="4" rx="2" fill="#795548" />
        <Rect x="15" y="72" width="90" height="4" rx="2" fill="#795548" />
        <Rect x="15" y="95" width="90" height="4" rx="2" fill="#795548" />
        
        {/* Glow effect for legendary */}
        {variant === 'legendary' && (
          <Rect
            x="20"
            y="20"
            width="80"
            height="80"
            rx="8"
            fill={`url(#chestGlow-${variant})`}
            opacity="0.6"
          />
        )}
        
        {/* Sparkles for gold/legendary */}
        {(variant === 'gold' || variant === 'legendary') && (
          <>
            <Path d="M 15 35 L 17 40 L 22 38 L 18 43 L 23 45 L 17 45 L 15 50 L 13 45 L 8 45 L 12 43 L 8 38 L 13 40 Z" fill="white" opacity="0.9" />
            <Path d="M 100 60 L 101 63 L 104 62 L 102 65 L 105 66 L 101 66 L 100 69 L 99 66 L 96 66 L 98 65 L 96 62 L 99 63 Z" fill="white" opacity="0.8" />
          </>
        )}
      </Svg>
    </View>
  );
}

interface CartoonBadgeProps {
  size?: number;
  level: number;
  color?: string;
  style?: any;
}

export function CartoonBadge({ size = 50, level, color = '#2196F3', style }: CartoonBadgeProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="badgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </LinearGradient>
          <RadialGradient id="badgeShine" cx="40%" cy="30%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <Stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        
        {/* Shadow */}
        <Ellipse cx="50" cy="90" rx="35" ry="6" fill="rgba(0,0,0,0.3)" />
        
        {/* Star badge shape */}
        <Path
          d="M 50 10 L 58 38 L 88 38 L 64 56 L 72 84 L 50 66 L 28 84 L 36 56 L 12 38 L 42 38 Z"
          fill="url(#badgeGradient)"
          stroke="#1565C0"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        
        {/* Inner circle */}
        <Circle cx="50" cy="50" r="25" fill="rgba(255,255,255,0.3)" stroke="#0D47A1" strokeWidth="2" />
        
        {/* Shine effect */}
        <Circle cx="50" cy="50" r="35" fill="url(#badgeShine)" />
        
        {/* Text would go here - rendered separately */}
      </Svg>
    </View>
  );
}
