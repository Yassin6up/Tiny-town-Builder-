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
import { StoneTextureSvg } from "@/components/textures";
import { useMusic } from "@/lib/MusicContext";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { isMusicEnabled, toggleMusic, setMusicVolume } = useMusic();
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [hapticEnabled, setHapticEnabled] = React.useState(true);

  // Lower music volume when on settings screen
  React.useEffect(() => {
    setMusicVolume(0.2);
    return () => {
      setMusicVolume(0.5); // Restore volume when leaving settings
    };
  }, [setMusicVolume]);

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
      <View style={styles.sectionWrapper}>
        <View style={styles.sectionTexture}>
          <StoneTextureSvg width={360} height={280} variant="gray" borderRadius={12} />
        </View>
        <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Game Settings</ThemedText>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Feather name="music" size={24} color={theme.sage} />
            <View style={styles.settingText}>
              <ThemedText style={styles.settingLabel}>Background Music</ThemedText>
              <ThemedText style={styles.settingDescription}>Play game music</ThemedText>
            </View>
          </View>
          <Switch
            value={isMusicEnabled}
            onValueChange={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleMusic();
            }}
            trackColor={{ false: theme.lockGray, true: theme.sage }}
          />
        </View>

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
      </View>

      <View style={styles.sectionWrapper}>
        <View style={styles.sectionTexture}>
          <StoneTextureSvg width={360} height={220} variant="blue" borderRadius={12} />
        </View>
        <View style={styles.section}>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  sectionWrapper: {
    position: "relative",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#5C5C5C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  sectionTexture: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  section: {
    position: "relative",
    zIndex: 1,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: "FredokaOne",
    fontSize: 20,
    color: "#2D3748",
    marginBottom: Spacing.lg,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm + 2,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  settingLabel: {
    fontFamily: "Nunito",
    fontSize: 16,
    color: "#2D3748",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: Spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm + 2,
  },
  infoLabel: {
    fontFamily: "Nunito",
    fontSize: 16,
    color: "#2D3748",
  },
  infoValue: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 16,
    color: "#718096",
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    backgroundColor: "#FC8181",
    shadowColor: "#FC8181",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  dangerButtonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  credits: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  creditsText: {
    fontFamily: "FredokaOne",
    fontSize: 22,
    color: "#2D3748",
  },
  creditsSubtext: {
    fontFamily: "Nunito",
    fontSize: 14,
    color: "#718096",
    marginTop: Spacing.xs,
  },
});
