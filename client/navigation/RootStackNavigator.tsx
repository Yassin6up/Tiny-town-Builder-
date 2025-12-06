import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import DistrictSelectorModal from "@/screens/DistrictSelectorModal";
import BuildingDetailModal from "@/screens/BuildingDetailModal";
import SettingsScreen from "@/screens/SettingsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Main: undefined;
  DistrictSelector: undefined;
  BuildingDetail: { buildingId: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DistrictSelector"
        component={DistrictSelectorModal}
        options={{
          presentation: "modal",
          headerTitle: "Choose District",
        }}
      />
      <Stack.Screen
        name="BuildingDetail"
        component={BuildingDetailModal}
        options={{
          presentation: "modal",
          headerTitle: "Building Details",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: "card",
          headerTitle: "Settings",
        }}
      />
    </Stack.Navigator>
  );
}
