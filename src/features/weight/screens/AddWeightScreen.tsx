import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Input, Label, Paragraph, YStack } from 'tamagui';

import { useCreateWeightEntry } from '../hooks';
import { WeightEntryPayload } from '../types';

export function AddWeightScreen() {
  const navigation = useNavigation();
  const createMutation = useCreateWeightEntry();

  const [weightKg, setWeightKg] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    const weight = parseFloat(weightKg);
    if (isNaN(weight) || weight <= 0) {
      setError('Enter a valid weight.');
      return;
    }

    const payload: WeightEntryPayload = {
      weightKg: weight,
      recordedAt: new Date().toISOString(),
      notes: notes.trim() || undefined,
    };

    try {
      await createMutation.mutateAsync(payload);
      navigation.goBack();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Failed to save entry';
      setError(msg);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
      <YStack gap="$4">
        <YStack gap="$2">
          <Label htmlFor="weightKg">Weight (kg)</Label>
          <Input
            id="weightKg"
            value={weightKg}
            onChangeText={setWeightKg}
            keyboardType="decimal-pad"
            placeholder="e.g. 72.5"
          />
        </YStack>

        <YStack gap="$2">
          <Label htmlFor="notes">Notes</Label>
          <Input id="notes" value={notes} onChangeText={setNotes} placeholder="optional" />
        </YStack>

        {error && <Paragraph color="$red10">{error}</Paragraph>}

        <Button
          size="$5"
          theme="active"
          onPress={onSubmit}
          disabled={createMutation.isPending}
          marginTop="$4"
        >
          {createMutation.isPending ? 'Saving…' : 'Save entry'}
        </Button>
      </YStack>
    </ScrollView>
  );
}
