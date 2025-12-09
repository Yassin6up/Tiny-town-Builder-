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
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { KidsColors, KidsGradients, KidsRadius, KidsShadows } from "@/constants/kidsCartoonTheme";
import { useMusic } from "@/lib/MusicContext";
import { KidsGamePanel } from "@/components/ui/KidsGamePanel";
import { KidsGameButton } from "@/components/ui/KidsGameButton";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { isMusicEnabled, toggleMusic, setMusicVolume } = useMusic();
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [hapticEnabled, setHapticEnabled] = React.useState(true);

  React.useEffect(() => {
    setMusicVolume(0.2);
    return () => {
      setMusicVolume(0.5);
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
      style={styles.container}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <KidsGamePanel variant="white" style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Game Settings</ThemedText>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconWrapper, { backgroundColor: KidsColors.bubblegumPink }]}>
              <Feather name="music" size={20} color="#FFFFFF" />
            </View>
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
            trackColor={{ false: "#E0E0E0", true: KidsColors.mintGreen }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconWrapper, { backgroundColor: KidsColors.skyBlue }]}>
              <Feather name="volume-2" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.settingText}>
              <ThemedText style={styles.settingLabel}>Sound Effects</ThemedText>
              <ThemedText style={styles.settingDescription}>Tap and collect sounds</ThemedText>
            </View>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: "#E0E0E0", true: KidsColors.mintGreen }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconWrapper, { backgroundColor: KidsColors.lavenderPurple }]}>
              <Feather name="smartphone" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.settingText}>
              <ThemedText style={styles.settingLabel}>Haptic Feedback</ThemedText>
              <ThemedText style={styles.settingDescription}>Vibration on tap</ThemedText>
            </View>
          </View>
          <Switch
            value={hapticEnabled}
            onValueChange={setHapticEnabled}
            trackColor={{ false: "#E0E0E0", true: KidsColors.mintGreen }}
            thumbColor="#FFFFFF"
          />
        </View>
      </KidsGamePanel>

      <KidsGamePanel variant="blue" style={styles.section}>
        <ThemedText style={styles.sectionTitleWhite}>About</ThemedText>

        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabelWhite}>App Version</ThemedText>
          <View style={styles.versionBadge}>
            <ThemedText style={styles.versionText}>1.0.0</ThemedText>
          </View>
        </View>

        <View style={styles.dividerLight} />

        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabelWhite}>Build</ThemedText>
          <View style={styles.versionBadge}>
            <ThemedText style={styles.versionText}>2024.12.1</ThemedText>
          </View>
        </View>
      </KidsGamePanel>

      <KidsGameButton
        variant="red"
        size="large"
        onPress={handleResetData}
        style={styles.dangerButton}
      >
        <View style={styles.dangerButtonContent}>
          <Feather name="trash-2" size={22} color="#FFFFFF" />
          <ThemedText style={styles.dangerButtonText}>Reset All Progress</ThemedText>
        </View>
      </KidsGameButton>

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
    backgroundColor: "#E8F4FD",
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: "FredokaOne",
    fontSize: 22,
    color: "#2D3748",
    marginBottom: Spacing.lg,
  },
  sectionTitleWhite: {
    fontFamily: "FredokaOne",
    fontSize: 22,
    color: "#FFFFFF",
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
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: KidsRadius.md,
    justifyContent: "center",
    alignItems: "center",
    ...KidsShadows.soft,
  },
  settingLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#2D3748",
  },
  settingDescription: {
    fontFamily: "Nunito",
    fontSize: 13,
    color: "#718096",
    marginTop: 2,
  },
  divider: {
    height: 2,
    backgroundColor: "#E8F4FD",
    marginVertical: Spacing.sm,
    borderRadius: 1,
  },
  dividerLight: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: Spacing.sm,
    borderRadius: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  infoLabelWhite: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  versionBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: KidsRadius.round,
  },
  versionText: {
    fontFamily: "FredokaOne",
    fontSize: 14,
    color: "#FFFFFF",
  },
  dangerButton: {
    marginBottom: Spacing.xl,
  },
  dangerButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  dangerButtonText: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: "#FFFFFF",
  },
  credits: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  creditsText: {
    fontFamily: "FredokaOne",
    fontSize: 24,
    color: "#2D3748",
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  creditsSubtext: {
    fontFamily: "Nunito",
    fontSize: 14,
    color: "#718096",
    marginTop: Spacing.xs,
  },
});
