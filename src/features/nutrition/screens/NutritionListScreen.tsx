import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, Trash2 } from '@tamagui/lucide-icons';
import { useMemo } from 'react';
import { Alert, FlatList } from 'react-native';
import { Button, Card, H3, H4, Paragraph, Separator, Spinner, Text, XStack, YStack } from 'tamagui';

import { useAuth } from '@/auth/AuthContext';
import { RootStackParamList } from '@/navigation/types';
import { todayIso } from '@/utils/date';

import { useDailyFoodEntries, useDeleteFoodEntry } from '../hooks';
import { FoodEntry } from '../types';

export function NutritionListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const timezone = user?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = todayIso(timezone);

  const { data: entries, isLoading, isError, refetch, isRefetching } = useDailyFoodEntries(
    date,
    timezone,
  );
  const deleteEntry = useDeleteFoodEntry();

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

  function confirmDelete(id: string) {
    Alert.alert('Delete entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          deleteEntry.mutate(id, {
            onError: () => Alert.alert('Delete failed', "Couldn't delete this entry. Try again."),
          }),
      },
    ]);
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {totals && (
        <YStack padding="$4" gap="$2" borderBottomWidth={1} borderColor="$borderColor">
          <H4>Today</H4>
          <XStack gap="$4" flexWrap="wrap">
            <Stat label="Calories" value={Math.round(totals.calories).toString()} />
            <Stat label="Protein" value={`${Math.round(totals.protein)}g`} />
            <Stat label="Carbs" value={`${Math.round(totals.carbs)}g`} />
            <Stat label="Fat" value={`${Math.round(totals.fat)}g`} />
            <Stat label="Caffeine" value={`${Math.round(totals.caffeine)}mg`} />
          </XStack>
        </YStack>
      )}

      {isLoading ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$color10" />
        </YStack>
      ) : isError ? (
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$6" gap="$3">
          <Paragraph>Couldn't load your entries.</Paragraph>
          <Button onPress={() => refetch()}>Retry</Button>
        </YStack>
      ) : (
        <FlatList
          data={entries ?? []}
          keyExtractor={(e) => e.id}
          renderItem={({ item }) => (
            <EntryRow entry={item} onDelete={() => confirmDelete(item.id)} />
          )}
          ItemSeparatorComponent={() => <Separator />}
          ListEmptyComponent={
            <YStack padding="$6" alignItems="center">
              <Paragraph color="$color10">Nothing logged yet today.</Paragraph>
            </YStack>
          }
          contentContainerStyle={{ paddingBottom: 96 }}
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      )}

      <Button
        size="$5"
        theme="accent"
        icon={Plus}
        position="absolute"
        bottom="$6"
        right="$6"
        borderRadius={999}
        onPress={() => navigation.navigate('AddFood')}
      >
        Log food
      </Button>
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

function EntryRow({ entry, onDelete }: { entry: FoodEntry; onDelete: () => void }) {
  return (
    <Card padding="$4" backgroundColor="$background" borderRadius={0}>
      <XStack justifyContent="space-between" alignItems="center">
        <YStack gap="$1" flex={1}>
          <Text fontSize="$5" fontWeight="600">
            {entry.name}
          </Text>
          <Text color="$color10" fontSize="$2">
            {entry.mealType} · {Number(entry.servingSize)} {entry.servingUnit}
          </Text>
        </YStack>
        <YStack alignItems="flex-end">
          <Text fontSize="$5" fontWeight="600">
            {Math.round(Number(entry.calories))} kcal
          </Text>
          <Text color="$color10" fontSize="$2">
            P {Math.round(Number(entry.proteinG))} · C {Math.round(Number(entry.carbsG))} · F{' '}
            {Math.round(Number(entry.fatG))}
          </Text>
        </YStack>
        <Button size="$3" circular chromeless icon={Trash2} onPress={onDelete} marginLeft="$2" />
      </XStack>
    </Card>
  );
}
