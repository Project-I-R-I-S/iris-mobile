import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Button, H2, Input, Paragraph, Separator, Text, YStack } from 'tamagui';

import { useAuth } from '@/auth/AuthContext';
import { useGoogleAuth } from '@/auth/useGoogleAuth';
import { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const { signInWithGoogle, isReady: isGoogleReady } = useGoogleAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Login failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <YStack flex={1} padding="$6" gap="$4" justifyContent="center" backgroundColor="$background">
      <H2>Welcome back</H2>

      <YStack gap="$3">
        <Input
          size="$4"
          placeholder="Email"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          size="$4"
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          value={password}
          onChangeText={setPassword}
        />
        {error && <Paragraph color="$red10">{error}</Paragraph>}
        <Button size="$5" theme="active" onPress={onSubmit} disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </YStack>

      <YStack gap="$3" alignItems="center">
        <Separator />
        <Text color="$color10">or</Text>
        <Button
          size="$5"
          variant="outlined"
          onPress={signInWithGoogle}
          disabled={!isGoogleReady}
        >
          Continue with Google
        </Button>
      </YStack>

      <Button
        chromeless
        onPress={() => navigation.navigate('Signup')}
        marginTop="$4"
      >
        Don't have an account? Sign up
      </Button>
    </YStack>
  );
}
