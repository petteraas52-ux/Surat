/**
 * USE THEME COLOR HOOK
 * * ROLE:
 * A utility hook that resolves a specific color value based on the current
 * system theme (light or dark mode).
 * * CORE FUNCTIONALITY:
 * 1. Theme Detection: Utilizes the system's color scheme to determine
 * which palette to pull from.
 * 2. Prop Overriding: Allows individual components to pass manual 'light'
 * or 'dark' overrides, which take precedence over global constants.
 * 3. Type Safety: Leverages TypeScript keys from the central Colors
 * constant to ensure only valid theme-ready color names are requested.
 */

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // 1. Detect the current active scheme (default to 'light' if undefined)
  const theme = useColorScheme() ?? "light";

  // 2. Check if the component provided a direct override for this theme
  const colorFromProps = props[theme];

  if (colorFromProps) {
    // Return the custom color passed via props
    return colorFromProps;
  } else {
    // 3. Fallback to the global design token defined in @/constants/Colors
    return Colors[theme][colorName];
  }
}
