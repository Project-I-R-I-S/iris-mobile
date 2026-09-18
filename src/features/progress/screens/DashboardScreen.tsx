import { useMemo } from 'react';
import { Button, Card, H2, H3, H4, Paragraph, Spinner, Text, XStack, YStack } from 'tamagui';

import { useAuth } from '@/auth/AuthContext';
import { useDailyHydration } from '@/features/hydration/hooks';
import { useDailyFoodEntries } from '@/features/nutrition/hooks';
import { useLatestWeight } from '@/features/weight/hooks';
import { todayIso } from '@/utils/date';
import { isNotFoundError } from '@/utils/errors';

export function DashboardScreen() {
  const { user } = useAuth();
  const timezone = user?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = todayIso(timezone);

  const {
    data: entries,
    isLoading: isNutritionLoading,
    isError: isNutritionError,
    refetch: refetchNutrition,
  } = useDailyFoodEntries(date, timezone);

  const {
    data: daily,
    isLoading: isHydrationLoading,
    isError: isHydrationError,
    refetch: refetchHydration,
  } = useDailyHydration(date, timezone);

  const {
    data: latest,
    isLoading: isWeightLoading,
    isError: isWeightError,
    error: weightError,
    refetch: refetchWeight,
  } = useLatestWeight();

  const totals = useMemo(() => {
    if (!entries) return null;
    return entries.reduce(
      (acc, e) => ({
        calories: acc.calories + Number(e.calories),
        protein: acc.protein + Number(e.proteinG),
        carbs: acc.carbs + Number(e.carbsG),
        fat: acc.fat + Number(e.fatG),
        caffeine: acc.caffeine + Number(e.caffeineMg),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, caffeine: 0 },
    );
  }, [entries]);

  const weightIsRealError = isWeightError && !isNotFoundError(weightError);
  const weightIsEmpty = isWeightError && isNotFoundError(weightError);

  return (
    <YStack flex={1} padding="$6" gap="$4" backgroundColor="$background">
      <YStack gap="$1">
        <Paragraph color="$color10">
          Welcome back{user?.displayName ? `, ${user.displayName}` : ''}
        </Paragraph>
        <H2>Today</H2>
      </YStack>

      <Card padding="$4" borderRadius="$4" borderWidth={1} borderColor="$borderColor" gap="$3">
        <H4>Nutrition</H4>
        {isNutritionLoading ? (
          <Spinner color="$color10" />
        ) : isNutritionError ? (
          <YStack gap="$2" alignItems="flex-start">
            <Paragraph color="$color10">Couldn't load today's food log.</Paragraph>
            <Button size="$3" onPress={() => refetchNutrition()}>
              Retry
            </Button>
          </YStack>
        ) : (
          <XStack gap="$4" flexWrap="wrap">
            <Stat label="Calories" value={Math.round(totals?.calories ?? 0).toString()} />
            <Stat label="Protein" value={`${Math.round(totals?.protein ?? 0)}g`} />
            <Stat label="Carbs" value={`${Math.round(totals?.carbs ?? 0)}g`} />
            <Stat label="Fat" value={`${Math.round(totals?.fat ?? 0)}g`} />
            <Stat label="Caffeine" value={`${Math.round(totals?.caffeine ?? 0)}mg`} />
          </XStack>
        )}
      </Card>

      <Card padding="$4" borderRadius="$4" borderWidth={1} borderColor="$borderColor" gap="$3">
        <H4>Water</H4>
        {isHydrationLoading ? (
          <Spinner color="$color10" />
        ) : isHydrationError ? (
          <YStack gap="$2" alignItems="flex-start">
            <Paragraph color="$color10">Couldn't load today's water log.</Paragraph>
            <Button size="$3" onPress={() => refetchHydration()}>
              Retry
            </Button>
          </YStack>
        ) : (
          <XStack gap="$4" flexWrap="wrap" alignItems="flex-end">
            <Stat label="Total" value={`${Math.round(daily?.totalMl ?? 0)} ml`} />
            {daily?.goalMl != null && (
              <Stat
                label="Remaining"
                value={`${Math.round(daily.remainingMl ?? 0)} ml of ${daily.goalMl} ml`}
              />
            )}
          </XStack>
        )}
      </Card>

      <Card padding="$4" borderRadius="$4" borderWidth={1} borderColor="$borderColor" gap="$3">
        <H4>Weight</H4>
        {isWeightLoading ? (
          <Spinner color="$color10" />
        ) : weightIsRealError ? (
          <YStack gap="$2" alignItems="flex-start">
            <Paragraph color="$color10">Couldn't load your latest weight.</Paragraph>
            <Button size="$3" onPress={() => refetchWeight()}>
              Retry
            </Button>
          </YStack>
        ) : weightIsEmpty || !latest ? (
          <Paragraph color="$color10">No weight logged yet.</Paragraph>
        ) : (
          <XStack gap="$5" alignItems="flex-end">
            <Stat label="Weight" value={`${Number(latest.weightKg)} kg`} />
            {latest.bmi != null && <Stat label="BMI" value={`${Number(latest.bmi)}`} />}
          </XStack>
        )}
      </Card>
    </YStack>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <YStack minWidth={70}>
      <Text color="$color10" fontSize="$2">
        {label}
      </Text>
      <H3>{value}</H3>
    </YStack>
  );
}
