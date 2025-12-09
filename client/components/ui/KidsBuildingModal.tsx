import React from 'react';
import { View, StyleSheet, Modal, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  SlideInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { KidsColors, KidsShadows, KidsRadius, KidsSpacing, KidsAnimations } from '@/constants/kidsCartoonTheme';
import { KidsButton } from './KidsButton';
import { KidsPanel } from './KidsPanel';
import { BuildingIcon } from '@/components/BuildingIcon';
import { Building, formatNumber, getBuildingCost, getUpgradeCost } from '@/lib/gameData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface KidsBuildingModalProps {
  visible: boolean;
  building: Building | null;
  coins: number;
  diamonds: number;
  onClose: () => void;
  onBuy: () => void;
  onUpgrade: () => void;
}

function CoinSvg({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Defs>
        <RadialGradient id="modalCoin" cx="35%" cy="35%" r="60%">
          <Stop offset="0%" stopColor="#FFEB3B" />
          <Stop offset="50%" stopColor="#FFD700" />
          <Stop offset="100%" stopColor="#FFA000" />
        </RadialGradient>
      </Defs>
      <Circle cx="20" cy="20" r="18" fill="url(#modalCoin)" />
      <Circle cx="20" cy="20" r="14" fill="#FFC107" stroke="#FFB300" strokeWidth="1" />
    </Svg>
  );
}

function DiamondSvg({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Defs>
        <RadialGradient id="modalDiamond" cx="40%" cy="30%" r="70%">
          <Stop offset="0%" stopColor="#80DEEA" />
          <Stop offset="50%" stopColor="#26C6DA" />
          <Stop offset="100%" stopColor="#00838F" />
        </RadialGradient>
      </Defs>
      <Circle cx="20" cy="20" r="16" fill="url(#modalDiamond)" />
    </Svg>
  );
}

