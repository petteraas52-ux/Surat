import { getImageUrl, invalidateImageCache, uploadImageToFirebase } from "@/api/imageApi";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import SelectImageModal from "./SelectImageModal";
import { useAppTheme } from "@/hooks/useAppTheme";
import { updateParentProfileImage } from "@/api/parents";
import { updateChildProfileImage } from "@/api/children";

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
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    if (showEdit) {
      // Fade in
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Hold synlig i 1.5 sekunder
        Animated.delay(1500),
        // Fade out
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animasjon når edit mode er av
      fadeAnim.setValue(0);
    }
  }, [showEdit]);

  async function handleImageSelected(imageUri: string) {
  console.log("ProfilePicture: Handling image selection:", imageUri);
  setUploading(true);
  
  try {
    // Kall update-funksjoner som returnerer den nye storage path
    let newStoragePath: string | null = null;
    
    if (userType === 'parent') {
      newStoragePath = await updateParentProfileImage(userId, imageUri);
    } else if (userType === 'child') {
      newStoragePath = await updateChildProfileImage(userId, imageUri);
    }

    if (!newStoragePath) {
      throw new Error("Failed to upload and update profile image");
    }

    console.log("ProfilePicture: Image uploaded successfully. New path:", newStoragePath);

    // Invalider cache for det gamle bildet
    if (initialImagePath) {
      await invalidateImageCache(initialImagePath);
    }

    // Last ned og vis det nye bildet fra Firebase Storage
    const newImageUrl = await getImageUrl(newStoragePath);
    if (newImageUrl) {
      setImage(newImageUrl);
      console.log("ProfilePicture: New image loaded and displayed");
    }

    
  } catch (error) {
    console.error("ProfilePicture: Error uploading/updating image:", error);
  } finally {
    setUploading(false);
  }
}

  return (
    <View style={[styles.container, style]}>
      <Modal visible={isCameraOpen}>
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
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="person-circle" size={45} color={theme.icon} />
          </View>
        )}
        {uploading && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}
      </Pressable>
      {showEdit && (isPressed || fadeAnim) && !uploading && (
        <Animated.View
        pointerEvents="none"
          style={[
            styles.editOverlay, 
            { 
              backgroundColor: theme.imageEditOverlay,
              opacity: isPressed ? 1 : fadeAnim, // Full opacity ved press, ellers animated
            }
          ]}
        >
          <View style={[styles.editIconContainer, { 
            backgroundColor: theme.imageEditIconBackground,
            borderColor: theme.primaryLight 
          }]}>
            <FontAwesome5 name="edit" size={24} color={theme.primaryLight} />
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
   loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
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
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
});
