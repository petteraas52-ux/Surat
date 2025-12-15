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
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlayBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.overlayCard}>
          <Text style={styles.absenceModalTitle}>Registrer fravær</Text>
          <Text style={styles.absenceModalSubtitle}>
            {selectedChildrenCount} barn valgt
          </Text>
          <View style={styles.absenceSection}>
            <Pressable
              style={styles.absenceOption}
              onPress={onRegisterSickness}
            >
              <Text style={styles.absenceOptionText}>Sykdom i dag</Text>
            </Pressable>

            <View style={styles.vacationBlock}>
              <Text style={styles.vacationLabel}>Ferie</Text>

              <Pressable
                style={styles.vacationDateSelect}
                onPress={onOpenStartDatePicker}
              >
                <Text style={styles.vacationDateLabel}>Startdato:</Text>
                <Text style={styles.vacationDateValue}>
                  {formatDateShort(vacationStartDate)}
                </Text>
              </Pressable>

              <View style={styles.vacationRow}>
                <Text style={[styles.vacationLabel, { flex: 1 }]}>
                  Antall dager:
                </Text>
                <Pressable
                  style={styles.vacationAdjustButton}
                  onPress={() => setVacationDays((d) => Math.max(1, d - 1))}
                >
                  <Text style={styles.vacationAdjustText}>-</Text>
                </Pressable>

                <Text style={styles.vacationDaysText}>{vacationDays}</Text>

                <Pressable
                  style={styles.vacationAdjustButton}
                  onPress={() => setVacationDays((d) => Math.min(30, d + 1))}
                >
                  <Text style={styles.vacationAdjustText}>+</Text>
                </Pressable>
              </View>

              <Pressable
                style={[styles.absenceOption, { marginTop: 8 }]}
                onPress={onRegisterVacation}
              >
                <Text style={styles.absenceOptionText}>Registrer ferie</Text>
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
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  overlayCard: {
    width: "100%",
    backgroundColor: "white",
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
    backgroundColor: "#F5F3FF",
    borderRadius: 16,
    padding: 12,
  },
  absenceOption: {
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#57507F",
    alignItems: "center",
    marginBottom: 8,
  },
  absenceOptionText: {
    fontSize: 14,
    color: "#57507F",
    fontWeight: "600",
  },
  vacationBlock: {
    marginTop: 4,
  },
  vacationLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: "#312E81",
  },
  vacationDateSelect: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#EFEFFF",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#57507F",
  },
  vacationDateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#312E81",
  },
  vacationDateValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#57507F",
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
    borderColor: "#57507F",
    alignItems: "center",
    justifyContent: "center",
  },
  vacationAdjustText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#57507F",
  },
  vacationDaysText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "700",
  },
});
