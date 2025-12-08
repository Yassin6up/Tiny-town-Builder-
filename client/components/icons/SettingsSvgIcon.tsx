import React from "react";
import Svg, { Circle, Defs, Filter, FeDropShadow, G, Mask, Path, Rect, Use } from "react-native-svg";

interface SettingsSvgIconProps {
  size?: number;
  color?: string;
}

export function SettingsSvgIcon({ size = 48, color = "#6f8fa0" }: SettingsSvgIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      <Defs>
        {/* Tooth shape */}
        <Rect id="tooth" x="226" y="64" rx="8" ry="8" width="60" height="40" />
        
        {/* Drop shadow */}
        <Filter id="ds" x="-50%" y="-50%" width="200%" height="200%">
          <FeDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.25" />
        </Filter>
        
        {/* Gear mask */}
        <Mask id="gearMask">
          <Rect x="0" y="0" width="100%" height="100%" fill="black" />
          <G fill="white">
            <Circle cx="256" cy="256" r="140" />
            <Use href="#tooth" transform="rotate(0 256 256)" />
            <Use href="#tooth" transform="rotate(45 256 256)" />
            <Use href="#tooth" transform="rotate(90 256 256)" />
            <Use href="#tooth" transform="rotate(135 256 256)" />
            <Use href="#tooth" transform="rotate(180 256 256)" />
            <Use href="#tooth" transform="rotate(225 256 256)" />
            <Use href="#tooth" transform="rotate(270 256 256)" />
            <Use href="#tooth" transform="rotate(315 256 256)" />
          </G>
          <Circle cx="256" cy="256" r="70" fill="black" />
        </Mask>
      </Defs>
      
      {/* Gear body */}
      <G filter="url(#ds)">
        <Rect x="0" y="0" width="100%" height="100%" fill={color} mask="url(#gearMask)" />
      </G>
      
      {/* Outlines */}
      <G fill="none" stroke="#071014" strokeLinejoin="round" strokeLinecap="round" strokeWidth="12">
        <Circle cx="256" cy="256" r="140" />
        <Use href="#tooth" transform="rotate(0 256 256)" />
        <Use href="#tooth" transform="rotate(45 256 256)" />
        <Use href="#tooth" transform="rotate(90 256 256)" />
        <Use href="#tooth" transform="rotate(135 256 256)" />
        <Use href="#tooth" transform="rotate(180 256 256)" />
        <Use href="#tooth" transform="rotate(225 256 256)" />
        <Use href="#tooth" transform="rotate(270 256 256)" />
        <Use href="#tooth" transform="rotate(315 256 256)" />
      </G>
      
      {/* Inner rim */}
      <Circle cx="256" cy="256" r="70" fill="none" stroke="#0c2a33" strokeWidth="10" />
      
      {/* Highlight */}
      <Path 
        d="M 320 208 A 72 72 0 0 0 200 230" 
        fill="none" 
        stroke="#9fb7c6" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        opacity="0.7" 
      />
      
      {/* Shading */}
      <Path 
        d="M 340 300 A 140 140 0 0 0 380 330" 
        fill="none" 
        stroke="#35525f" 
        strokeWidth="14" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        opacity="0.2" 
      />
    </Svg>
  );
}
