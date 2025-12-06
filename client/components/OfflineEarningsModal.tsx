import React from "react";
import { View, StyleSheet, Modal, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { CoinIcon } from "@/components/CoinIcon";
import { formatNumber } from "@/lib/gameData";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";

interface OfflineEarningsModalProps {
  visible: boolean;
  earnings: number;
  onDismiss: () => void;
}

export function OfflineEarningsModal({
  visible,
  earnings,
  onDismiss,
}: OfflineEarningsModalProps) {
  const handleCollect = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Feather name="moon" size={40} color={Colors.light.skyBlue} />
          </View>

          <ThemedText style={styles.title}>Welcome Back!</ThemedText>
          <ThemedText style={styles.subtitle}>
            While you were away, your town earned:
          </ThemedText>

          <View style={styles.earningsRow}>
            <CoinIcon size={32} />
            <ThemedText style={styles.earningsAmount}>
              {formatNumber(earnings)}
            </ThemedText>
          </View>

          <Pressable onPress={handleCollect} style={styles.collectButton}>
            <ThemedText style={styles.collectButtonText}>Collect!</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  modalContent: {
    backgroundColor: Colors.light.cornsilk,
    borderRadius: BorderRadius.lg,
    padding: Spacing["3xl"],
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
    ...Shadows.floating,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.warmWhite,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: "FredokaOne",
    fontSize: 24,
    color: Colors.light.darkWood,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: "Nunito",
    fontSize: 16,
    color: Colors.light.darkWood,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  earningsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  earningsAmount: {
    fontFamily: "FredokaOne",
    fontSize: 36,
    color: Colors.light.gold,
  },
  collectButton: {
    backgroundColor: Colors.light.sage,
    paddingHorizontal: Spacing["3xl"],
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    ...Shadows.button,
  },
  collectButtonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: Colors.light.warmWhite,
  },
});
