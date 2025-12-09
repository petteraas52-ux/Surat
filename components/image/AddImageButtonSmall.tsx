import { uploadImageToFirebase } from "@/api/imageApi";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SelectImageModal from "./SelectImageModal";

// Ikke helt ferdig med denne, litt usikker på om den er nødvendig.

export default function AddImageButtonSmall() {
  const [image, setImage] = useState<string | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  return (
    <View style={styles.container}>

        <Modal visible={isCameraOpen}>
            <SelectImageModal
              closeModal={() => setIsCameraOpen(false)}
              setImage={(image) => {
                setImage(image);
              }} 
            />
          </Modal>

      <TouchableOpacity style={styles.button} onPress={() => setIsCameraOpen(true)}>
        <Text style={styles.buttonText}>Velg bilde fra fil</Text>
      </TouchableOpacity>

      <Pressable>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <EvilIcons name="image" size={80} color="purple" />
        )}
        {image ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => uploadImageToFirebase(image)}
          >
            <Text style={styles.buttonText}>Last opp til firebase</Text>
          </TouchableOpacity>
        ) : (
          <Text>Du må laste opp bilde først</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#5c578f",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
 buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 100,
    marginBottom: 20,
  },
});
