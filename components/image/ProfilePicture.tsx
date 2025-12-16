import { getImageUrl } from "@/api/imageApi";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

type ProfilePictureProps = {
  showEdit?: boolean;
  userId: string;
  userType: "child" | "parent";
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
  const theme = useAppTheme(); 
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

  async function handleImageSelected(imageUri: string) {}

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
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
      <Pressable style={styles.imageWrapper}>
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
      {showEdit && (
        <TouchableOpacity
          style={[styles.editButton, { 
            backgroundColor: theme.backgroundSecondary + 'be', // semi-transparent
            borderColor: theme.primaryLight,
            shadowColor: theme.shadow 
          }]}
          onPress={() => setIsCameraOpen(true)}
          disabled={uploading}
        >
          <FontAwesome5 name="edit" size={18} color={theme.primaryLight}/>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
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
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
