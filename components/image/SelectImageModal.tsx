/**
 * SELECT IMAGE MODAL
 * * ROLE:
 * Provides an interface for the user to either take a new photo with the
 * front-facing camera or select an existing photo from the device library.
 * * KEY LOGIC:
 * 1. Permissions: Utilizes 'expo-camera' hooks to request and verify camera access.
 * 2. Image Optimization: Implements an 'ImageManipulator' pipeline to resize and
 * compress images. This saves bandwidth and storage costs in Firebase.
 * 3. Platform Consistency: Combines 'expo-camera' and 'expo-image-picker' into
 * a unified UI for the user.
 */

import { useAppTheme } from "@/hooks/useAppTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRef } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SelectImageModalProps = {
  closeModal: VoidFunction;
  setImage: (image: string) => void;
};

export default function SelectImageModal({
  closeModal,
  setImage,
}: SelectImageModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const theme = useAppTheme();

  // 1. PERMISSION HANDLING
  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: theme.background }} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.message, { color: theme.text }]}>
          Vi trenger tillatelse til å bruke kameraet
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Gi tillatelse</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.error }]}
          onPress={() => closeModal()}
        >
          <Text style={styles.buttonText}>Avbryt</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * COMPRESS IMAGE
   * Resizes the image to a maximum dimension of 512px and applies 70% JPEG compression.
   * This is essential for maintaining app performance and reducing load times
   * when many profile pictures are displayed in a list.
   */
  async function compressImage(uri: string): Promise<string> {
    try {
      const { width, height } = await new Promise<{
        width: number;
        height: number;
      }>((resolve, reject) => {
        Image.getSize(
          uri,
          (w, h) => resolve({ width: w, height: h }),
          (error) => reject(error)
        );
      });

      const maxDimension = 512;
      let resizeAction;

      if (width > height) {
        if (width > maxDimension) {
          resizeAction = { resize: { width: maxDimension } };
        }
      } else {
        if (height > maxDimension) {
          resizeAction = { resize: { height: maxDimension } };
        }
      }

      const actions = resizeAction ? [resizeAction] : [];

      const manipResult = await ImageManipulator.manipulateAsync(uri, actions, {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      return manipResult.uri;
    } catch (error) {
      console.error("Error compressing image:", error);
      return uri; // Return original if compression fails
    }
  }

  // 2. LIBRARY PICKER
  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [1, 1], // Force square for profile pictures
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const originalUri = result.assets[0].uri;
      const compressedUri = await compressImage(originalUri);
      setImage(compressedUri);
      closeModal();
    }
  }

  // 3. CAMERA CAPTURE
  async function captureImage() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        const compressedUri = await compressImage(photo.uri);
        setImage(compressedUri);
        closeModal();
      }
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="front" ref={cameraRef} />

      {/* UI OVERLAY */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.error }]}
          onPress={() => closeModal()}
        >
          <Text style={styles.buttonText}>Avbryt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => captureImage()}
        >
          <MaterialIcons name="camera" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => pickImage()}
        >
          <Text style={styles.buttonText}>Galleri</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 16,
    paddingHorizontal: 20,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    minWidth: 100,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
