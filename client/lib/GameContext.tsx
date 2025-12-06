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
            return {
              ...prev,
              coins: prev.coins + income,
              totalEarned: prev.totalEarned + income,
              incomePerSecond: income,
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
    setState(prev => ({
      ...prev,
      coins: prev.coins + 1,
      totalEarned: prev.totalEarned + 1,
      tapCount: prev.tapCount + 1,
    }));
  }, []);

  const buyBuilding = useCallback((buildingId: string): boolean => {
    let success = false;
    setState(prev => {
      const building = prev.buildings.find(b => b.id === buildingId);
      if (!building) return prev;

      const cost = getBuildingCost(building);
      if (prev.coins < cost) return prev;

      const district = prev.districts.find(d => d.id === building.districtId);
      if (!district?.unlocked) return prev;

      success = true;
      const updatedBuildings = prev.buildings.map(b =>
        b.id === buildingId ? { ...b, owned: b.owned + 1 } : b
      );
      const newState = {
        ...prev,
        coins: prev.coins - cost,
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
      if (prev.coins < cost) return prev;

      success = true;
      const updatedBuildings = prev.buildings.map(b =>
        b.id === buildingId ? { ...b, level: b.level + 1 } : b
      );
      const newState = {
        ...prev,
        coins: prev.coins - cost,
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

  const dismissOfflineEarnings = useCallback(() => {
    setOfflineEarnings(0);
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        isLoading,
        tapChest,
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
