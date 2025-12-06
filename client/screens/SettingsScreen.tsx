import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [hapticEnabled, setHapticEnabled] = React.useState(true);

  const handleResetData = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your progress? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("tiny_town_game_state");
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              Alert.alert("Progress Reset", "Your game has been reset. Please restart the app.");
            } catch (error) {
              console.error("Failed to reset:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText style={styles.sectionTitle}>Game Settings</ThemedText>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Feather name="volume-2" size={20} color={theme.darkWood} />
            <ThemedText style={styles.settingLabel}>Sound Effects</ThemedText>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: theme.lockGray, true: theme.sage }}
            thumbColor={Colors.light.warmWhite}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Feather name="smartphone" size={20} color={theme.darkWood} />
            <ThemedText style={styles.settingLabel}>Haptic Feedback</ThemedText>
          </View>
          <Switch
            value={hapticEnabled}
            onValueChange={setHapticEnabled}
            trackColor={{ false: theme.lockGray, true: theme.sage }}
            thumbColor={Colors.light.warmWhite}
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText style={styles.sectionTitle}>About</ThemedText>

        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabel}>App Version</ThemedText>
          <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabel}>Build</ThemedText>
          <ThemedText style={styles.infoValue}>2024.12.1</ThemedText>
        </View>
      </View>

      <Pressable
        onPress={handleResetData}
        style={[styles.dangerButton, { backgroundColor: theme.mutedRed }]}
      >
        <Feather name="trash-2" size={20} color={Colors.light.warmWhite} />
        <ThemedText style={styles.dangerButtonText}>Reset All Progress</ThemedText>
      </Pressable>

      <View style={styles.credits}>
        <ThemedText style={styles.creditsText}>
          Tiny Town Builder
        </ThemedText>
        <ThemedText style={styles.creditsSubtext}>
          Built with love for cozy gamers
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  sectionTitle: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: Colors.light.darkWood,
    marginBottom: Spacing.lg,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  settingLabel: {
    fontFamily: "Nunito",
    fontSize: 16,
    color: Colors.light.darkWood,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontFamily: "Nunito",
    fontSize: 16,
    color: Colors.light.darkWood,
  },
  infoValue: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 16,
    color: Colors.light.darkWood,
    opacity: 0.7,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  dangerButtonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: Colors.light.warmWhite,
  },
  credits: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  creditsText: {
    fontFamily: "FredokaOne",
    fontSize: 20,
    color: Colors.light.darkWood,
  },
  creditsSubtext: {
    fontFamily: "Nunito",
    fontSize: 14,
    color: Colors.light.darkWood,
    opacity: 0.6,
    marginTop: Spacing.xs,
  },
});
