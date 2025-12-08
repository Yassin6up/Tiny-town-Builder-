import React from "react";
import Svg, { Ellipse, G, Path, Rect } from "react-native-svg";

interface StatisticSvgIconProps {
  size?: number;
}

export function StatisticSvgIcon({ size = 48 }: StatisticSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      {/* Chart bars */}
      <G stroke="#0d0d0d" strokeWidth="18" strokeLinejoin="round" strokeLinecap="round">
        {/* Bar 1 */}
        <Rect x="150" y="260" width="60" height="140" rx="12" fill="#FFCC33" />
        
        {/* Bar 2 */}
        <Rect x="230" y="210" width="60" height="190" rx="12" fill="#FFA53D" />
        
        {/* Bar 3 */}
        <Rect x="310" y="160" width="60" height="240" rx="12" fill="#FF7A4D" />
      </G>
      
      {/* Highlight line */}
      <Path 
        d="M150 260 Q200 200 260 210 Q320 220 370 160" 
        stroke="#FFFFFF" 
        strokeWidth="12" 
        strokeLinecap="round" 
        opacity="0.4" 
        fill="none" 
      />
    </Svg>
  );
}
