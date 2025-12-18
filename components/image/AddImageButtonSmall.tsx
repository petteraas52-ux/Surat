/**
 * ADD IMAGE BUTTON SMALL
 * * ROLE:
 * A utility component that allows users to pick an image from their device
 * gallery or camera and upload it to Firebase Storage.
 * * LOGIC:
 * 1. Image Selection: Uses 'expo-image-picker' and a custom 'SelectImageModal'.
 * 2. Preview: Displays the selected image in a circular preview before upload.
 * 3. Firebase Integration: Calls 'uploadImageToFirebase' with the local URI.
 */

import { uploadImageToFirebase } from "@/api/imageApi";
import { useAppTheme } from "@/hooks/useAppTheme";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SelectImageModal from "./SelectImageModal";

export default function AddImageButtonSmall() {
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const theme = useAppTheme();

  /**
   * HANDLER: UPLOAD
   * Sends the local URI to Firebase. You might want to add
   * a loading state here to show progress.
   */
  const handleUpload = async () => {
    if (!image) return;
    try {
      await uploadImageToFirebase(image);
      console.log("Upload successful");
      // Optionally clear image or show success message
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* SELECTION MODAL 
          Triggered to choose between Camera or Library 
      */}
      <Modal visible={isCameraOpen} animationType="slide" transparent={true}>
        <SelectImageModal
          closeModal={() => setIsCameraOpen(false)}
          setImage={(uri) => {
            setImage(uri);
            setIsCameraOpen(false); // Close modal after selection
          }}
        />
      </Modal>

      {/* SELECT TRIGGER */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => setIsCameraOpen(true)}
      >
        <Text style={styles.buttonText}>Velg bilde</Text>
      </TouchableOpacity>

      <View style={styles.previewSection}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View
            style={[
              styles.placeholder,
              { backgroundColor: theme.inputBackground },
            ]}
          >
            <EvilIcons name="image" size={100} color={theme.icon} />
          </View>
        )}

        {/* UPLOAD TRIGGER */}
        {image ? (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleUpload}
          >
            <Text style={styles.buttonText}>Last opp til Firebase</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Ingen bilde valgt
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  previewSection: {
    alignItems: "center",
    marginTop: 20,
  },
  placeholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    marginTop: 10,
  },
});
