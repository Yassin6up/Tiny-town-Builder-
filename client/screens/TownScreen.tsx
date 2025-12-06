import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useGame } from "@/lib/GameContext";
import { formatNumber } from "@/lib/gameData";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { CoinIcon } from "@/components/CoinIcon";
import { DistrictBackground } from "@/components/DistrictBackground";
import { BuildingGrid } from "@/components/BuildingGrid";
import { OfflineEarningsModal } from "@/components/OfflineEarningsModal";
import { BoostBanner } from "@/components/BoostBanner";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TownScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { state, tapChest, offlineEarnings, dismissOfflineEarnings } = useGame();

  const chestScale = useSharedValue(1);
  const chestRotation = useSharedValue(0);
  const coinBurstOpacity = useSharedValue(0);
  const coinBurstY = useSharedValue(0);

  const currentDistrict = state.districts.find(d => d.id === state.currentDistrict);

  const handleTapChest = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    chestScale.value = withSequence(
      withSpring(0.85, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 300 })
    );
    
    chestRotation.value = withSequence(
      withTiming(-3, { duration: 50 }),
      withTiming(3, { duration: 100 }),
      withTiming(0, { duration: 50 })
    );

    coinBurstOpacity.value = 1;
    coinBurstY.value = 0;
    coinBurstOpacity.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) });
    coinBurstY.value = withTiming(-60, { duration: 600, easing: Easing.out(Easing.ease) });

    tapChest();
  };

  const chestAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: chestScale.value },
      { rotate: `${chestRotation.value}deg` },
    ],
  }));

  const coinBurstStyle = useAnimatedStyle(() => ({
    opacity: coinBurstOpacity.value,
    transform: [{ translateY: coinBurstY.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <DistrictBackground districtId={state.currentDistrict} />
      
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable
          style={styles.districtSelector}
          onPress={() => navigation.navigate("DistrictSelector")}
        >
          <ThemedText style={styles.districtName}>
            {currentDistrict?.name ?? "Forest Valley"}
          </ThemedText>
          <Feather name="chevron-down" size={18} color={theme.darkWood} />
        </Pressable>

        <View style={[styles.coinDisplay, { backgroundColor: theme.cornsilk }]}>
          <CoinIcon size={24} />
          <ThemedText style={styles.coinText}>
            {formatNumber(state.coins)}
          </ThemedText>
        </View>

        <Pressable
          style={styles.settingsButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Feather name="settings" size={24} color={theme.darkWood} />
        </Pressable>
      </View>

      <BoostBanner />

      <View style={[styles.incomeDisplay, { backgroundColor: theme.sage }]}>
        <CoinIcon size={16} />
        <ThemedText style={styles.incomeText}>
          {formatNumber(state.incomePerSecond)}/sec
        </ThemedText>
      </View>

      <ScrollView
        style={styles.buildingArea}
        contentContainerStyle={{
          paddingTop: Spacing["3xl"],
          paddingBottom: tabBarHeight + 120,
          paddingHorizontal: Spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <BuildingGrid districtId={state.currentDistrict} />
      </ScrollView>

      <View style={[styles.chestContainer, { bottom: tabBarHeight + Spacing.xl }]}>
        <AnimatedPressable
          onPress={handleTapChest}
          style={[styles.chestButton, chestAnimatedStyle]}
        >
          <Animated.View style={[styles.coinBurst, coinBurstStyle]}>
            <ThemedText style={styles.coinBurstText}>+1</ThemedText>
          </Animated.View>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.chestImage}
            resizeMode="contain"
          />
        </AnimatedPressable>
        <ThemedText style={styles.tapHint}>Tap for coins!</ThemedText>
      </View>

      <OfflineEarningsModal
        visible={offlineEarnings > 0}
        earnings={offlineEarnings}
        onDismiss={dismissOfflineEarnings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    zIndex: 10,
  },
  districtSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  districtName: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: Colors.light.darkWood,
  },
  coinDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    ...Shadows.card,
  },
  coinText: {
    fontFamily: "FredokaOne",
    fontSize: 20,
    color: Colors.light.gold,
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  incomeDisplay: {
    position: "absolute",
    top: 100,
    right: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    zIndex: 10,
  },
  incomeText: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    color: Colors.light.warmWhite,
  },
  buildingArea: {
    flex: 1,
  },
  chestContainer: {
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    zIndex: 20,
  },
  chestButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.light.sandyBrown,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.floating,
  },
  chestImage: {
    width: 60,
    height: 60,
  },
  coinBurst: {
    position: "absolute",
    top: -20,
  },
  coinBurstText: {
    fontFamily: "FredokaOne",
    fontSize: 24,
    color: Colors.light.gold,
    textShadowColor: Colors.light.darkWood,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tapHint: {
    fontFamily: "Nunito",
    fontSize: 12,
    color: Colors.light.darkWood,
    marginTop: Spacing.xs,
    opacity: 0.7,
  },
});
