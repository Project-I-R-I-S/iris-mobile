import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, H1, Paragraph, YStack } from 'tamagui';

import { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <YStack flex={1} padding="$6" gap="$4" justifyContent="center" backgroundColor="$background">
      <YStack gap="$2">
        <H1>I.R.I.S</H1>
        <Paragraph size="$5" color="$color10">
          Intelligent Rest & Insight Suite
        </Paragraph>
      </YStack>

      <YStack gap="$3" marginTop="$8">
        <Button size="$5" theme="active" onPress={() => navigation.navigate('Signup')}>
          Create account
        </Button>
        <Button size="$5" variant="outlined" onPress={() => navigation.navigate('Login')}>
          I already have an account
        </Button>
      </YStack>
    </YStack>
  );
}
