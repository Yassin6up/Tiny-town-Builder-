import React from 'react';
import { View, StyleSheet, Pressable, Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/ThemedText';
import { CoinIcon } from '@/components/CoinIcon';
import { formatNumber } from '@/lib/gameData';
import { KidsColors, KidsShadows, KidsRadius, KidsAnimations } from '@/constants/kidsCartoonTheme';
import { KidsGameButton } from './KidsGameButton';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface KidsDistrictCardProps {
  name: string;
  description: string;
  logo: ImageSourcePropType;
  isUnlocked: boolean;
  isSelected: boolean;
  unlockCost: number;
  incomeMultiplier: number;
  canAfford: boolean;
  onSelect: () => void;
  onUnlock: () => void;
  delay?: number;
  themeColor: string;
}

export function KidsDistrictCard({
  name,
  description,
  logo,
  isUnlocked,
  isSelected,
  unlockCost,
  incomeMultiplier,
  canAfford,
  onSelect,
  onUnlock,
  delay = 0,
  themeColor,
}: KidsDistrictCardProps) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    if (isUnlocked || canAfford) {
      scale.value = withSpring(0.97, KidsAnimations.pop);
    }
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, KidsAnimations.bounce);
  };
  
  const handlePress = () => {
    if (isUnlocked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelect();
    } else if (canAfford) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onUnlock();
    }
  };
  
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(12)}
    >
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, animatedStyle, !isUnlocked && !canAfford && styles.locked]}
      >
        <LinearGradient
          colors={isUnlocked ? ['#FFFFFF', '#F5F5F5'] : ['#F5F5F5', '#E0E0E0']}
          style={[
            styles.gradient,
            isSelected && { borderColor: '#FFD700', borderWidth: 4 },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.shine} />
          
          <View style={[styles.logoContainer, { backgroundColor: themeColor }]}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            {!isUnlocked && (
              <View style={styles.lockOverlay}>
                <View style={styles.lockCircle}>
                  <Feather name="lock" size={24} color="#FFFFFF" />
                </View>
              </View>
            )}
            {isUnlocked && isSelected && (
              <View style={styles.checkBadge}>
                <Feather name="check" size={16} color="#FFFFFF" />
              </View>
            )}
          </View>
          
          <View style={styles.content}>
            <ThemedText style={styles.name}>{name}</ThemedText>
            <ThemedText style={styles.description} numberOfLines={2}>{description}</ThemedText>
            
            <View style={styles.bonusRow}>
              <View style={[styles.bonusBadge, { backgroundColor: themeColor }]}>
                <Feather name="trending-up" size={14} color="#FFFFFF" />
                <ThemedText style={styles.bonusText}>{incomeMultiplier}x Income</ThemedText>
              </View>
            </View>
          </View>
          
          {!isUnlocked && (
            <View style={styles.unlockSection}>
              <View style={styles.costRow}>
                <CoinIcon size={20} />
                <ThemedText style={styles.costText}>{formatNumber(unlockCost)}</ThemedText>
              </View>
              <KidsGameButton
                title={canAfford ? "Unlock!" : "Need More"}
                onPress={onUnlock}
                variant={canAfford ? 'primary' : 'secondary'}
                size="sm"
                disabled={!canAfford}
              />
            </View>
          )}
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    ...KidsShadows.float,
    borderRadius: KidsRadius.xl,
  },
  locked: {
    opacity: 0.7,
  },
  gradient: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: KidsRadius.xl,
    borderWidth: 3,
    borderColor: '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  logoContainer: {
    width: 85,
    height: 85,
    borderRadius: KidsRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  logo: {
    width: '90%',
    height: '90%',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'FredokaOne',
    fontSize: 20,
    color: '#37474F',
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    color: '#78909C',
    marginBottom: 8,
  },
  bonusRow: {
    flexDirection: 'row',
  },
  bonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bonusText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  unlockSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    gap: 8,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  costText: {
    fontFamily: 'FredokaOne',
    fontSize: 16,
    color: '#FF8F00',
  },
});
