import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

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
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
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
