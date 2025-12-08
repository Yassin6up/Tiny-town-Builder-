import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { CartoonColors, CartoonShadows, CartoonBorders, CartoonRadius } from '@/constants/cartoonUI';
import { WoodTextureSvg, StoneTextureSvg, GoldTextureSvg, MetalTextureSvg } from '@/components/textures';
import * as Haptics from 'expo-haptics';

interface CartoonButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'wood' | 'wood-dark' | 'wood-rich' | 'stone' | 'stone-dark' | 'gold' | 'gold-bronze' | 'metal' | 'metal-steel';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
}

export function CartoonButton({
  title,
  onPress,
  variant = 'wood',
  size = 'medium',
  icon,
  disabled = false,
  style,
}: CartoonButtonProps) {
  const [pressed, setPressed] = React.useState(false);

  // Map variants to texture components and their sub-variants
  const textureConfig = {
    'wood': { Component: WoodTextureSvg, subVariant: 'light' as const, borderColor: '#5C330F' },
    'wood-dark': { Component: WoodTextureSvg, subVariant: 'dark' as const, borderColor: '#3D1F0A' },
    'wood-rich': { Component: WoodTextureSvg, subVariant: 'rich' as const, borderColor: '#6B3410' },
    'stone': { Component: StoneTextureSvg, subVariant: 'gray' as const, borderColor: '#1F2937' },
    'stone-dark': { Component: StoneTextureSvg, subVariant: 'dark' as const, borderColor: '#111827' },
    'gold': { Component: GoldTextureSvg, subVariant: 'bright' as const, borderColor: '#8B6914' },
    'gold-bronze': { Component: GoldTextureSvg, subVariant: 'bronze' as const, borderColor: '#6B3E1A' },
    'metal': { Component: MetalTextureSvg, subVariant: 'silver' as const, borderColor: '#2C3E50' },
    'metal-steel': { Component: MetalTextureSvg, subVariant: 'steel' as const, borderColor: '#1A252F' },
  };

  const sizeStyles = {
    small: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 14, height: 40 },
    medium: { paddingHorizontal: 24, paddingVertical: 12, fontSize: 16, height: 50 },
    large: { paddingHorizontal: 32, paddingVertical: 16, fontSize: 18, height: 60 },
  };

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const texture = textureConfig[variant];
  const TextureComponent = texture.Component;

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      style={[
        styles.buttonContainer,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={[styles.buttonWrapper, { 
        borderColor: texture.borderColor,
        height: sizeStyles[size].height,
      }]}>
        {/* SVG Texture Background */}
        <View style={styles.textureContainer}>
          <TextureComponent
            width={300}
            height={sizeStyles[size].height}
            variant={texture.subVariant}
            borderRadius={CartoonRadius.large}
          />
        </View>

        {/* Content Overlay */}
        <View style={[styles.contentOverlay, {
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          paddingVertical: sizeStyles[size].paddingVertical,
        }]}>
          {/* Top highlight for 3D effect */}
          <View style={styles.highlight} />
          
          <View style={styles.content}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text
              style={[
                styles.text,
                { fontSize: sizeStyles[size].fontSize },
              ]}
            >
              {title}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    ...CartoonShadows.large,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonWrapper: {
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
  contentOverlay: {
    position: 'relative',
    zIndex: 1,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: CartoonRadius.large,
    borderTopRightRadius: CartoonRadius.large,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontFamily: 'FredokaOne',
    color: CartoonColors.buttonText,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
});
