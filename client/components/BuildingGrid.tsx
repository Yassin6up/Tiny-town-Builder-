import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { BuildingIcon } from "@/components/BuildingIcon";
import { useGame } from "@/lib/GameContext";
import { DistrictId, formatNumber } from "@/lib/gameData";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

interface BuildingGridProps {
  districtId: DistrictId;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function BuildingGrid({ districtId }: BuildingGridProps) {
  const navigation = useNavigation<NavigationProp>();
  const { state } = useGame();

  const districtBuildings = state.buildings.filter(
    b => b.districtId === districtId && b.owned > 0
  );

  if (districtBuildings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>
          No buildings yet! Visit the shop to buy some.
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {districtBuildings.map((building, index) => (
        <AnimatedBuilding
          key={building.id}
          building={building}
          index={index}
          onPress={() => navigation.navigate("BuildingDetail", { buildingId: building.id })}
        />
      ))}
    </View>
  );
}

interface AnimatedBuildingProps {
  building: ReturnType<typeof useGame>["state"]["buildings"][0];
  index: number;
  onPress: () => void;
}

function AnimatedBuilding({ building, index, onPress }: AnimatedBuildingProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (building.iconType === "windmill") {
      rotation.value = withRepeat(
        withTiming(360, { duration: 8000 }),
        -1,
        false
      );
    }

    scale.value = withDelay(
      index * 100,
      withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      ...(building.iconType === "windmill" ? [{ rotate: `${rotation.value}deg` }] : []),
    ],
  }));

  const district = useGame().state.districts.find(d => d.id === building.districtId);
  const income = building.baseIncome * building.owned * (district?.incomeMultiplier ?? 1) * (1 + (building.level - 1) * 0.5);

  return (
    <Pressable onPress={onPress} style={styles.buildingCard}>
      <Animated.View style={animatedStyle}>
        <BuildingIcon type={building.iconType} size={70} />
      </Animated.View>
      <View style={styles.buildingInfo}>
        <ThemedText style={styles.buildingName} numberOfLines={1}>
          {building.name}
        </ThemedText>
        <ThemedText style={styles.buildingCount}>x{building.owned}</ThemedText>
        <ThemedText style={styles.buildingIncome}>
          +{formatNumber(income)}/s
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    justifyContent: "center",
  },
  buildingCard: {
    width: 110,
    alignItems: "center",
    padding: Spacing.md,
    backgroundColor: Colors.light.cornsilk,
    borderRadius: BorderRadius.lg,
    ...Shadows.card,
  },
  buildingInfo: {
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  buildingName: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 12,
    color: Colors.light.darkWood,
    textAlign: "center",
  },
  buildingCount: {
    fontFamily: "FredokaOne",
    fontSize: 14,
    color: Colors.light.sage,
  },
  buildingIncome: {
    fontFamily: "Nunito",
    fontSize: 11,
    color: Colors.light.gold,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: Spacing["5xl"],
  },
  emptyText: {
    fontFamily: "Nunito",
    fontSize: 16,
    color: Colors.light.darkWood,
    opacity: 0.6,
    textAlign: "center",
  },
});
