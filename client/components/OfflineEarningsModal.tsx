import React from "react";
import { View, StyleSheet, Modal, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { CoinIcon } from "@/components/CoinIcon";
import { formatNumber } from "@/lib/gameData";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { WoodTextureSvg, GoldTextureSvg } from "@/components/textures";

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
        <View style={styles.modalWrapper}>
          <View style={styles.modalTexture}>
            <WoodTextureSvg width={320} height={360} variant="light" borderRadius={16} />
          </View>
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

          <View style={styles.collectButtonWrapper}>
            <View style={styles.collectButtonTexture}>
              <GoldTextureSvg width={200} height={56} variant="bright" borderRadius={28} />
            </View>
            <Pressable onPress={handleCollect} style={styles.collectButton}>
              <ThemedText style={styles.collectButtonText}>Collect!</ThemedText>
            </Pressable>
          </View>
          </View>
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
  modalWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: 320,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#8B6914",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    overflow: "hidden",
  },
  modalTexture: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  modalContent: {
    position: "relative",
    zIndex: 1,
    borderRadius: 16,
    padding: Spacing["3xl"],
    alignItems: "center",
    width: "100%",
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
    color: "#FFD700",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  collectButtonWrapper: {
    position: "relative",
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "#8B6914",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  collectButtonTexture: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  collectButton: {
    position: "relative",
    zIndex: 1,
    paddingHorizontal: Spacing["3xl"],
    paddingVertical: Spacing.lg,
    borderRadius: 28,
  },
  collectButtonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
