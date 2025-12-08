import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Path, Defs, RadialGradient, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

interface CartoonCoinIconProps {
  size?: number;
  style?: any;
}

export function CartoonCoinIcon({ size = 32, style }: CartoonCoinIconProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="coinGradient" cx="40%" cy="30%">
            <Stop offset="0%" stopColor="#FFF9C4" stopOpacity="1" />
            <Stop offset="50%" stopColor="#FFD700" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FFA000" stopOpacity="1" />
          </RadialGradient>
          <RadialGradient id="coinHighlight" cx="30%" cy="25%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <Stop offset="50%" stopColor="#FFE082" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        
        {/* Shadow */}
        <Ellipse cx="50" cy="90" rx="35" ry="8" fill="rgba(0,0,0,0.3)" />
        
        {/* Coin base */}
        <Circle cx="50" cy="50" r="45" fill="url(#coinGradient)" />
        
        {/* Dark border */}
        <Circle cx="50" cy="50" r="45" fill="none" stroke="#D68400" strokeWidth="3" />
        
        {/* Inner circle */}
        <Circle cx="50" cy="50" r="38" fill="none" stroke="#FFA000" strokeWidth="2" />
        
        {/* Dollar sign or symbol */}
        <Path
          d="M 50 25 L 50 75 M 35 35 Q 35 28 42 28 L 58 28 Q 65 28 65 35 Q 65 42 58 45 L 42 45 M 35 65 Q 35 72 42 72 L 58 72 Q 65 72 65 65 Q 65 58 58 55 L 42 55"
          fill="none"
          stroke="#D68400"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Highlight */}
        <Circle cx="50" cy="50" r="45" fill="url(#coinHighlight)" opacity="0.6" />
        
        {/* Glossy shine */}
        <Ellipse cx="35" cy="30" rx="15" ry="18" fill="white" opacity="0.4" />
      </Svg>
    </View>
  );
}

interface CartoonDiamondIconProps {
  size?: number;
  style?: any;
}

export function CartoonDiamondIcon({ size = 32, style }: CartoonDiamondIconProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <SvgLinearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#E1F5FE" stopOpacity="1" />
            <Stop offset="50%" stopColor="#00B8FF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#0277BD" stopOpacity="1" />
          </SvgLinearGradient>
          <RadialGradient id="diamondGlow" cx="50%" cy="40%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <Stop offset="50%" stopColor="#81D4FA" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#00B8FF" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        
        {/* Shadow */}
        <Ellipse cx="50" cy="90" rx="25" ry="6" fill="rgba(0,0,0,0.3)" />
        
        {/* Diamond shape */}
        <Path
          d="M 50 15 L 75 35 L 75 45 L 50 85 L 25 45 L 25 35 Z"
          fill="url(#diamondGradient)"
          stroke="#0277BD"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        
        {/* Facets */}
        <Path d="M 50 15 L 50 85" stroke="#01579B" strokeWidth="2" opacity="0.3" />
        <Path d="M 50 15 L 25 35 L 50 85" fill="rgba(1, 87, 155, 0.2)" />
        <Path d="M 50 15 L 75 35 L 50 85" fill="rgba(255, 255, 255, 0.1)" />
        <Path d="M 25 35 L 50 45 L 75 35" fill="rgba(255, 255, 255, 0.15)" />
        <Path d="M 25 45 L 50 45 L 50 85" fill="rgba(1, 87, 155, 0.25)" />
        <Path d="M 75 45 L 50 45 L 50 85" fill="rgba(255, 255, 255, 0.05)" />
        
        {/* Glow effect */}
        <Path
          d="M 50 15 L 75 35 L 75 45 L 50 85 L 25 45 L 25 35 Z"
          fill="url(#diamondGlow)"
          opacity="0.7"
        />
        
        {/* Sparkle */}
        <Path d="M 60 25 L 62 30 L 67 28 L 63 33 L 68 35 L 62 35 L 60 40 L 58 35 L 53 35 L 57 33 L 53 28 L 58 30 Z" fill="white" opacity="0.8" />
      </Svg>
    </View>
  );
}
