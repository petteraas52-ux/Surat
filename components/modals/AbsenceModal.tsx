/**
 * ABSENCE MODAL COMPONENT
 * * ROLE:
 * A specialized modal for parents to register sickness or vacation for one
 * or more children simultaneously.
 * * KEY LOGIC:
 * 1. Quick Sick-Leave: A single button to register illness for "today".
 * 2. Vacation Planning: Includes a date picker trigger and a numeric stepper
 * (plus/minus buttons) to define the length of the holiday.
 * 3. Atomic State: Uses external state for vacation days and start dates,
 * allowing the parent component to control the submission logic.
 */

import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { formatDateShort } from "@/utils/date";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

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
      {/* SEMI-TRANSPARENT BACKDROP */}
      <View
        style={[
          styles.overlayBackdrop,
          { backgroundColor: theme.modalOverlay },
        ]}
      >
        {/* DISMISS MODAL ON BACKDROP TAP */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View
          style={[
            styles.overlayCard,
            { backgroundColor: theme.modalBackground },
          ]}
        >
          <Text style={[styles.absenceModalTitle, { color: theme.text }]}>
            {t("registerLeave")}
          </Text>
          <Text
            style={[
              styles.absenceModalSubtitle,
              { color: theme.textSecondary },
            ]}
          >
            {selectedChildrenCount} {t("numOfChildren")}
          </Text>

          <View
            style={[
              styles.absenceSection,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            {/* SICKNESS REGISTRATION */}
            <Pressable
              style={[styles.absenceOption, { borderColor: theme.primary }]}
              onPress={onRegisterSickness}
            >
              <Text
                style={[styles.absenceOptionText, { color: theme.primary }]}
              >
                {t("sickToday")}
              </Text>
            </Pressable>

            {/* VACATION REGISTRATION BLOCK */}
            <View style={styles.vacationBlock}>
              <Text style={[styles.vacationLabel, { color: theme.text }]}>
                {t("vacation")}
              </Text>

              {/* DATE PICKER TRIGGER */}
              <Pressable
                style={[
                  styles.vacationDateSelect,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.primary,
                  },
                ]}
                onPress={onOpenStartDatePicker}
              >
                <Text style={[styles.vacationDateLabel, { color: theme.text }]}>
                  {t("startdate")}:
                </Text>
                <Text
                  style={[styles.vacationDateValue, { color: theme.primary }]}
                >
                  {formatDateShort(vacationStartDate)}
                </Text>
              </Pressable>

              {/* DURATION STEPPER */}
              <View style={styles.vacationRow}>
                <Text
                  style={[styles.vacationLabel, { flex: 1, color: theme.text }]}
                >
                  {t("numOfDays")}:
                </Text>

                <Pressable
                  style={[
                    styles.vacationAdjustButton,
                    { borderColor: theme.primary },
                  ]}
                  onPress={() => setVacationDays((d) => Math.max(1, d - 1))}
                >
                  <Text
                    style={[
                      styles.vacationAdjustText,
                      { color: theme.primary },
                    ]}
                  >
                    -
                  </Text>
                </Pressable>

                <Text style={[styles.vacationDaysText, { color: theme.text }]}>
                  {vacationDays}
                </Text>

                <Pressable
                  style={[
                    styles.vacationAdjustButton,
                    { borderColor: theme.primary },
                  ]}
                  onPress={() => setVacationDays((d) => Math.min(30, d + 1))}
                >
                  <Text
                    style={[
                      styles.vacationAdjustText,
                      { color: theme.primary },
                    ]}
                  >
                    +
                  </Text>
                </Pressable>
              </View>

              {/* SUBMIT VACATION */}
              <Pressable
                style={[
                  styles.absenceOption,
                  { marginTop: 8, borderColor: theme.primary },
                ]}
                onPress={onRegisterVacation}
              >
                <Text
                  style={[styles.absenceOptionText, { color: theme.primary }]}
                >
                  {t("registerVacation")}
                </Text>
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
    padding: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  absenceModalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  absenceModalSubtitle: {
    fontSize: 15,
    marginBottom: 20,
  },
  absenceSection: {
    borderRadius: 16,
    padding: 16,
  },
  absenceOption: {
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: "center",
    marginBottom: 10,
  },
  absenceOptionText: {
    fontSize: 15,
    fontWeight: "700",
  },
  vacationBlock: {
    marginTop: 10,
  },
  vacationLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  vacationDateSelect: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
  },
  vacationDateLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  vacationDateValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  vacationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  vacationAdjustButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  vacationAdjustText: {
    fontSize: 20,
    fontWeight: "700",
  },
  vacationDaysText: {
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: "700",
  },
});
