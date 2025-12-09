import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { KidsColors, KidsShadows, KidsRadius } from '@/constants/kidsCartoonTheme';

type BadgeColor = 'green' | 'blue' | 'orange' | 'pink' | 'purple' | 'gold';

interface KidsStatBadgeProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  color?: BadgeColor;
  delay?: number;
}

const COLOR_CONFIG: Record<BadgeColor, { gradient: readonly [string, string]; border: string; icon: string }> = {
  green: { gradient: ['#C8E6C9', '#A5D6A7'], border: '#66BB6A', icon: '#2E7D32' },
  blue: { gradient: ['#BBDEFB', '#90CAF9'], border: '#42A5F5', icon: '#1565C0' },
  orange: { gradient: ['#FFE0B2', '#FFCC80'], border: '#FFA726', icon: '#EF6C00' },
  pink: { gradient: ['#F8BBD9', '#F48FB1'], border: '#EC407A', icon: '#C2185B' },
  purple: { gradient: ['#E1BEE7', '#CE93D8'], border: '#AB47BC', icon: '#7B1FA2' },
  gold: { gradient: ['#FFE082', '#FFD54F'], border: '#FFC107', icon: '#FF8F00' },
};

export function KidsStatBadge({ icon, label, value, color = 'green', delay = 0 }: KidsStatBadgeProps) {
  const config = COLOR_CONFIG[color];
  
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify().damping(12)}
      style={styles.container}
    >
      <LinearGradient
        colors={config.gradient}
        style={[styles.gradient, { borderColor: config.border }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.shine} />
        <View style={[styles.iconCircle, { backgroundColor: config.border }]}>
          <Feather name={icon} size={20} color="#FFFFFF" />
        </View>
        <View style={styles.content}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          <ThemedText style={[styles.value, { color: config.icon }]}>{value}</ThemedText>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    ...KidsShadows.medium,
    borderRadius: KidsRadius.lg,
    marginBottom: 12,
  },
  gradient: {
    padding: 14,
    borderRadius: KidsRadius.lg,
    borderWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  label: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#546E7A',
  },
  value: {
    fontFamily: 'FredokaOne',
    fontSize: 18,
  },
});
