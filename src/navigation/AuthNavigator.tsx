import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '@/auth/screens/LoginScreen';
import { SignupScreen } from '@/auth/screens/SignupScreen';
import { WelcomeScreen } from '@/auth/screens/WelcomeScreen';

import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}
