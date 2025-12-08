import React from "react";
import Svg, { Ellipse, G, Path, Polygon } from "react-native-svg";

interface DiamondSvgIconProps {
  size?: number;
  color?: string;
}

export function DiamondSvgIcon({ size = 48, color = "#7AD4FF" }: DiamondSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      {/* Diamond shape */}
      <G stroke="#0d0d0d" strokeWidth="14" strokeLinejoin="round">
        {/* Top polygon */}
        <Polygon points="160,200 256,130 352,200 310,260 202,260" fill={color} />
        
        {/* Left facet */}
        <Polygon points="160,200 202,260 256,130" fill="#A6E8FF" />
        
        {/* Right facet */}
        <Polygon points="352,200 310,260 256,130" fill="#96DEFF" />
        
        {/* Bottom facet */}
        <Polygon points="202,260 310,260 256,340" fill="#5CC4EF" />
      </G>
      
      {/* Highlight */}
      <Path 
        d="M195 210 L256 155 L317 210" 
        stroke="#ffffff" 
        strokeWidth="12" 
        strokeLinecap="round" 
        fill="none" 
        opacity="0.7" 
      />
    </Svg>
  );
}
