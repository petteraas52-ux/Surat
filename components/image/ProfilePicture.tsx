import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import SelectImageModal from "./SelectImageModal";
import { getImageUrl } from "@/api/imageApi";
import { updateChildProfileImage } from "@/api/children";
import { updateParentProfileImage } from "@/api/parents";

type ProfilePictureProps = {
  showEdit?: boolean;
  userId: string; // childId eller parentId
  userType: "child" | "parent"; // Type bruker
  initialImagePath?: string; // Existing image path fra Firestore
};

export default function ProfilePicture({
  showEdit = false,
  userId,
  userType,
  initialImagePath,
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
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <ActivityIndicator size="large" color="#5c578f" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal visible={isCameraOpen}>
        <SelectImageModal
          closeModal={() => setIsCameraOpen(false)}
          setImage={(imageUri) => {
            handleImageSelected(imageUri);
            setIsCameraOpen(false);
          }}
        />
      </Modal>
      <View style={styles.imageWrapper}>
        <Pressable>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 100,
    marginBottom: 20,
  },
  editButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  imageWrapper: {
    position: "relative",
    width: 160,
    height: 160,
    alignSelf: "center",
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});