function StatRow({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={styles.statRow}>
      <Feather name={icon as any} size={18} color={color} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

export function KidsBuildingModal({
  visible,
  building,
  coins,
  diamonds,
  onClose,
  onBuy,
  onUpgrade,
}: KidsBuildingModalProps) {
  const iconScale = useSharedValue(1);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  if (!building) return null;

  const cost = getBuildingCost(building);
  const upgradeCost = getUpgradeCost(building);
  const canAffordBuy = coins >= cost && diamonds >= (building.diamondCost ?? 0);
  const canAffordUpgrade = building.owned > 0 && coins >= upgradeCost;
  const maxLevel = building.level >= 5;

  const tierColors = {
    common: { bg: '#E8F5E9', border: '#A5D6A7', text: '#43A047' },
    rare: { bg: '#E3F2FD', border: '#90CAF9', text: '#1976D2' },
    legendary: { bg: '#FFF8E1', border: '#FFE082', text: '#F57C00' },
  };

  const tierConfig = tierColors[building.tier];

  const handleBuy = () => {
    if (canAffordBuy) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      iconScale.value = withSequence(
        withSpring(1.2, KidsAnimations.bounce),
        withSpring(1, KidsAnimations.spring)
      );
      onBuy();
    }
  };

  const handleUpgrade = () => {
    if (canAffordUpgrade && !maxLevel) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      iconScale.value = withSequence(
        withSpring(1.2, KidsAnimations.bounce),
        withSpring(1, KidsAnimations.spring)
      );
      onUpgrade();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View entering={SlideInUp.springify().damping(15)} style={styles.modalContainer}>
          <KidsPanel variant="white" padding="none" style={styles.modal}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              style={styles.closeButton}
            >
              <LinearGradient colors={['#EF5350', '#E53935']} style={styles.closeButtonGradient}>
                <Feather name="x" size={18} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>

            <View style={styles.header}>
              <LinearGradient
                colors={[tierConfig.bg, '#FFFFFF']}
                style={styles.headerGradient}
              >
                <Animated.View style={iconAnimatedStyle}>
                  <View style={[styles.iconContainer, { borderColor: tierConfig.border }]}>
                    <BuildingIcon type={building.iconType} tier={building.tier} size={90} />
                  </View>
                </Animated.View>
              </LinearGradient>
            </View>

            <View style={styles.content}>
              <View style={styles.titleRow}>
                <Text style={styles.buildingName}>{building.name}</Text>
                <View style={[styles.tierBadge, { backgroundColor: tierConfig.bg }]}>
                  <Text style={[styles.tierText, { color: tierConfig.text }]}>
                    {building.tier.charAt(0).toUpperCase() + building.tier.slice(1)}
                  </Text>
                </View>
              </View>

              <Text style={styles.description}>{building.description}</Text>

              <View style={styles.statsContainer}>
                <StatRow
                  icon="trending-up"
                  label="Income"
                  value={`+${formatNumber(building.baseIncome)}/sec`}
                  color="#66BB6A"
                />
                <StatRow
                  icon="layers"
                  label="Owned"
                  value={`${building.owned}`}
                  color="#42A5F5"
                />
                <StatRow
                  icon="star"
                  label="Level"
                  value={`${building.level} / 5`}
                  color="#FFA726"
                />
              </View>

              <View style={styles.actionsContainer}>
                <View style={styles.actionCard}>
                  <Text style={styles.actionTitle}>Buy Building</Text>
                  <View style={styles.costRow}>
                    <CoinSvg size={22} />
                    <Text style={[styles.costText, { color: canAffordBuy ? '#FFA726' : '#EF5350' }]}>
                      {formatNumber(cost)}
                    </Text>
                    {building.diamondCost ? (
                      <>
                        <DiamondSvg size={18} />
                        <Text style={styles.diamondCost}>{building.diamondCost}</Text>
                      </>
                    ) : null}
                  </View>
                  <KidsButton
                    title="Buy"
                    onPress={handleBuy}
                    variant={canAffordBuy ? 'primary' : 'danger'}
                    size="md"
                    fullWidth
                    disabled={!canAffordBuy}
                  />
                </View>

                {building.owned > 0 && (
                  <View style={styles.actionCard}>
                    <Text style={styles.actionTitle}>
                      {maxLevel ? 'Max Level!' : 'Upgrade'}
                    </Text>
                    {!maxLevel && (
                      <View style={styles.costRow}>
                        <CoinSvg size={22} />
                        <Text style={[styles.costText, { color: canAffordUpgrade ? '#FFA726' : '#EF5350' }]}>
                          {formatNumber(upgradeCost)}
                        </Text>
                      </View>
                    )}
                    <KidsButton
                      title={maxLevel ? 'Maxed' : `Level ${building.level + 1}`}
                      onPress={handleUpgrade}
                      variant={maxLevel ? 'secondary' : canAffordUpgrade ? 'accent' : 'danger'}
                      size="md"
                      fullWidth
                      disabled={maxLevel || !canAffordUpgrade}
                    />
                  </View>
                )}
              </View>
            </View>
          </KidsPanel>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: KidsSpacing.lg,
  },
  modalContainer: {
    width: Math.min(SCREEN_WIDTH - 32, 360),
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  modal: {
    borderRadius: KidsRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    borderRadius: 16,
    overflow: 'hidden',
    ...KidsShadows.soft,
  },
  closeButtonGradient: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  header: {
    overflow: 'hidden',
    borderTopLeftRadius: KidsRadius.xl,
    borderTopRightRadius: KidsRadius.xl,
  },
  headerGradient: {
    alignItems: 'center',
    paddingVertical: KidsSpacing.xl,
    paddingTop: KidsSpacing.xxl,
  },
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: KidsRadius.lg,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    ...KidsShadows.medium,
  },
  content: {
    padding: KidsSpacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: KidsSpacing.xs,
  },
  buildingName: {
    fontFamily: 'FredokaOne',
    fontSize: 22,
    color: '#37474F',
  },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: KidsRadius.round,
  },
  tierText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 11,
  },
  description: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#607D8B',
    textAlign: 'center',
    marginBottom: KidsSpacing.md,
  },
  statsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: KidsRadius.md,
    padding: KidsSpacing.md,
    gap: KidsSpacing.sm,
    marginBottom: KidsSpacing.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    flex: 1,
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#607D8B',
  },
  statValue: {
    fontFamily: 'FredokaOne',
    fontSize: 16,
  },
  actionsContainer: {
    gap: KidsSpacing.md,
  },
  actionCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: KidsRadius.md,
    padding: KidsSpacing.md,
    alignItems: 'center',
    gap: KidsSpacing.sm,
  },
  actionTitle: {
    fontFamily: 'FredokaOne',
    fontSize: 16,
    color: '#37474F',
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  costText: {
    fontFamily: 'FredokaOne',
    fontSize: 18,
  },
  diamondCost: {
    fontFamily: 'FredokaOne',
    fontSize: 14,
    color: '#00838F',
  },
});
