import AsyncStorage from "@react-native-async-storage/async-storage";

export type DistrictId = "forest" | "coastal" | "mountain" | "desert" | "skyline";

export interface District {
  id: DistrictId;
  name: string;
  description: string;
  unlockCost: number;
  incomeMultiplier: number;
  unlocked: boolean;
}

export interface Building {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseIncome: number;
  districtId: DistrictId;
  owned: number;
  level: number;
  iconType: "cottage" | "bakery" | "lighthouse" | "windmill" | "market" | "workshop" | "tavern" | "observatory" | "pyramid" | "oasis" | "cactus" | "skyscraper" | "fountain" | "cafe" | "hotel";
}

export interface GameState {
  coins: number;
  totalEarned: number;
  incomePerSecond: number;
  currentDistrict: DistrictId;
  districts: District[];
  buildings: Building[];
  lastPlayed: number;
  adBoostActive: boolean;
  adBoostEndTime: number;
  goldenBoostPurchased: boolean;
  adFreePurchased: boolean;
  tapCount: number;
}

export const DISTRICTS: District[] = [
  { id: "forest", name: "Forest Valley", description: "A peaceful woodland village", unlockCost: 0, incomeMultiplier: 1.0, unlocked: true },
  { id: "coastal", name: "Coastal Harbor", description: "A bustling seaside port", unlockCost: 5000, incomeMultiplier: 1.2, unlocked: false },
  { id: "mountain", name: "Mountain Peak", description: "A snowy alpine retreat", unlockCost: 25000, incomeMultiplier: 1.5, unlocked: false },
  { id: "desert", name: "Desert Oasis", description: "An exotic desert bazaar", unlockCost: 100000, incomeMultiplier: 1.8, unlocked: false },
  { id: "skyline", name: "Skyline City", description: "A modern metropolis", unlockCost: 500000, incomeMultiplier: 2.0, unlocked: false },
];

export const BUILDINGS: Building[] = [
  { id: "cottage", name: "Cozy Cottage", description: "A warm little home", baseCost: 15, baseIncome: 1, districtId: "forest", owned: 0, level: 1, iconType: "cottage" },
  { id: "bakery", name: "Village Bakery", description: "Fresh bread daily", baseCost: 100, baseIncome: 5, districtId: "forest", owned: 0, level: 1, iconType: "bakery" },
  { id: "windmill", name: "Old Windmill", description: "Turns grain to flour", baseCost: 500, baseIncome: 20, districtId: "forest", owned: 0, level: 1, iconType: "windmill" },
  
  { id: "lighthouse", name: "Lighthouse", description: "Guides ships home", baseCost: 1500, baseIncome: 50, districtId: "coastal", owned: 0, level: 1, iconType: "lighthouse" },
  { id: "market", name: "Fish Market", description: "Fresh catch today", baseCost: 3000, baseIncome: 100, districtId: "coastal", owned: 0, level: 1, iconType: "market" },
  { id: "workshop", name: "Boat Workshop", description: "Craft fine vessels", baseCost: 8000, baseIncome: 250, districtId: "coastal", owned: 0, level: 1, iconType: "workshop" },
  
  { id: "tavern", name: "Mountain Tavern", description: "Warm drinks await", baseCost: 20000, baseIncome: 500, districtId: "mountain", owned: 0, level: 1, iconType: "tavern" },
  { id: "observatory", name: "Star Observatory", description: "Watch the cosmos", baseCost: 50000, baseIncome: 1200, districtId: "mountain", owned: 0, level: 1, iconType: "observatory" },
  { id: "cafe", name: "Alpine Cafe", description: "Best views around", baseCost: 100000, baseIncome: 2500, districtId: "mountain", owned: 0, level: 1, iconType: "cafe" },
  
  { id: "pyramid", name: "Ancient Pyramid", description: "Mysterious treasures", baseCost: 250000, baseIncome: 5000, districtId: "desert", owned: 0, level: 1, iconType: "pyramid" },
  { id: "oasis", name: "Oasis Well", description: "Life in the desert", baseCost: 400000, baseIncome: 8000, districtId: "desert", owned: 0, level: 1, iconType: "oasis" },
  { id: "cactus", name: "Cactus Farm", description: "Prickly profits", baseCost: 600000, baseIncome: 12000, districtId: "desert", owned: 0, level: 1, iconType: "cactus" },
  
  { id: "skyscraper", name: "Glass Tower", description: "Touch the clouds", baseCost: 1000000, baseIncome: 20000, districtId: "skyline", owned: 0, level: 1, iconType: "skyscraper" },
  { id: "fountain", name: "Grand Fountain", description: "City centerpiece", baseCost: 2000000, baseIncome: 40000, districtId: "skyline", owned: 0, level: 1, iconType: "fountain" },
  { id: "hotel", name: "Luxury Hotel", description: "Five-star dreams", baseCost: 5000000, baseIncome: 100000, districtId: "skyline", owned: 0, level: 1, iconType: "hotel" },
];

