/**
 * PROFILE PICTURE COMPONENT
 * * ROLE:
 * A high-level component used across Child, Parent, and Employee profiles.
 * It handles the full lifecycle of a profile image: Fetching (URL resolution),
 * UI Feedback (Loading/Uploading), and UI interaction (Animations).
 * * KEY LOGIC:
 * 1. Image Resolution: Converts Firebase Storage paths into viewable HTTPS URLs.
 * 2. Animated Feedback: When 'showEdit' is toggled, an overlay fades in/out to
 * signal to the user that the image is now interactable.
 * 3. Role-Based Upload: Dynamically calls the correct API based on 'userType'.
 */

import { updateChildProfileImage } from "@/api/childrenApi";
import { getImageUrl, invalidateImageCache } from "@/api/imageApi";
import { updateParentProfileImage } from "@/api/parentApi";
import { useAppTheme } from "@/hooks/useAppTheme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import SelectImageModal from "./SelectImageModal";

type ProfilePictureProps = {
  showEdit?: boolean;
  userId: string;
  userType: "child" | "parent" | "employee";
  initialImagePath?: string;
  style?: ViewStyle;
};

export default function ProfilePicture({
  showEdit = false,
  userId,
  userType,
  initialImagePath,
  style,
}: ProfilePictureProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const theme = useAppTheme();

  // Animation Ref for the "Edit" hint
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /**
   * INITIAL LOAD
   * Resolves the storage path (e.g., "images/uid.jpg") into a public URL.
   */
  useEffect(() => {
    async function loadImage() {
      if (initialImagePath) {
        const url = await getImageUrl(initialImagePath);
        setImage(url);
      }
      setLoading(false);
    }
    loadImage();
  }, [initialImagePath]);

  /**
   * HINT ANIMATION
   * Triggers a subtle "Edit" icon pulse when the parent component
   * enters edit mode, helping with user discoverability.
   */
  useEffect(() => {
    if (showEdit) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [showEdit]);

  /**
   * UPLOAD HANDLER
   * Coordinates the file upload and document update in Firestore.
   */
  async function handleImageSelected(imageUri: string) {
    setUploading(true);

    try {
      let newStoragePath: string | null = null;

      // Polymorphic API call based on userType
      if (userType === "parent") {
        newStoragePath = await updateParentProfileImage(userId, imageUri);
      } else if (userType === "child") {
        newStoragePath = await updateChildProfileImage(userId, imageUri);
      }
      // Note: Add employee logic here if required

      if (!newStoragePath) throw new Error("Upload failed");

      // Invalidate cache to ensure the user doesn't see the old image
      if (initialImagePath) {
        await invalidateImageCache(initialImagePath);
      }

      // Refresh the UI with the new image
      const newImageUrl = await getImageUrl(newStoragePath);
      if (newImageUrl) setImage(newImageUrl);
    } catch (error) {
      console.error("ProfilePicture Error:", error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={[styles.container, style]}>
      {/* SELECTION OVERLAY */}
      <Modal visible={isCameraOpen} transparent animationType="fade">
        <SelectImageModal
          closeModal={() => setIsCameraOpen(false)}
          setImage={(imageUri) => {
            handleImageSelected(imageUri);
            setIsCameraOpen(false);
          }}
        />
      </Modal>

      <Pressable
        style={styles.imageWrapper}
        onPress={() => showEdit && setIsCameraOpen(true)}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        disabled={!showEdit || uploading}
      >
        {/* ACTUAL IMAGE OR PLACEHOLDER */}
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="person-circle" size={45} color={theme.icon} />
          </View>
        )}

        {/* LOADING INDICATOR */}
        {uploading && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}
      </Pressable>

      {/* EDIT HINT OVERLAY */}
      {showEdit && (isPressed || fadeAnim) && !uploading && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.editOverlay,
            {
              backgroundColor: theme.imageEditOverlay,
              opacity: isPressed ? 1 : fadeAnim,
            },
          ]}
        >
          <View
            style={[
              styles.editIconContainer,
              {
                backgroundColor: theme.imageEditIconBackground,
                borderColor: theme.primary,
              },
            ]}
          >
            <FontAwesome5 name="edit" size={24} color={theme.primary} />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  editOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  editIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
