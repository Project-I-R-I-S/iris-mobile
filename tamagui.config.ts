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
 * `accent` is that one accent color. Screens use `theme="accent"` for
 * primary CTAs (submit buttons, FABs, selected toggle states) instead of
 * `theme="active"` — "active" is Tamagui's *pressed-state* sub-theme, not a
 * primary-button color. On React Native it also leaves `color` undefined
 * on several of its variants (there's no CSS cascade to fall back through
 * like on web), which is why those buttons rendered with invisible/illegible
 * labels in both light and dark mode. `accent` reuses Tamagui's pre-tuned
 * "blue" palette but pins an explicit, contrast-checked `color` on every
 * sub-theme we actually render, so button labels are never undefined.
 *
 * To customize further:
 *   - colors: extend `tokens.color` and add semantic entries in `themes`
 *   - typography: swap `@tamagui/font-inter` for another font package
 *   - spacing/radii: extend `tokens.space`, `tokens.radius`
 */
// Tamagui's public `ThemesOut` type doesn't expose per-component sub-themes
// (e.g. `light_blue_Button`) even though they exist on the runtime themes
// object, so we read the source palette through an untyped alias, then cast
// each entry back to the real theme shape (`ThemeDef`, below) so the merged
// `themes` map keeps precise, literal keys — that's what lets `ThemeName`
// (and therefore `theme="accent"` prop typing) pick up the new theme.
type ThemeDef = typeof defaultConfig.themes.light_blue;
const rawThemes = defaultConfig.themes as unknown as Record<string, ThemeDef>;

function accentSubTheme(sourceKey: string, colorSourceKey: string): ThemeDef {
  return { ...rawThemes[sourceKey], color: rawThemes[colorSourceKey].color };
}

const accentThemes: Record<
  | 'light_accent'
  | 'light_accent_Button'
  | 'light_accent_active'
  | 'light_accent_active_Button'
  | 'dark_accent'
  | 'dark_accent_Button'
  | 'dark_accent_active'
  | 'dark_accent_active_Button',
  ThemeDef
> = {
  light_accent: accentSubTheme('light_blue', 'light_blue'),
  light_accent_Button: accentSubTheme('light_blue_Button', 'light_blue'),
  light_accent_active: accentSubTheme('light_blue_active', 'light_blue'),
  light_accent_active_Button: accentSubTheme('light_blue_active_Button', 'light_blue'),
  dark_accent: accentSubTheme('dark_blue', 'dark_blue'),
  dark_accent_Button: accentSubTheme('dark_blue_Button', 'dark_blue'),
  dark_accent_active: accentSubTheme('dark_blue_active', 'dark_blue'),
  dark_accent_active_Button: accentSubTheme('dark_blue_active_Button', 'dark_blue'),
};

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    ...accentThemes,
  },
});

export type AppConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
