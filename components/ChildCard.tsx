/**
 * CHILD CARD COMPONENT
 * * ROLE:
 * A high-visibility list item used in the main dashboard.
 * * KEY FEATURES:
 * 1. Selective Pressable: Separate 'onPress' for the card and 'onSelect'
 * for the checkbox allows for individual child viewing vs bulk selection.
 * 2. Status Color Coding: Uses success/error theme colors to show attendance
 * status (Checked In vs Checked Out) at a glance.
 * 3. Absence Priority: Displays custom labels (e.g., "Sick", "Vacation")
 * directly under the name if an absence is registered in the database.
 */

import ProfilePicture from "@/components/image/ProfilePicture";
import { StaticColors } from "@/constants/Colors";
import { useAppTheme } from "@/hooks/useAppTheme";
import { UIChild } from "@/hooks/useChildData";
import { useI18n } from "@/hooks/useI18n";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ChildCardProps {
  child: UIChild;
  onSelect: () => void;
  onPress: () => void;
  absenceLabel: string | null;
  hideSelectButton?: boolean;
}

export const ChildCard: React.FC<ChildCardProps> = ({
  child,
  onSelect,
  onPress,
  absenceLabel,
  hideSelectButton = false,
}) => {
  const { t } = useI18n();
  const theme = useAppTheme();
  const isAbsent = !!absenceLabel;

  const dynamicCardStyle = [
    styles.card,
    {
      backgroundColor: child.selected
        ? theme.cardSelected
        : isAbsent
        ? theme.card
        : theme.card,
      shadowColor: theme.shadow,
    },
  ];

  const dynamicStatusTextStyle = [
    styles.statusText,
    child.checkedIn ? { color: theme.success } : { color: theme.error },
  ];

  return (
    <Pressable style={styles.cardWrapper} onPress={onPress}>
      <View style={dynamicCardStyle}>
        {/* SELECTOR CHECKBOX */}
        {!hideSelectButton && (
          <Pressable
            style={[
              styles.selectButton,
              {
                borderColor: theme.selectButtonBorder,
                backgroundColor: theme.selectButton,
              },
            ]}
            onPress={onSelect}
          >
            {child.selected && (
              <View
                style={[
                  styles.selectedMarker,
                  { backgroundColor: theme.selectedMarker },
                ]}
              />
            )}
          </Pressable>
        )}

        {/* AVATAR SECTION */}
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: theme.avatarBackground },
          ]}
        >
          <ProfilePicture
            showEdit={false}
            userId={child.id}
            userType="child"
            initialImagePath={child.imageUri}
          />
        </View>

        {/* INFORMATION SECTION */}
        <View style={styles.textContainer}>
          <Text
            style={[styles.nameText, { color: StaticColors.cardText }]}
            numberOfLines={1}
          >
            {child.firstName} {child.lastName}
          </Text>

          <Text style={dynamicStatusTextStyle}>
            {child.checkedIn ? t("checkedIn") : t("checkedOut")}
          </Text>

          {/* ABSENCE NOTIFICATION */}
          {isAbsent && (
            <Text
              style={[
                styles.absenceLabelText,
                { color: StaticColors.cardText },
              ]}
              numberOfLines={1}
            >
              {absenceLabel}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: "100%",
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    elevation: 3, // Android shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    minHeight: 80,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  selectButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  selectedMarker: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    overflow: "hidden",
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 2,
    textAlign: "left",
  },
  statusText: {
    fontSize: 12,
    textAlign: "left",
  },
  absenceLabelText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "left",
  },
});
