import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, H4, Input, Label, Paragraph, YStack } from 'tamagui';

import { useCreateFoodEntry } from '../hooks';
import { FoodEntryPayload, MealType } from '../types';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack', 'drink'];

export function AddFoodScreen() {
  const navigation = useNavigation();
  const createMutation = useCreateFoodEntry();

  const [name, setName] = useState('');
  const [mealType, setMealType] = useState<MealType>('snack');
  const [servingSize, setServingSize] = useState('1');
  const [servingUnit, setServingUnit] = useState('serving');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [caffeine, setCaffeine] = useState('');
  const [fluidMl, setFluidMl] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    const cal = parseFloat(calories);
    const size = parseFloat(servingSize);
    if (!name.trim() || isNaN(cal) || isNaN(size)) {
      setError('Name, serving size, and calories are required.');
      return;
    }

    const payload: FoodEntryPayload = {
      name: name.trim(),
      mealType,
      servingSize: size,
      servingUnit: servingUnit.trim() || 'serving',
      calories: cal,
      proteinG: parseFloat(protein) || 0,
      carbsG: parseFloat(carbs) || 0,
      fatG: parseFloat(fat) || 0,
      caffeineMg: parseFloat(caffeine) || 0,
      fluidMl: parseFloat(fluidMl) || undefined,
      consumedAt: new Date().toISOString(),
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
          <Label htmlFor="name">Food name</Label>
          <Input id="name" value={name} onChangeText={setName} placeholder="e.g. Dal makhani" />
        </YStack>

        <YStack gap="$2">
          <Label>Meal type</Label>
          <YStack flexDirection="row" flexWrap="wrap" gap="$2">
            {MEAL_TYPES.map((m) => (
              <Button
                key={m}
                size="$3"
                theme={mealType === m ? 'accent' : undefined}
                variant={mealType === m ? undefined : 'outlined'}
                onPress={() => setMealType(m)}
              >
                {m}
              </Button>
            ))}
          </YStack>
        </YStack>

        <YStack flexDirection="row" gap="$3">
          <YStack flex={1} gap="$2">
            <Label>Serving size</Label>
            <Input value={servingSize} onChangeText={setServingSize} keyboardType="decimal-pad" />
          </YStack>
          <YStack flex={1} gap="$2">
            <Label>Unit</Label>
            <Input value={servingUnit} onChangeText={setServingUnit} placeholder="g, ml, cup" />
          </YStack>
        </YStack>

        <H4 marginTop="$2">Nutrition</H4>

        <YStack gap="$2">
          <Label>Calories (kcal) *</Label>
          <Input value={calories} onChangeText={setCalories} keyboardType="decimal-pad" />
        </YStack>

        <YStack flexDirection="row" gap="$3">
          <YStack flex={1} gap="$2">
            <Label>Protein (g)</Label>
            <Input value={protein} onChangeText={setProtein} keyboardType="decimal-pad" />
          </YStack>
          <YStack flex={1} gap="$2">
            <Label>Carbs (g)</Label>
            <Input value={carbs} onChangeText={setCarbs} keyboardType="decimal-pad" />
          </YStack>
          <YStack flex={1} gap="$2">
            <Label>Fat (g)</Label>
            <Input value={fat} onChangeText={setFat} keyboardType="decimal-pad" />
          </YStack>
        </YStack>

        <YStack flexDirection="row" gap="$3">
          <YStack flex={1} gap="$2">
            <Label>Caffeine (mg)</Label>
            <Input value={caffeine} onChangeText={setCaffeine} keyboardType="decimal-pad" />
          </YStack>
          <YStack flex={1} gap="$2">
            <Label>Fluid (ml)</Label>
            <Input
              value={fluidMl}
              onChangeText={setFluidMl}
              keyboardType="decimal-pad"
              placeholder="drinks only"
            />
          </YStack>
        </YStack>

        {error && <Paragraph color="$red10">{error}</Paragraph>}

        <Button
          size="$5"
          theme="accent"
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
