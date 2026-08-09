import { config as defaultConfig } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

/**
 * Tamagui configuration for I.R.I.S.
 *
 * We start from the default v3 preset (which gives us themes, animations,
 * fonts, and standard tokens) and layer our own brand tokens on top. The
 * design language leans "clean, calm, informative" — soft neutrals, one
 * accent, generous spacing.
 *
 * To customize further:
 *   - colors: extend `tokens.color` and add semantic entries in `themes`
 *   - typography: swap `@tamagui/font-inter` for another font package
 *   - spacing/radii: extend `tokens.space`, `tokens.radius`
 */
export const tamaguiConfig = createTamagui(defaultConfig);

export type AppConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
