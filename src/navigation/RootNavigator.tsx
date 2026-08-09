import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Spinner, YStack } from 'tamagui';

import { useAuth } from '@/auth/AuthContext';
import { AddFoodScreen } from '@/features/nutrition/screens/AddFoodScreen';

import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$color10" />
      </YStack>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="AddFood"
            component={AddFoodScreen}
            options={{ headerShown: true, title: 'Add food', presentation: 'modal' }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
