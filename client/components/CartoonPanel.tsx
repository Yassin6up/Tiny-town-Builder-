import React from 'react';
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { CartoonColors, CartoonShadows, CartoonBorders, CartoonRadius } from '@/constants/cartoonUI';
import { WoodTextureSvg, StoneTextureSvg, GoldTextureSvg } from '@/components/textures';

interface CartoonPanelProps {
  children: React.ReactNode;
  variant?: 'wood' | 'wood-dark' | 'wood-rich' | 'stone' | 'stone-dark' | 'gold' | 'gold-bronze';
  style?: ViewStyle;
  width?: number;
  height?: number;
}

const screenWidth = Dimensions.get('window').width;

export function CartoonPanel({ 
  children, 
  variant = 'wood', 
  style,
  width = screenWidth - 40,
  height = 300,
}: CartoonPanelProps) {
  const textureConfig = {
    'wood': { Component: WoodTextureSvg, subVariant: 'light' as const, borderColor: '#5C330F' },
    'wood-dark': { Component: WoodTextureSvg, subVariant: 'dark' as const, borderColor: '#3D1F0A' },
    'wood-rich': { Component: WoodTextureSvg, subVariant: 'rich' as const, borderColor: '#6B3410' },
    'stone': { Component: StoneTextureSvg, subVariant: 'gray' as const, borderColor: '#1F2937' },
    'stone-dark': { Component: StoneTextureSvg, subVariant: 'dark' as const, borderColor: '#111827' },
    'gold': { Component: GoldTextureSvg, subVariant: 'bright' as const, borderColor: '#8B6914' },
    'gold-bronze': { Component: GoldTextureSvg, subVariant: 'bronze' as const, borderColor: '#6B3E1A' },
  };

  const texture = textureConfig[variant];
  const TextureComponent = texture.Component;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.panelWrapper, { 
        borderColor: texture.borderColor,
        width,
        minHeight: height,
      }]}>
        {/* SVG Texture Background */}
        <View style={styles.textureContainer}>
          <TextureComponent
            width={width}
            height={height}
            variant={texture.subVariant}
            borderRadius={CartoonRadius.large}
          />
        </View>

        {/* Top highlight for 3D effect */}
        <View style={styles.highlight} />
        
        {/* Content Overlay */}
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CartoonShadows.large,
  },
  panelWrapper: {
    borderRadius: CartoonRadius.large,
    borderWidth: CartoonBorders.thick,
    overflow: 'hidden',
    position: 'relative',
  },
  textureContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopLeftRadius: CartoonRadius.large,
    borderTopRightRadius: CartoonRadius.large,
    zIndex: 1,
  },
  content: {
    padding: 16,
    zIndex: 2,
    position: 'relative',
  },
});
