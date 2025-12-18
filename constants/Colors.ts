/**
 * Farge-tema for Surat-appen
 * Støtter både light og dark mode
 */

const tintColorLight = "#5c578f";
const tintColorDark = "#9A96FF";

export const StaticColors = {
  // Text farger
  white: "#FFFFFF",
  black: "#000000",

  // Card text (alltid hvit på fargede bakgrunner)
  cardText: "#FFFFFF",

  // Button text (alltid hvit)
  buttonText: "#FFFFFF",
};

export const Colors = {
  light: {
    // Basis farger
    text: "#000000",
    textSecondary: "#666666",
    textTertiary: "#777777",
    textMuted: "#999999",
    background: "#FFF7ED",
    backgroundSecondary: "#FFFFFF",
    pageHeaderText: "#000000",
    // Tint og theme farger
    tint: tintColorLight,
    icon: "#687076",

    // Tab navigation
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,

    // Primary og secondary farger
    primary: "#7C2AB7",
    secondary: "#9E92FF",

    // Status farger
    error: "#dc3545",
    success: "#28a745",
    warning: "#FFEB3B",

    // Card farger
    card: "#511a78ff",
    cardSelected: "#7C2AB7",
    cardAbsent: "#FFEB3B",
    cardBackground: "#EEEEED",
    textOnCard: "#FFFFFF",

    // UI elements
    border: "#ccc",
    borderLight: "#e0e0e0",
    inputBackground: "#f0f0f0",
    placeholder: "#999999",

    // Comment box
    commentBackground: "#EFEFEF",
    commentText: "#000000",
    commentMeta: "#555555",

    // Select button
    selectButton: "#FFF7ED",
    selectButtonBorder: "#5B5682",
    selectedMarker: "#5B5682",

    // Avatar
    avatarBackground: "#FFF7ED",

    // Modal
    modalOverlay: "rgba(0, 0, 0, 0.5)",
    modalBackground: "#FFFFFF",
    modalHeader: "#f9f9f9",

    // List items
    listItemBackground: "#f0f0f0",
    listItemSelected: "#57507F",

    // Shadow
    shadow: "#000000",

    imageEditOverlay: "rgba(0, 0, 0, 0.4)",
    imageEditIconBackground: "rgba(255, 255, 255, 0.9)",
    imageUploadingOverlay: "rgba(0, 0, 0, 0.5)",
  },
  dark: {
    // Basis farger
    text: "#ECEDEE",
    textSecondary: "#B0B0B0",
    textTertiary: "#888888",
    textMuted: "#666666",
    background: "#1a1625",
    backgroundSecondary: "#2a2435",
    pageHeaderText: "#ECEDEE",
    // Tint og theme farger
    tint: tintColorDark,
    icon: "#9BA1A6",

    // Tab navigation
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,

    // Primary og secondary farger
    primary: "#7C2AB7",
    secondary: "#B57EDC",

    // Status farger
    error: "#ff6b6b",
    success: "#51cf66",
    warning: "#ffd93d",

    // Card farger
    card: "#511a78ff",
    cardSelected: "#7C2AB7",
    cardAbsent: "#6b5b00",
    cardBackground: "#2a2435",
    textOnCard: "#FFFFFF",

    // UI elements
    border: "#444444",
    borderLight: "#333333",
    inputBackground: "#2a2435",
    placeholder: "#666666",

    // Comment box
    commentBackground: "#2a2435",
    commentText: "#ECEDEE",
    commentMeta: "#B0B0B0",

    // Select button
    selectButton: "#3a3550",
    selectButtonBorder: "#9A96FF",
    selectedMarker: "#9A96FF",

    // Avatar
    avatarBackground: "#3a3550",

    // Modal
    modalOverlay: "rgba(0, 0, 0, 0.7)",
    modalBackground: "#2a2435",
    modalHeader: "#3a3550",

    // List items
    listItemBackground: "#3a3550",
    listItemSelected: "#9A96FF",

    // Shadow
    shadow: "#000000",

    imageEditOverlay: "rgba(0, 0, 0, 0.6)",
    imageEditIconBackground: "rgba(58, 53, 80, 0.95)",
    imageUploadingOverlay: "rgba(0, 0, 0, 0.7)",
  },
};

// Type helper for å sikre at begge themes har samme keys
type ColorScheme = typeof Colors.light;
export type ColorName = keyof ColorScheme;
