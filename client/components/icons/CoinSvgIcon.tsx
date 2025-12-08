import React from "react";
import Svg, { Circle, Ellipse, G, Path } from "react-native-svg";

interface CoinSvgIconProps {
  size?: number;
  color?: string;
}

export function CoinSvgIcon({ size = 48, color = "#ffcc33" }: CoinSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      {/* Back coins */}
      <G stroke="#0d0d0d" strokeWidth="14" strokeLinejoin="round" fill="#f2b52b">
        <Ellipse cx="340" cy="240" rx="110" ry="60" />
        <Ellipse cx="340" cy="280" rx="110" ry="60" />
        <Ellipse cx="340" cy="320" rx="110" ry="60" />
      </G>
      
      {/* Front coin body */}
      <Circle cx="200" cy="280" r="120" fill={color} stroke="#0d0d0d" strokeWidth="14" />
      
      {/* Inner ring */}
      <Circle cx="200" cy="280" r="80" fill="#f4b731" stroke="#0d0d0d" strokeWidth="12" />
      
      {/* Highlight */}
      <Path 
        d="M150 240 Q200 200 250 240" 
        stroke="#fff4a6" 
        strokeWidth="10" 
        strokeLinecap="round" 
        fill="none" 
        opacity="0.7" 
      />
    </Svg>
  );
}
