import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Apple, Droplet, Home, Scale, Settings as SettingsIcon } from '@tamagui/lucide-icons';

import { HydrationScreen } from '@/features/hydration/screens/HydrationScreen';
import { NutritionListScreen } from '@/features/nutrition/screens/NutritionListScreen';
import { DashboardScreen } from '@/features/progress/screens/DashboardScreen';
import { SettingsScreen } from '@/features/settings/screens/SettingsScreen';
import { WeightScreen } from '@/features/weight/screens/WeightScreen';

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
        name="Hydration"
        component={HydrationScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Droplet color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Weight"
        component={WeightScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Scale color={color} size={size} />,
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
