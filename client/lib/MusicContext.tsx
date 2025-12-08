import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MusicContextType {
  isMusicEnabled: boolean;
  toggleMusic: () => void;
  initMusic: () => Promise<void>;
  setMusicVolume: (volume: number) => Promise<void>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    loadMusicPreference();
    return () => {
      // Cleanup on unmount
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadMusicPreference = async () => {
    try {
      const saved = await AsyncStorage.getItem("music_enabled");
      if (saved !== null) {
        setIsMusicEnabled(saved === "true");
      }
    } catch (error) {
      console.log("Failed to load music preference:", error);
    }
  };

  const initMusic = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/audio/gamemusic.mp3"),
        { 
          shouldPlay: isMusicEnabled, 
          isLooping: true, 
          volume: 0.5,
          progressUpdateIntervalMillis: 500,
          // Enable streaming - don't wait for full download
          shouldCorrectPitch: true,
        },
        null, // No status update callback needed
        false // Don't download fully before playing (streaming mode)
      );
      
      soundRef.current = sound;
    } catch (error) {
      console.log("Failed to load music:", error);
    }
  };

  const toggleMusic = async () => {
    const newState = !isMusicEnabled;
    setIsMusicEnabled(newState);
    
    try {
      await AsyncStorage.setItem("music_enabled", newState.toString());
      
      if (soundRef.current) {
        if (newState) {
          await soundRef.current.playAsync();
        } else {
          await soundRef.current.pauseAsync();
        }
      }
    } catch (error) {
      console.log("Failed to toggle music:", error);
    }
  };

  const setMusicVolume = async (volume: number) => {
    try {
      if (soundRef.current && isMusicEnabled) {
        await soundRef.current.setVolumeAsync(volume);
      }
    } catch (error) {
      console.log("Failed to set music volume:", error);
    }
  };

  return (
    <MusicContext.Provider value={{ isMusicEnabled, toggleMusic, initMusic, setMusicVolume }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within MusicProvider");
  }
  return context;
}
