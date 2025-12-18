/**
 * COMMON MODAL STYLES
 * * ROLE:
 * A shared style sheet used across all administrative and user modals to
 * maintain UI/UX consistency throughout the application.
 * * DESIGN PATTERN:
 * 1. Accessibility: Large touch targets for buttons (padding: 16) and
 * readable font sizes (16px+).
 * 2. Visual Hierarchy: Strong weight for labels (700) and distinct
 * background colors for inputs vs. cards.
 * 3. Platform Consistency: 'textAlignVertical: "top"' ensures multi-line
 * inputs (descriptions/comments) behave correctly on both Android and iOS.
 */

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Main wrapper for modal content with standard horizontal breathing room
  container: {
    padding: 24,
  },
  // Used for loading states or empty state messages within modals
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Standard heading for the top of every modal
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
  },
  // Section headers within forms (e.g., "First Name", "Department")
  label: {
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 6,
  },
  // Default text input style - designed to be overridden by theme colors
  input: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    letterSpacing: 0,
  },
  // Specifically for multiline TextInput (e.g., Event description or Allergy notes)
  descriptionInput: {
    height: 100,
    textAlignVertical: "top", // Essential for Android multi-line alignment
  },
  // Container for DropDownPicker or Picker to ensure uniform borders
  pickerWrapper: {
    padding: 0,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    marginTop: 4,
  },
  // Used for fields that trigger a native DatePicker modal
  datePickerButton: {
    backgroundColor: "#eaeaea",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  // High-contrast primary action button (Save, Update, Register)
  createButton: {
    backgroundColor: "#57507F",
    padding: 16,
    borderRadius: 50, // Pill-shaped button for modern look
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  // Useful for the header rows in ChildDetailModal and AdminEditModal
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
});
