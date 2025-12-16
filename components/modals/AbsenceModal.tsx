import { formatDateShort } from "@/utils/date";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useI18n } from "@/hooks/useI18n";
import { useAppTheme } from "@/hooks/useAppTheme";

interface AbsenceModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedChildrenCount: number;
  vacationDays: number;
  setVacationDays: React.Dispatch<React.SetStateAction<number>>;
  vacationStartDate: string;
  onOpenStartDatePicker: () => void;
  onRegisterSickness: () => Promise<void>;
  onRegisterVacation: () => Promise<void>;
}

export const AbsenceModal: React.FC<AbsenceModalProps> = ({
  isVisible,
  onClose,
  selectedChildrenCount,
  vacationDays,
  setVacationDays,
  vacationStartDate,
  onOpenStartDatePicker,
  onRegisterSickness,
  onRegisterVacation,
}) => {
  const { t } = useI18n();
  const theme = useAppTheme();

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={[styles.overlayBackdrop, { backgroundColor: theme.modalOverlay }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.overlayCard, { backgroundColor: theme.modalBackground }]}>
          <Text style={[styles.absenceModalTitle, { color: theme.text }]}>{t("registerLeave")}</Text>
          <Text style={[styles.absenceModalSubtitle, { color: theme.textSecondary }]}>
            {selectedChildrenCount} {t("numOfChildren")}
          </Text>
          <View style={[styles.absenceSection, { backgroundColor: theme.cardBackground }]}>
            <Pressable
              style={[styles.absenceOption, { borderColor: theme.primary }]}
              onPress={onRegisterSickness}
            >
              <Text style={[styles.absenceOptionText, { color: theme.primary }]}>{t("sickToday")}</Text>
            </Pressable>

            <View style={styles.vacationBlock}>
              <Text style={[styles.vacationLabel, { color: theme.text }]}>{t("vacation")}</Text>

              <Pressable
                style={[styles.vacationDateSelect, { 
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.primary 
                }]}
                onPress={onOpenStartDatePicker}
              >
                <Text style={[styles.vacationDateLabel, { color: theme.text }]}>{t("startdate")}:</Text>
                <Text style={[styles.vacationDateValue, { color: theme.primary }]}>
                  {formatDateShort(vacationStartDate)}
                </Text>
              </Pressable>

              <View style={styles.vacationRow}>
                <Text style={[styles.vacationLabel, { flex: 1, color: theme.text }]}>
                  {t("numOfDays")}:
                </Text>
                <Pressable
                  style={[styles.vacationAdjustButton, { borderColor: theme.primary }]}
                  onPress={() => setVacationDays((d) => Math.max(1, d - 1))}
                >
                  <Text style={[styles.vacationAdjustText, { color: theme.primary }]}>-</Text>
                </Pressable>

                <Text style={[styles.vacationDaysText, { color: theme.text }]}>{vacationDays}</Text>

                <Pressable
                  style={[styles.vacationAdjustButton, { borderColor: theme.primary }]}
                  onPress={() => setVacationDays((d) => Math.min(30, d + 1))}
                >
                  <Text style={[styles.vacationAdjustText, { color: theme.primary }]}>+</Text>
                </Pressable>
              </View>

              <Pressable
                style={[styles.absenceOption, { marginTop: 8, borderColor: theme.primary }]}
                onPress={onRegisterVacation}
              >
                <Text style={[styles.absenceOptionText, { color: theme.primary }]}>{t("registerVacation")}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  overlayCard: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    elevation: 6,
  },
  absenceModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  absenceModalSubtitle: {
    fontSize: 14,
    marginBottom: 12,
    color: "#555",
  },
  absenceSection: {
    borderRadius: 16,
    padding: 12,
  },
  absenceOption: {
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 8,
  },
  absenceOptionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  vacationBlock: {
    marginTop: 4,
  },
  vacationLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  vacationDateSelect: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  vacationDateLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  vacationDateValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  vacationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  vacationAdjustButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  vacationAdjustText: {
    fontSize: 18,
    fontWeight: "700",
  },
  vacationDaysText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "700",
  },
});
