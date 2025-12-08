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

export type BuildingTier = "common" | "rare" | "legendary";

export type BuildingIconType = 
  | "cottage" | "bakery" | "lighthouse" | "windmill" | "market" | "workshop" 
  | "tavern" | "observatory" | "pyramid" | "oasis" | "cactus" | "skyscraper" 
  | "fountain" | "cafe" | "hotel"
  | "apiary" | "treehouse" | "shipyard" | "marina" | "skiLodge" | "icePalace"
  | "bazaar" | "sultanPalace" | "rooftopGarden" | "penthouse";

export interface Building {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseIncome: number;
  districtId: DistrictId;
  owned: number;
  level: number;
  iconType: BuildingIconType;
  tier: BuildingTier;
  diamondCost?: number; // Optional diamond cost for premium buildings
  accumulatedCoins: number; // Coins accumulated from this building
  lastCollected: number; // Timestamp of last collection
}

export interface GameState {
  coins: number;
  diamonds: number;
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
  { id: "cottage", name: "Cozy Cottage", description: "A warm little home", baseCost: 15, baseIncome: 1, districtId: "forest", owned: 0, level: 1, iconType: "cottage", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "bakery", name: "Village Bakery", description: "Fresh bread daily", baseCost: 100, baseIncome: 5, districtId: "forest", owned: 0, level: 1, iconType: "bakery", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "windmill", name: "Old Windmill", description: "Turns grain to flour", baseCost: 500, baseIncome: 20, districtId: "forest", owned: 0, level: 1, iconType: "windmill", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "apiary", name: "Golden Apiary", description: "Busy bees, sweet honey", baseCost: 1000, baseIncome: 50, districtId: "forest", owned: 0, level: 1, iconType: "apiary", tier: "rare", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "treehouse", name: "Enchanted Treehouse", description: "Magic lives here", baseCost: 2500, baseIncome: 140, districtId: "forest", owned: 0, level: 1, iconType: "treehouse", tier: "legendary", diamondCost: 5, accumulatedCoins: 0, lastCollected: Date.now() },
  
  { id: "lighthouse", name: "Lighthouse", description: "Guides ships home", baseCost: 1500, baseIncome: 50, districtId: "coastal", owned: 0, level: 1, iconType: "lighthouse", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "market", name: "Fish Market", description: "Fresh catch today", baseCost: 3000, baseIncome: 100, districtId: "coastal", owned: 0, level: 1, iconType: "market", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "workshop", name: "Boat Workshop", description: "Craft fine vessels", baseCost: 8000, baseIncome: 250, districtId: "coastal", owned: 0, level: 1, iconType: "workshop", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "shipyard", name: "Royal Shipyard", description: "Build grand vessels", baseCost: 16000, baseIncome: 625, districtId: "coastal", owned: 0, level: 1, iconType: "shipyard", tier: "rare", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "marina", name: "Crystal Marina", description: "Luxury yachts dock", baseCost: 40000, baseIncome: 1750, districtId: "coastal", owned: 0, level: 1, iconType: "marina", tier: "legendary", diamondCost: 10, accumulatedCoins: 0, lastCollected: Date.now() },
  
  { id: "tavern", name: "Mountain Tavern", description: "Warm drinks await", baseCost: 20000, baseIncome: 500, districtId: "mountain", owned: 0, level: 1, iconType: "tavern", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "observatory", name: "Star Observatory", description: "Watch the cosmos", baseCost: 50000, baseIncome: 1200, districtId: "mountain", owned: 0, level: 1, iconType: "observatory", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "cafe", name: "Alpine Cafe", description: "Best views around", baseCost: 100000, baseIncome: 2500, districtId: "mountain", owned: 0, level: 1, iconType: "cafe", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "skiLodge", name: "Cozy Ski Lodge", description: "Fireside relaxation", baseCost: 200000, baseIncome: 6250, districtId: "mountain", owned: 0, level: 1, iconType: "skiLodge", tier: "rare", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "icePalace", name: "Ice Crystal Palace", description: "Frozen majesty", baseCost: 500000, baseIncome: 17500, districtId: "mountain", owned: 0, level: 1, iconType: "icePalace", tier: "legendary", diamondCost: 15, accumulatedCoins: 0, lastCollected: Date.now() },
  
