import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Apple, Home, Settings as SettingsIcon } from '@tamagui/lucide-icons';

import { NutritionListScreen } from '@/features/nutrition/screens/NutritionListScreen';
import { DashboardScreen } from '@/features/progress/screens/DashboardScreen';
import { SettingsScreen } from '@/features/settings/screens/SettingsScreen';

import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionListScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Apple color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
