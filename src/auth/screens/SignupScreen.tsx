import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Button, H2, Input, Paragraph, Separator, Text, YStack } from 'tamagui';

import { useAuth } from '@/auth/AuthContext';
import { useGoogleAuth } from '@/auth/useGoogleAuth';
import { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export function SignupScreen({ navigation }: Props) {
  const { signup } = useAuth();
  const { signInWithGoogle, isReady: isGoogleReady } = useGoogleAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setSubmitting(true);
    try {
      await signup(email.trim(), password, displayName.trim() || undefined);
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Sign-up failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <YStack flex={1} padding="$6" gap="$4" justifyContent="center" backgroundColor="$background">
      <H2>Create your account</H2>

      <YStack gap="$3">
        <Input
          size="$4"
          placeholder="Your name (optional)"
          value={displayName}
          onChangeText={setDisplayName}
        />
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
          placeholder="Password (min 8 characters)"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        {error && <Paragraph color="$red10">{error}</Paragraph>}
        <Button size="$5" theme="accent" onPress={onSubmit} disabled={submitting}>
          {submitting ? 'Creating account…' : 'Sign up'}
        </Button>
      </YStack>

      {isGoogleReady && (
        <YStack gap="$3" alignItems="center">
          <Separator />
          <Text color="$color10">or</Text>
          <Button size="$5" variant="outlined" onPress={signInWithGoogle}>
            Continue with Google
          </Button>
        </YStack>
      )}

      <Button chromeless onPress={() => navigation.navigate('Login')} marginTop="$4">
        Already have an account? Sign in
      </Button>
    </YStack>
  );
}
