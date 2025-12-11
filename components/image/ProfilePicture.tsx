import { updateChildProfileImage } from "@/api/children";
import { getImageUrl } from "@/api/imageApi";
import { updateParentProfileImage } from "@/api/parents";
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

type ProfilePictureProps = {
  showEdit?: boolean;
  userId: string; // childId eller parentId
  userType: "child" | "parent"; // Type bruker
  initialImagePath?: string; // Existing image path fra Firestore
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

  // Last inn eksisterende bilde når komponenten mountes
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

  async function handleImageSelected(imageUri: string) {
    setImage(imageUri); // Vis bildet umiddelbart
    setUploading(true);

    try {
      let success = false;
      if (userType === "child") {
        success = await updateChildProfileImage(userId, imageUri);
      } else {
        success = await updateParentProfileImage(userId, imageUri);
      }

      if (success) {
        console.log("✅ Profilbilde oppdatert!");
      } else {
        console.error("❌ Kunne ikke oppdatere profilbilde");
        setImage(null); // Reset hvis feil
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      setImage(null);
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, style]}>
          <ActivityIndicator size="large" color="#5c578f" />
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
            <Ionicons
              name="person-circle"
              size={160}
              color="grey"
              style={styles.image}
            />
          )}
          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
        </Pressable>
        {showEdit && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsCameraOpen(true)}
            disabled={uploading}
          >
            <FontAwesome5 name="edit" size={18} color="white" />
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
  // wrapper fyller forelderen hvis den får en konkret størrelse,
  // og har fallback hvis ikke
  imageWrapper: {
    position: "relative",
    width: "100%",        
    aspectRatio: 1,       
    overflow: "hidden",  
    borderRadius: 999,   
    minWidth: 64,
    minHeight: 64,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    resizeMode: "cover", // sikrer riktig utsnitt
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#000",
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
    borderRadius: 999,
  },
});

