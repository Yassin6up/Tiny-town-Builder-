import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "./ThemedText";
import { DiamondIcon } from "./DiamondIcon";
import { CartoonPanel } from "./CartoonPanel";
import { CartoonButton } from "./CartoonButton";
import { BounceIn } from "./CartoonAnimations";
import { CartoonColors, CartoonSpacing } from "@/constants/cartoonUI";
import { WoodTextureSvg } from "./textures";

interface DiamondShopModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchase: (diamonds: number, cost: number) => void;
  onWatchAd: () => void;
}

export function DiamondShopModal({
  visible,
  onClose,
  onPurchase,
  onWatchAd,
}: DiamondShopModalProps) {
  
  const diamondPacks = [
    { diamonds: 10, cost: 0.99, popular: false },
    { diamonds: 50, cost: 3.99, popular: true },
    { diamonds: 150, cost: 9.99, popular: false },
    { diamonds: 500, cost: 24.99, popular: false },
  ];

  const handlePurchase = (diamonds: number, cost: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Purchase Diamonds",
      `Buy ${diamonds} diamonds for $${cost.toFixed(2)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Buy",
          onPress: () => onPurchase(diamonds, cost),
        },
      ]
    );
  };

  const handleWatchAd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onWatchAd();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BounceIn>
          <CartoonPanel variant="wood-rich" style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <DiamondIcon size={40} />
              </View>
              <ThemedText style={styles.title}>Diamond Shop</ThemedText>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                }}
                style={styles.closeButton}
              >
                <Feather name="x" size={28} color="#FFFFFF" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* Watch Ad Option */}
              <View style={styles.adCardWrapper}>
                <View style={styles.textureBackground}>
                  <WoodTextureSvg width={300} height={100} variant="light" borderRadius={20} />
                </View>
                <Pressable style={styles.adCard} onPress={handleWatchAd}>
                  <View style={styles.adIconContainer}>
                    <Feather name="video" size={40} color="#FF6B9D" />
                  </View>
                  <View style={styles.adInfo}>
                    <ThemedText style={styles.adTitle}>Watch Ad</ThemedText>
                    <ThemedText style={styles.adSubtitle}>Get 1 Diamond Free!</ThemedText>
                  </View>
                  <View style={styles.adReward}>
                    <DiamondIcon size={32} />
                    <ThemedText style={styles.adRewardText}>+1</ThemedText>
                  </View>
                </Pressable>
              </View>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <ThemedText style={styles.dividerText}>OR BUY DIAMONDS</ThemedText>
                <View style={styles.dividerLine} />
              </View>

              {/* Diamond Packs */}
              {diamondPacks.map((pack, index) => (
                <View key={index} style={styles.packCardWrapper}>
                  <View style={styles.textureBackground}>
                    <WoodTextureSvg 
                      width={300} 
                      height={120} 
                      variant={pack.popular ? 'rich' : 'dark'} 
                      borderRadius={20} 
                    />
                  </View>
                  <Pressable
                    style={[styles.packCard, pack.popular && styles.popularPackCard]}
                    onPress={() => handlePurchase(pack.diamonds, pack.cost)}
                  >
                    {pack.popular && (
                      <View style={styles.popularBadge}>
                        <Feather name="star" size={14} color="#FFD700" />
                        <ThemedText style={styles.popularText}>BEST VALUE</ThemedText>
                      </View>
                    )}
                    <View style={styles.packIcon}>
                      <DiamondIcon size={48} />
                      <ThemedText style={styles.packAmount}>{pack.diamonds}</ThemedText>
                    </View>
                    <View style={styles.packInfo}>
                      <ThemedText style={styles.packDiamonds}>
                        {pack.diamonds} Diamonds
                      </ThemedText>
                      <CartoonButton
                        title={`$${pack.cost.toFixed(2)}`}
                        onPress={() => handlePurchase(pack.diamonds, pack.cost)}
                        variant="gold"
                        size="small"
                      />
                    </View>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </CartoonPanel>
        </BounceIn>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: CartoonSpacing.lg,
  },
  modalContainer: {
    width: 350,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: CartoonSpacing.md,
  },
  headerIcon: {
    width: 50,
    height: 50,
    backgroundColor: CartoonColors.white,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: CartoonColors.blue.main,
  },
  title: {
    fontFamily: "FredokaOne",
    fontSize: 24,
    color: CartoonColors.white,
    flex: 1,
    marginLeft: CartoonSpacing.sm,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: CartoonSpacing.xs,
  },
  textureBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  adCardWrapper: {
    position: 'relative',
    marginBottom: CartoonSpacing.md,
    borderRadius: 20,
    overflow: 'hidden',
  },
  adCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: CartoonSpacing.md,
    position: 'relative',
    zIndex: 1,
  },
  adIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: CartoonColors.white,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FF6B9D",
  },
  adInfo: {
    flex: 1,
    marginLeft: CartoonSpacing.sm,
  },
  adTitle: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: CartoonColors.white,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  adSubtitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    color: CartoonColors.white,
    opacity: 0.9,
  },
  adReward: {
    alignItems: "center",
  },
  adRewardText: {
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: CartoonColors.white,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: CartoonSpacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    fontFamily: "Nunito-Bold",
    fontSize: 12,
    color: CartoonColors.white,
    marginHorizontal: CartoonSpacing.sm,
  },
  packCardWrapper: {
    position: 'relative',
    marginBottom: CartoonSpacing.md,
    borderRadius: 20,
    overflow: 'hidden',
  },
  packCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: CartoonSpacing.md,
    position: 'relative',
    zIndex: 1,
  },
  popularPackCard: {
    borderWidth: 3,
    borderColor: CartoonColors.gold.main,
  },
  popularBadge: {
    position: "absolute",
    top: -8,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CartoonColors.gold.main,
    paddingHorizontal: CartoonSpacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: CartoonColors.white,
    gap: 4,
    zIndex: 2,
  },
  popularText: {
    fontFamily: "FredokaOne",
    fontSize: 10,
    color: CartoonColors.white,
  },
  packIcon: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  packAmount: {
    position: "absolute",
    bottom: -5,
    fontFamily: "FredokaOne",
    fontSize: 16,
    color: CartoonColors.white,
    backgroundColor: CartoonColors.blue.main,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: CartoonColors.white,
  },
  packInfo: {
    flex: 1,
    marginLeft: CartoonSpacing.sm,
    gap: CartoonSpacing.xs,
  },
  packDiamonds: {
    fontFamily: "FredokaOne",
    fontSize: 18,
    color: CartoonColors.white,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
