import React from "react";
import Svg, { Circle, Ellipse, G, Line, Path } from "react-native-svg";

interface ShopSvgIconProps {
  size?: number;
  color?: string;
}

export function ShopSvgIcon({ size = 48, color = "#FFE7A8" }: ShopSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      {/* Cart */}
      <G stroke="#0d0d0d" strokeWidth="18" strokeLinejoin="round" strokeLinecap="round">
        {/* Cart basket */}
        <Path d="M140 200 H380 L350 300 H170 Z" fill={color} />
        
        {/* Inside lines */}
        <Line x1="175" y1="230" x2="345" y2="230" />
        <Line x1="185" y1="260" x2="335" y2="260" />
        
        {/* Handle */}
        <Path d="M130 180 H200" strokeWidth="20" />
        
        {/* Wheels */}
        <Circle cx="200" cy="360" r="38" fill="#ffcc33" />
        <Circle cx="310" cy="360" r="38" fill="#ffcc33" />
        
        {/* Wheel centers */}
        <Circle cx="200" cy="360" r="14" fill="#0d0d0d" />
        <Circle cx="310" cy="360" r="14" fill="#0d0d0d" />
      </G>
    </Svg>
  );
}
