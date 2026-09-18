import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, Trash2 } from '@tamagui/lucide-icons';
import { useMemo } from 'react';
import { Alert, FlatList } from 'react-native';
import { Button, Card, H2, H4, Paragraph, Separator, Spinner, Text, XStack, YStack } from 'tamagui';

import { useAuth } from '@/auth/AuthContext';
import { RootStackParamList } from '@/navigation/types';
import { todayIso } from '@/utils/date';
import { isNotFoundError } from '@/utils/errors';

import { useDeleteWeightEntry, useLatestWeight, useWeightEntries } from '../hooks';
import { WeightEntry } from '../types';

const HISTORY_DAYS = 90;

export function WeightScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const timezone = user?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { to, from } = useMemo(() => {
    const now = new Date();
    const toDate = todayIso(timezone);
    const fromDate = new Date(now.getTime() - HISTORY_DAYS * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    return { to: toDate, from: fromDate };
  }, [timezone]);

  const {
    data: latest,
    isLoading: isLatestLoading,
    isError: isLatestError,
    error: latestError,
    refetch: refetchLatest,
  } = useLatestWeight();
  const { data: entries, isLoading, isError, refetch, isRefetching } = useWeightEntries(
    from,
    to,
    timezone,
  );
  const deleteEntry = useDeleteWeightEntry();

  const latestIsRealError = isLatestError && !isNotFoundError(latestError);

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
      <YStack padding="$4" gap="$2" borderBottomWidth={1} borderColor="$borderColor">
        <H4>Latest</H4>
        {isLatestLoading ? (
          <Spinner color="$color10" />
        ) : latestIsRealError ? (
          <YStack gap="$2" alignItems="flex-start">
            <Paragraph color="$color10">Couldn't load your latest weight.</Paragraph>
            <Button size="$3" onPress={() => refetchLatest()}>
              Retry
            </Button>
          </YStack>
        ) : !latest ? (
          <Paragraph color="$color10">No weight logged yet.</Paragraph>
        ) : (
          <XStack gap="$5" alignItems="flex-end">
            <YStack>
              <Text color="$color10" fontSize="$2">
                Weight
              </Text>
              <H2>{Number(latest.weightKg)} kg</H2>
            </YStack>
            <YStack>
              <Text color="$color10" fontSize="$2">
                BMI
              </Text>
              {latest.bmi != null ? (
                <H2>{Number(latest.bmi)}</H2>
              ) : (
                <Paragraph color="$color10">Set your height in Settings</Paragraph>
              )}
            </YStack>
          </XStack>
        )}
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
            <EntryRow entry={item} onDelete={() => confirmDelete(item.id)} />
          )}
          ItemSeparatorComponent={() => <Separator />}
          ListEmptyComponent={
            <YStack padding="$6" alignItems="center">
              <Paragraph color="$color10">No entries in the last {HISTORY_DAYS} days.</Paragraph>
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
        onPress={() => navigation.navigate('AddWeight')}
      >
        Log weight
      </Button>
    </YStack>
  );
}

function EntryRow({ entry, onDelete }: { entry: WeightEntry; onDelete: () => void }) {
  return (
    <Card padding="$4" backgroundColor="$background" borderRadius={0}>
      <XStack justifyContent="space-between" alignItems="center">
        <YStack gap="$1" flex={1}>
          <Text fontSize="$5" fontWeight="600">
            {Number(entry.weightKg)} kg
          </Text>
          <Text color="$color10" fontSize="$2">
            {new Date(entry.recordedAt).toLocaleDateString()}
            {entry.bmi != null ? ` · BMI ${Number(entry.bmi)}` : ''}
          </Text>
          {entry.notes && (
            <Text color="$color10" fontSize="$2">
              {entry.notes}
            </Text>
          )}
        </YStack>
        <Button size="$3" circular chromeless icon={Trash2} onPress={onDelete} />
      </XStack>
    </Card>
  );
}
