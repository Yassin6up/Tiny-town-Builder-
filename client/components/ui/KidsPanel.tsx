import React from 'react';
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { KidsColors, KidsShadows, KidsRadius } from '@/constants/kidsCartoonTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface KidsPanelProps {
  children: React.ReactNode;
  variant?: 'white' | 'cream' | 'pink' | 'blue' | 'green' | 'purple' | 'gold';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  glow?: boolean;
}

const getVariantConfig = (variant: string) => {
  switch (variant) {
    case 'cream':
      return {
        colors: ['#FFF8E1', '#FFECB3'] as const,
        borderColor: '#FFE082',
      };
    case 'pink':
      return {
        colors: ['#FCE4EC', '#F8BBD9'] as const,
        borderColor: '#F48FB1',
      };
    case 'blue':
      return {
        colors: ['#E3F2FD', '#BBDEFB'] as const,
        borderColor: '#90CAF9',
      };
    case 'green':
      return {
        colors: ['#E8F5E9', '#C8E6C9'] as const,
        borderColor: '#A5D6A7',
      };
    case 'purple':
      return {
        colors: ['#F3E5F5', '#E1BEE7'] as const,
        borderColor: '#CE93D8',
      };
    case 'gold':
      return {
        colors: ['#FFFDE7', '#FFF9C4'] as const,
        borderColor: '#FFEE58',
      };
    case 'white':
    default:
      return {
        colors: ['#FFFFFF', '#F5F5F5'] as const,
        borderColor: '#E0E0E0',
      };
  }
};

const getPadding = (padding: string) => {
  switch (padding) {
    case 'none': return 0;
    case 'sm': return 12;
    case 'lg': return 24;
    case 'md':
    default: return 16;
  }
};

export function KidsPanel({
  children,
  variant = 'white',
  padding = 'md',
  style,
  glow = false,
}: KidsPanelProps) {
  const config = getVariantConfig(variant);

  return (
    <View
      style={[
        styles.container,
        KidsShadows.medium,
        glow && KidsShadows.glow(config.borderColor),
        style,
      ]}
    >
      <LinearGradient
        colors={config.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.gradient,
          { 
            padding: getPadding(padding),
            borderColor: config.borderColor,
          },
        ]}
      >
        <View style={styles.shine} />
        <View style={styles.content}>{children}</View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: KidsRadius.lg,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: KidsRadius.lg,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderTopLeftRadius: KidsRadius.lg,
    borderTopRightRadius: KidsRadius.lg,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
