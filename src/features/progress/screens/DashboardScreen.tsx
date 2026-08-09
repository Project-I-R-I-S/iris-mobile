import { H2, H4, Paragraph, YStack } from 'tamagui';

import { useAuth } from '@/auth/AuthContext';

export function DashboardScreen() {
  const { user } = useAuth();

  return (
    <YStack flex={1} padding="$6" gap="$4" backgroundColor="$background">
      <YStack gap="$1">
        <Paragraph color="$color10">Welcome back{user?.displayName ? `, ${user.displayName}` : ''}</Paragraph>
        <H2>Today</H2>
      </YStack>

      <YStack
        padding="$4"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$borderColor"
        gap="$2"
      >
        <H4>Dashboard is coming</H4>
        <Paragraph color="$color10">
          Once the progress endpoints are built on the backend, this screen will show your daily
          totals for calories, water, sleep, and weight trend, plus streaks and goals.
        </Paragraph>
      </YStack>
    </YStack>
  );
}
