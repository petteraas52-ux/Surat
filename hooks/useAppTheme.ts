// hooks/useAppTheme.ts
import { useThemeColor } from './useThemeColor';

export function useAppTheme() {
  return {
    // Backgrounds
    background: useThemeColor({}, 'background'),
    backgroundSecondary: useThemeColor({}, 'backgroundSecondary'),
    cardBackground: useThemeColor({}, 'cardBackground'),
    
    // Text colors
    text: useThemeColor({}, 'text'),
    textSecondary: useThemeColor({}, 'textSecondary'),
    textTertiary: useThemeColor({}, 'textTertiary'),
    textMuted: useThemeColor({}, 'textMuted'),
    pageHeaderText: useThemeColor({}, 'pageHeaderText'),
    // Primary colors
    primary: useThemeColor({}, 'primary'),
    primaryDark: useThemeColor({}, 'primaryDark'),
    primaryLight: useThemeColor({}, 'primaryLight'),
    secondary: useThemeColor({}, 'secondary'),
    
    // Status colors
    error: useThemeColor({}, 'error'),
    success: useThemeColor({}, 'success'),
    warning: useThemeColor({}, 'warning'),
    
    // Card colors
    card: useThemeColor({}, 'card'),
    cardSelected: useThemeColor({}, 'cardSelected'),
    cardAbsent: useThemeColor({}, 'cardAbsent'),
    textOnCard: useThemeColor({}, 'textOnCard'),

    // UI elements
    border: useThemeColor({}, 'border'),
    borderLight: useThemeColor({}, 'borderLight'),
    inputBackground: useThemeColor({}, 'inputBackground'),
    placeholder: useThemeColor({}, 'placeholder'),
    
    // Comment box
    commentBackground: useThemeColor({}, 'commentBackground'),
    commentText: useThemeColor({}, 'commentText'),
    commentMeta: useThemeColor({}, 'commentMeta'),
    
    // Select button
    selectButton: useThemeColor({}, 'selectButton'),
    selectButtonBorder: useThemeColor({}, 'selectButtonBorder'),
    selectedMarker: useThemeColor({}, 'selectedMarker'),
    
    // Avatar
    avatarBackground: useThemeColor({}, 'avatarBackground'),
    
    // Modal
    modalOverlay: useThemeColor({}, 'modalOverlay'),
    modalBackground: useThemeColor({}, 'modalBackground'),
    modalHeader: useThemeColor({}, 'modalHeader'),
    
    // List items
    listItemBackground: useThemeColor({}, 'listItemBackground'),
    listItemSelected: useThemeColor({}, 'listItemSelected'),
    
    // Icons and tabs
    tint: useThemeColor({}, 'tint'),
    icon: useThemeColor({}, 'icon'),
    tabIconDefault: useThemeColor({}, 'tabIconDefault'),
    tabIconSelected: useThemeColor({}, 'tabIconSelected'),
    
    // Shadow
    shadow: useThemeColor({}, 'shadow'),

    // Image edit overlay
    imageEditOverlay: useThemeColor({}, 'imageEditOverlay'),
    imageEditIconBackground: useThemeColor({}, 'imageEditIconBackground'),
    imageUploadingOverlay: useThemeColor({}, 'imageUploadingOverlay'),
  };
}