import ProfilePicture from "@/components/image/ProfilePicture";
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
      backgroundColor: isAbsent 
        ? theme.card + '6d' // semi-transparent when absent
        : child.selected 
          ? theme.cardSelected 
          : theme.card,
      shadowColor: theme.shadow 
    },
  ];

  const dynamicStatusTextStyle = [
    styles.statusText,
    child.checkedIn 
    ? { color: theme.success }  
    : { color: theme.error },
  ];

  return (
    <Pressable style={styles.cardWrapper} onPress={onPress}>
      <View style={dynamicCardStyle}>
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

        <View style={styles.textContainer}>
          <Text
            style={[styles.nameText, { color: theme.text }]}
            numberOfLines={1}
          >
            {child.firstName} {child.lastName}
          </Text>

          <Text style={dynamicStatusTextStyle}>
            {child.checkedIn ? t("checkedIn") : t("checkedOut")}
          </Text>

          {isAbsent && (
            <Text style={[styles.absenceLabelText, { color: theme.primaryLight }]} numberOfLines={1}>
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
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
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