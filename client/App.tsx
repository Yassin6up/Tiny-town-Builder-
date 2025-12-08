import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { GameProvider } from "@/lib/GameContext";
import { MusicProvider } from "@/lib/MusicContext";

import RootStackNavigator from "@/navigation/RootStackNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Colors } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          FredokaOne: require("../assets/fonts/FredokaOne-Regular.ttf"),
          Nunito: require("../assets/fonts/Nunito-Regular.ttf"),
          "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
          "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={[styles.loading, { backgroundColor: Colors.light.cornsilk }]}>
        <ActivityIndicator size="large" color={Colors.light.sage} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GameProvider>
          <MusicProvider>
            <SafeAreaProvider>
              <GestureHandlerRootView style={styles.root} onLayout={onLayoutRootView}>
                <KeyboardProvider>
                  <NavigationContainer>
                    <RootStackNavigator />
                  </NavigationContainer>
                  <StatusBar style="dark" />
                </KeyboardProvider>
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </MusicProvider>
        </GameProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