  { id: "pyramid", name: "Ancient Pyramid", description: "Mysterious treasures", baseCost: 250000, baseIncome: 5000, districtId: "desert", owned: 0, level: 1, iconType: "pyramid", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "oasis", name: "Oasis Well", description: "Life in the desert", baseCost: 400000, baseIncome: 8000, districtId: "desert", owned: 0, level: 1, iconType: "oasis", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "cactus", name: "Cactus Farm", description: "Prickly profits", baseCost: 600000, baseIncome: 12000, districtId: "desert", owned: 0, level: 1, iconType: "cactus", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "bazaar", name: "Exotic Bazaar", description: "Rare treasures await", baseCost: 1200000, baseIncome: 30000, districtId: "desert", owned: 0, level: 1, iconType: "bazaar", tier: "rare", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "sultanPalace", name: "Sultan Palace", description: "Royal grandeur", baseCost: 3000000, baseIncome: 84000, districtId: "desert", owned: 0, level: 1, iconType: "sultanPalace", tier: "legendary", diamondCost: 20, accumulatedCoins: 0, lastCollected: Date.now() },
  
  { id: "skyscraper", name: "Glass Tower", description: "Touch the clouds", baseCost: 1000000, baseIncome: 20000, districtId: "skyline", owned: 0, level: 1, iconType: "skyscraper", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "fountain", name: "Grand Fountain", description: "City centerpiece", baseCost: 2000000, baseIncome: 40000, districtId: "skyline", owned: 0, level: 1, iconType: "fountain", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "hotel", name: "Luxury Hotel", description: "Five-star dreams", baseCost: 5000000, baseIncome: 100000, districtId: "skyline", owned: 0, level: 1, iconType: "hotel", tier: "common", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "rooftopGarden", name: "Sky Garden", description: "Urban paradise", baseCost: 10000000, baseIncome: 250000, districtId: "skyline", owned: 0, level: 1, iconType: "rooftopGarden", tier: "rare", accumulatedCoins: 0, lastCollected: Date.now() },
  { id: "penthouse", name: "Diamond Penthouse", description: "Ultimate luxury", baseCost: 25000000, baseIncome: 700000, districtId: "skyline", owned: 0, level: 1, iconType: "penthouse", tier: "legendary", diamondCost: 25, accumulatedCoins: 0, lastCollected: Date.now() },
];

const STORAGE_KEY = "tiny_town_game_state";

export const getDefaultGameState = (): GameState => ({
  coins: 0,
  diamonds: 0,
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
      const migratedState = migrateGameState(state);
      return calculateOfflineEarnings(migratedState);
    }
  } catch (error) {
    console.error("Failed to load game state:", error);
  }
  return getDefaultGameState();
};

const migrateGameState = (state: GameState): GameState => {
  const existingBuildingIds = new Set(state.buildings.map(b => b.id));
  const migratedBuildings: Building[] = [];
  
  for (const building of state.buildings) {
    const defaultBuilding = BUILDINGS.find(b => b.id === building.id);
    if (defaultBuilding) {
      migratedBuildings.push({
        ...building,
        tier: building.tier ?? defaultBuilding.tier,
        iconType: defaultBuilding.iconType,
        accumulatedCoins: building.accumulatedCoins ?? 0,
        lastCollected: building.lastCollected ?? Date.now(),
      });
    }
  }
  
  for (const defaultBuilding of BUILDINGS) {
    if (!existingBuildingIds.has(defaultBuilding.id)) {
      migratedBuildings.push({ ...defaultBuilding });
    }
  }
  
  migratedBuildings.sort((a, b) => {
    const aIndex = BUILDINGS.findIndex(bb => bb.id === a.id);
    const bIndex = BUILDINGS.findIndex(bb => bb.id === b.id);
    return aIndex - bIndex;
  });
  
  return {
    ...state,
    diamonds: state.diamonds ?? 0, // Add diamonds field if missing
    buildings: migratedBuildings,
  };
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

