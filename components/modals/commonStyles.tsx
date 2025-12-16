// modules/commonStyles.ts

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
  },

  label: {
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerWrapper: {
    padding: 0,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    marginTop: 4,
  },
  datePickerButton: {
    backgroundColor: "#eaeaea",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },

  createButton: {
    backgroundColor: "#57507F",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
