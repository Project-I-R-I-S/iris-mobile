import { Button, H2, ListItem, Paragraph, Separator, YGroup, YStack } from 'tamagui';

import { useAuth } from '@/auth/AuthContext';

export function SettingsScreen() {
  const { user, logout } = useAuth();

  return (
    <YStack flex={1} padding="$6" gap="$4" backgroundColor="$background">
      <H2>Settings</H2>

      <YGroup separator={<Separator />} borderWidth={1} borderColor="$borderColor" borderRadius="$4">
        <YGroup.Item>
          <ListItem title="Email" subTitle={user?.email ?? '—'} />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem title="Name" subTitle={user?.displayName ?? '—'} />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem title="Timezone" subTitle={user?.timezone ?? '—'} />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            title="Daily water goal"
            subTitle={user?.dailyWaterGoalMl ? `${user.dailyWaterGoalMl} ml` : '—'}
          />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            title="Daily caffeine limit"
            subTitle={user?.dailyCaffeineLimitMg ? `${user.dailyCaffeineLimitMg} mg` : '—'}
          />
        </YGroup.Item>
      </YGroup>

      <Paragraph color="$color10" fontSize="$2">
        Profile editing lands with the /api/v1/users/me PATCH endpoint — TODO.
      </Paragraph>

      <Button theme="red" onPress={logout} marginTop="auto">
        Sign out
      </Button>
    </YStack>
  );
}
