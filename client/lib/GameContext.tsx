import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import {
  GameState,
  getDefaultGameState,
  loadGameState,
  saveGameState,
  calculateIncomePerSecond,
  getBuildingCost,
  getUpgradeCost,
  DistrictId,
  Building,
} from "./gameData";

interface GameContextType {
  state: GameState;
  isLoading: boolean;
  tapChest: () => void;
  getTapAmount: () => number;
  collectBuildingCoins: (buildingId: string) => number;
  buyBuilding: (buildingId: string) => boolean;
  upgradeBuilding: (buildingId: string) => boolean;
  unlockDistrict: (districtId: DistrictId) => boolean;
  setCurrentDistrict: (districtId: DistrictId) => void;
  activateAdBoost: () => void;
  purchaseGoldenBoost: () => void;
  purchaseAdFree: () => void;
  getBuildingById: (buildingId: string) => Building | undefined;
  offlineEarnings: number;
  dismissOfflineEarnings: () => void;
  purchaseDiamonds: (amount: number) => void;
  watchAdForDiamond: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(getDefaultGameState());
  const [isLoading, setIsLoading] = useState(true);
  const [offlineEarnings, setOfflineEarnings] = useState(0);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const incomeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const init = async () => {
      const loadedState = await loadGameState();
      const previousCoins = loadedState.coins - (loadedState.incomePerSecond * Math.min(Math.floor((Date.now() - loadedState.lastPlayed) / 1000), 86400));
      const earnings = loadedState.coins - Math.max(0, previousCoins);
      if (earnings > 100) {
        setOfflineEarnings(earnings);
      }
      setState(loadedState);
      setIsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      incomeIntervalRef.current = setInterval(() => {
        setState(prev => {
          const income = calculateIncomePerSecond(prev);
          if (income > 0) {
            // Update accumulated coins for each building
            const updatedBuildings = prev.buildings.map(building => {
              if (building.owned > 0) {
                const district = prev.districts.find(d => d.id === building.districtId);
                const incomePerSec = building.baseIncome * (district?.incomeMultiplier ?? 1) * (1 + (building.level - 1) * 0.5) * building.owned;
                return {
                  ...building,
                  accumulatedCoins: building.accumulatedCoins + incomePerSec,
                };
              }
              return building;
            });
            
            return {
              ...prev,
              coins: prev.coins + income,
              totalEarned: prev.totalEarned + income,
              incomePerSecond: income,
              buildings: updatedBuildings,
            };
          }
          return prev;
        });
      }, 1000);

      return () => {
        if (incomeIntervalRef.current) {
          clearInterval(incomeIntervalRef.current);
        }
      };
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        saveGameState(state);
      }, 1000);
    }
  }, [state, isLoading]);

  const tapChest = useCallback(() => {
    setState(prev => {
      // Calculate tap amount based on unlocked districts
      const unlockedDistrictCount = prev.districts.filter(d => d.unlocked).length;
      let tapAmount = 1; // Default for forest only
      
      if (unlockedDistrictCount >= 5) {
        tapAmount = 1000; // All districts (city unlocked)
      } else if (unlockedDistrictCount >= 4) {
        tapAmount = 800; // Desert unlocked
      } else if (unlockedDistrictCount >= 3) {
        tapAmount = 500; // Mountain unlocked
      } else if (unlockedDistrictCount >= 2) {
        tapAmount = 100; // Coastal unlocked
      }
      
      return {
        ...prev,
        coins: prev.coins + tapAmount,
        totalEarned: prev.totalEarned + tapAmount,
        tapCount: prev.tapCount + 1,
      };
    });
  }, []);

  const buyBuilding = useCallback((buildingId: string): boolean => {
    let success = false;
    setState(prev => {
      const building = prev.buildings.find(b => b.id === buildingId);
      if (!building) return prev;

      const cost = getBuildingCost(building);
      const diamondCost = building.diamondCost ?? 0;
      
      if (prev.coins < cost) return prev;
      if (prev.diamonds < diamondCost) return prev;

      const district = prev.districts.find(d => d.id === building.districtId);
      if (!district?.unlocked) return prev;

      success = true;
      const updatedBuildings = prev.buildings.map(b =>
        b.id === buildingId ? { ...b, owned: b.owned + 1 } : b
      );
      const newState = {
        ...prev,
        coins: prev.coins - cost,
        diamonds: prev.diamonds - diamondCost,
        buildings: updatedBuildings,
      };
      return {
        ...newState,
        incomePerSecond: calculateIncomePerSecond(newState),
      };
    });
    return success;
  }, []);

  const upgradeBuilding = useCallback((buildingId: string): boolean => {
    let success = false;
    setState(prev => {
      const building = prev.buildings.find(b => b.id === buildingId);
      if (!building || building.owned === 0) return prev;

      const cost = getUpgradeCost(building);
      const diamondCost = building.level === 4 ? 3 : 0; // Level 4→5 requires 3 diamonds
      
      if (prev.coins < cost) return prev;
      if (prev.diamonds < diamondCost) return prev;

      success = true;
      const updatedBuildings = prev.buildings.map(b =>
        b.id === buildingId ? { ...b, level: b.level + 1 } : b
      );
      const newState = {
        ...prev,
        coins: prev.coins - cost,
        diamonds: prev.diamonds - diamondCost,
        buildings: updatedBuildings,
      };
      return {
        ...newState,
        incomePerSecond: calculateIncomePerSecond(newState),
      };
    });
    return success;
  }, []);

  const unlockDistrict = useCallback((districtId: DistrictId): boolean => {
    let success = false;
    setState(prev => {
      const district = prev.districts.find(d => d.id === districtId);
      if (!district || district.unlocked) return prev;
      if (prev.coins < district.unlockCost) return prev;

      success = true;
      return {
        ...prev,
        coins: prev.coins - district.unlockCost,
        districts: prev.districts.map(d =>
          d.id === districtId ? { ...d, unlocked: true } : d
        ),
      };
    });
    return success;
  }, []);

  const setCurrentDistrict = useCallback((districtId: DistrictId) => {
    setState(prev => ({
      ...prev,
      currentDistrict: districtId,
    }));
  }, []);

  const activateAdBoost = useCallback(() => {
    setState(prev => ({
      ...prev,
      adBoostActive: true,
      adBoostEndTime: Date.now() + 60 * 60 * 1000,
    }));
  }, []);

  const purchaseGoldenBoost = useCallback(() => {
    setState(prev => ({
      ...prev,
      goldenBoostPurchased: true,
      incomePerSecond: calculateIncomePerSecond({ ...prev, goldenBoostPurchased: true }),
    }));
  }, []);

  const purchaseAdFree = useCallback(() => {
    setState(prev => ({
      ...prev,
      adFreePurchased: true,
    }));
  }, []);

  const getBuildingById = useCallback((buildingId: string): Building | undefined => {
    return state.buildings.find(b => b.id === buildingId);
  }, [state.buildings]);

  const getTapAmount = useCallback((): number => {
    const unlockedDistrictCount = state.districts.filter(d => d.unlocked).length;
    
    if (unlockedDistrictCount >= 5) return 1000;
    if (unlockedDistrictCount >= 4) return 800;
    if (unlockedDistrictCount >= 3) return 500;
    if (unlockedDistrictCount >= 2) return 100;
    return 1;
  }, [state.districts]);

  const collectBuildingCoins = useCallback((buildingId: string): number => {
    let collectedAmount = 0;
    setState(prev => {
      const building = prev.buildings.find(b => b.id === buildingId);
      if (!building || building.owned === 0) return prev;

      collectedAmount = Math.floor(building.accumulatedCoins);
      
      if (collectedAmount === 0) return prev;

      const updatedBuildings = prev.buildings.map(b =>
        b.id === buildingId
          ? { ...b, accumulatedCoins: 0, lastCollected: Date.now() }
          : b
      );

      return {
        ...prev,
        coins: prev.coins + collectedAmount,
        totalEarned: prev.totalEarned + collectedAmount,
        buildings: updatedBuildings,
      };
    });
    return collectedAmount;
  }, []);

  const dismissOfflineEarnings = useCallback(() => {
    setOfflineEarnings(0);
  }, []);

  const purchaseDiamonds = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      diamonds: prev.diamonds + amount,
    }));
  }, []);

  const watchAdForDiamond = useCallback(() => {
    setState(prev => ({
      ...prev,
      diamonds: prev.diamonds + 1,
    }));
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        isLoading,
        tapChest,
        getTapAmount,
        collectBuildingCoins,
        buyBuilding,
        upgradeBuilding,
        unlockDistrict,
        setCurrentDistrict,
        activateAdBoost,
        purchaseGoldenBoost,
        purchaseAdFree,
        getBuildingById,
        offlineEarnings,
        dismissOfflineEarnings,
        purchaseDiamonds,
        watchAdForDiamond,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
