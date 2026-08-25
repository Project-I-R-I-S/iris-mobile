import { Droplet, Trash2 } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { FlatList } from 'react-native';
import { Button, Card, H2, H4, Input, Paragraph, Separator, Spinner, Text, XStack, YStack } from 'tamagui';

import { useAuth } from '@/auth/AuthContext';
import { todayIso } from '@/utils/date';

import { useAddWater, useDailyHydration, useDailyWaterEntries, useDeleteWater } from '../hooks';
import { WaterEntry } from '../types';

const QUICK_AMOUNTS = [250, 500];

export function HydrationScreen() {
  const { user } = useAuth();
  const timezone = user?.timezone ?? 'Asia/Kolkata';
  const date = todayIso(timezone);

  const { data: daily, isLoading: isDailyLoading } = useDailyHydration(date, timezone);
  const { data: entries, isLoading, isError, refetch, isRefetching } = useDailyWaterEntries(
    date,
    timezone,
  );
  const addWater = useAddWater();
  const deleteWater = useDeleteWater();

  const [customAmount, setCustomAmount] = useState('');

  function logAmount(amountMl: number) {
    if (amountMl <= 0) return;
    addWater.mutate({ amountMl, consumedAt: new Date().toISOString() });
  }

  function onLogCustom() {
    const amount = parseFloat(customAmount);
    if (!isNaN(amount) && amount > 0) {
      logAmount(amount);
      setCustomAmount('');
    }
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack padding="$4" gap="$3" borderBottomWidth={1} borderColor="$borderColor">
        <H4>Today</H4>
        {isDailyLoading ? (
          <Spinner color="$color10" />
        ) : (
          <XStack gap="$4" flexWrap="wrap" alignItems="flex-end">
            <YStack>
              <Text color="$color10" fontSize="$2">
                Total
              </Text>
              <H2>{Math.round(daily?.totalMl ?? 0)} ml</H2>
            </YStack>
            {daily?.goalMl != null && (
              <YStack>
                <Text color="$color10" fontSize="$2">
                  Remaining
                </Text>
                <H4>{Math.round(daily.remainingMl ?? 0)} ml of {daily.goalMl} ml goal</H4>
              </YStack>
            )}
          </XStack>
        )}
        {daily && Number(daily.fluidFromFoodMl) > 0 && (
          <Text color="$color10" fontSize="$2">
            Includes {Math.round(Number(daily.fluidFromFoodMl))} ml logged via food/drinks
          </Text>
        )}

        <XStack gap="$3" alignItems="center" marginTop="$2">
          {QUICK_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              icon={Droplet}
              theme="active"
              disabled={addWater.isPending}
              onPress={() => logAmount(amount)}
            >
              +{amount}ml
            </Button>
          ))}
          <Input
            flex={1}
            value={customAmount}
            onChangeText={setCustomAmount}
            placeholder="Custom ml"
            keyboardType="decimal-pad"
          />
          <Button disabled={addWater.isPending || !customAmount} onPress={onLogCustom}>
            Add
          </Button>
        </XStack>
      </YStack>

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
            <EntryRow entry={item} onDelete={() => deleteWater.mutate(item.id)} />
          )}
          ItemSeparatorComponent={() => <Separator />}
          ListEmptyComponent={
            <YStack padding="$6" alignItems="center">
              <Paragraph color="$color10">No water logged yet today.</Paragraph>
            </YStack>
          }
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      )}
    </YStack>
  );
}

function EntryRow({ entry, onDelete }: { entry: WaterEntry; onDelete: () => void }) {
  return (
    <Card padding="$4" backgroundColor="$background" borderRadius={0}>
      <XStack justifyContent="space-between" alignItems="center">
        <YStack gap="$1">
          <Text fontSize="$5" fontWeight="600">
            {entry.amountMl} ml
          </Text>
          <Text color="$color10" fontSize="$2">
            {new Date(entry.consumedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </YStack>
        <Button size="$3" circular chromeless icon={Trash2} onPress={onDelete} />
      </XStack>
    </Card>
  );
}
