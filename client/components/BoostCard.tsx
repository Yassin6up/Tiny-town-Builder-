import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { WoodTextureSvg, GoldTextureSvg } from "@/components/textures";

interface BoostCardProps {
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
  icon: keyof typeof Feather.glyphMap;
  disabled?: boolean;
  isPremium?: boolean;
}

export function BoostCard({
  title,
  description,
  buttonText,
  onPress,
  icon,
  disabled = false,
  isPremium = false,
}: BoostCardProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardTexture}>
        {isPremium ? (
          <GoldTextureSvg width={360} height={100} variant="bright" borderRadius={12} />
        ) : (
          <WoodTextureSvg width={360} height={100} variant="light" borderRadius={12} />
        )}
      </View>
      <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isPremium ? theme.gold : theme.sage },
        ]}
      >
        <Feather name={icon} size={24} color={Colors.light.warmWhite} />
      </View>
      <View style={styles.info}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.description}>{description}</ThemedText>
      </View>
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        style={[
          styles.button,
          {
            backgroundColor: disabled
              ? theme.lockGray
              : isPremium
                ? theme.gold
                : theme.sage,
          },
        ]}
      >
        <ThemedText style={styles.buttonText}>{buttonText}</ThemedText>
      </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    position: "relative",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#8B6914",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  cardTexture: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  container: {
    position: "relative",
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  title: {
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: Colors.light.darkWood,
  },
  description: {
    fontFamily: "Nunito",
    fontSize: 13,
    color: Colors.light.darkWood,
    opacity: 0.7,
    marginTop: 2,
  },
  button: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  buttonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    color: Colors.light.warmWhite,
  },
});
