import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { KidsColors, KidsShadows, KidsRadius } from '@/constants/kidsCartoonTheme';
import { KidsGameButton } from './KidsGameButton';

interface KidsBoostCardProps {
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
  disabled?: boolean;
  isPremium?: boolean;
  icon: keyof typeof Feather.glyphMap;
  delay?: number;
}

export function KidsBoostCard({
  title,
  description,
  buttonText,
  onPress,
  disabled = false,
  isPremium = false,
  icon,
  delay = 0,
}: KidsBoostCardProps) {
  const glowAnim = React.useRef(0);
  
  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    ),
  }));
  
  const gradientColors = isPremium
    ? (['#F3E5F5', '#E1BEE7'] as const)
    : (['#E8F5E9', '#C8E6C9'] as const);
  
  const borderColor = isPremium ? '#AB47BC' : '#66BB6A';
  const iconBgColor = isPremium ? '#AB47BC' : '#4CAF50';
  
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify().damping(12)}
      style={styles.container}
    >
      <LinearGradient
        colors={gradientColors}
        style={[styles.gradient, { borderColor }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Animated.View style={[styles.shine, isPremium && shimmerStyle]} />
        
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Feather name="star" size={12} color="#FFFFFF" />
            <ThemedText style={styles.premiumText}>Premium</ThemedText>
          </View>
        )}
        
        <View style={styles.row}>
          <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
            <Feather name={icon} size={28} color="#FFFFFF" />
          </View>
          
          <View style={styles.content}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText style={styles.description}>{description}</ThemedText>
          </View>
        </View>
        
        <KidsGameButton
          title={buttonText}
          onPress={onPress}
          variant={isPremium ? 'premium' : 'primary'}
          size="md"
          fullWidth
          disabled={disabled}
        />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    ...KidsShadows.float,
    borderRadius: KidsRadius.xl,
  },
  gradient: {
    padding: 18,
    borderRadius: KidsRadius.xl,
    borderWidth: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  premiumBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#AB47BC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 14,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'FredokaOne',
    fontSize: 18,
    color: '#37474F',
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#607D8B',
    lineHeight: 20,
  },
});
