import ProfilePicture from "@/components/image/ProfilePicture";
import { UIChild } from "@/hooks/useChildData";
import { useI18n } from "@/hooks/useI18n";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ChildCardProps {
  child: UIChild;
  onSelect: () => void;
  onPress: () => void;
  absenceLabel: string | null;
}

export const ChildCard: React.FC<ChildCardProps> = ({
  child,
  onSelect,
  onPress,
  absenceLabel,
}) => {
  const { t } = useI18n();
  const isAbsent = !!absenceLabel;

  const dynamicCardStyle = [
    styles.card,
    child.selected && styles.cardSelected,
    isAbsent && styles.cardAbsent,
  ];

  const dynamicStatusTextStyle = [
    styles.statusText,
    child.checkedIn ? styles.statusTextCheckedIn : styles.statusTextCheckedOut,
  ];

  return (
    <Pressable style={styles.cardWrapper} onPress={onPress}>
      <View style={dynamicCardStyle}>
        <Pressable style={styles.selectButton} onPress={onSelect}>
          {child.selected && <View style={styles.selectedMarker} />}
        </Pressable>

        <View style={styles.avatarContainer}>
          <ProfilePicture
            showEdit={false}
            userId={child.id}
            userType="child"
            initialImagePath={child.imageUri}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.nameText} numberOfLines={1}>
            {child.firstName} {child.lastName}
          </Text>

          <Text style={dynamicStatusTextStyle}>
            {child.checkedIn ? t("checkedIn") : t("checkedOut")}
          </Text>

          {isAbsent && (
            <Text style={styles.absenceLabelText} numberOfLines={1}>
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
    backgroundColor: "#5B5682",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    minHeight: 80,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  cardSelected: {
    backgroundColor: "#9E92FF",
  },
  cardAbsent: {
    backgroundColor: "#5b56826d",
  },
  selectButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#5B5682",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    zIndex: 10,
  },
  selectedMarker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#5B5682",
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#FFF7ED",
    overflow: "hidden",
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  nameText: {
    fontSize: 16,
    color: "#ffff",
    fontWeight: "900",
    marginBottom: 2,
    textAlign: "left",
  },
  statusText: {
    fontSize: 12,
    textAlign: "left",
  },
  statusTextCheckedIn: {
    color: "#28a745",
  },
  statusTextCheckedOut: {
    color: "#dc3545",
    fontWeight: "700",
  },
  absenceLabelText: {
    color: "#5B5682",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "left",
  },
});