const STORAGE_KEY = "tiny_town_game_state";

export const getDefaultGameState = (): GameState => ({
  coins: 0,
  totalEarned: 0,
  incomePerSecond: 0,
  currentDistrict: "forest",
  districts: DISTRICTS.map(d => ({ ...d })),
  buildings: BUILDINGS.map(b => ({ ...b })),
  lastPlayed: Date.now(),
  adBoostActive: false,
  adBoostEndTime: 0,
  goldenBoostPurchased: false,
  adFreePurchased: false,
  tapCount: 0,
});

export const saveGameState = async (state: GameState): Promise<void> => {
  try {
    const stateToSave = { ...state, lastPlayed: Date.now() };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
};

export const loadGameState = async (): Promise<GameState> => {
  try {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const state = JSON.parse(savedState) as GameState;
      return calculateOfflineEarnings(state);
    }
  } catch (error) {
    console.error("Failed to load game state:", error);
  }
  return getDefaultGameState();
};

export const calculateOfflineEarnings = (state: GameState): GameState => {
  const now = Date.now();
  const offlineSeconds = Math.floor((now - state.lastPlayed) / 1000);
  const maxOfflineSeconds = 86400;
  const earnableSeconds = Math.min(offlineSeconds, maxOfflineSeconds);
  
  if (earnableSeconds > 0 && state.incomePerSecond > 0) {
    const offlineEarnings = state.incomePerSecond * earnableSeconds;
    return {
      ...state,
      coins: state.coins + offlineEarnings,
      totalEarned: state.totalEarned + offlineEarnings,
      lastPlayed: now,
      adBoostActive: state.adBoostEndTime > now ? state.adBoostActive : false,
    };
  }
  
  return {
    ...state,
    lastPlayed: now,
    adBoostActive: state.adBoostEndTime > now ? state.adBoostActive : false,
  };
};

export const calculateIncomePerSecond = (state: GameState): number => {
  let totalIncome = 0;
  
  for (const building of state.buildings) {
    if (building.owned > 0) {
      const district = state.districts.find(d => d.id === building.districtId);
      const districtMultiplier = district?.incomeMultiplier ?? 1;
      const levelMultiplier = 1 + (building.level - 1) * 0.5;
      const buildingIncome = building.baseIncome * building.owned * districtMultiplier * levelMultiplier;
      totalIncome += buildingIncome;
    }
  }
  
  if (state.goldenBoostPurchased) {
    totalIncome *= 1.5;
  }
  
  if (state.adBoostActive && state.adBoostEndTime > Date.now()) {
    totalIncome *= 2;
  }
  
  return Math.floor(totalIncome);
};

export const getBuildingCost = (building: Building): number => {
  const costMultiplier = Math.pow(1.15, building.owned);
  return Math.floor(building.baseCost * costMultiplier);
};

export const getUpgradeCost = (building: Building): number => {
  return Math.floor(building.baseCost * Math.pow(10, building.level));
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return Math.floor(num).toString();
};
