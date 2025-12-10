import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import SelectImageModal from "./SelectImageModal";

/* Component som viser profilbilde, samt med redigerknapp for å laste opp nytt bilde.
  TODO: 
  [X] Legge til props som kan tas inn fra feks profilsiden for å dynamisk endre når rediger bilde-ikonet vises
  [ ] Må komme tilbake til denne for å sjekke hvordan dette fungerer når vi har ekte brukerkontoer på plass. Sånn som det er nå er det ingen kobling opp mot parents eller brukerkontoen som brukes
  [ ] Gjøre en vurdering om hvorvidt dette skal brukes på tvers av alle kontoer.
*/

type ProfilePictureProps = {
  showEdit?: boolean; // <- ny prop
};

export default function ProfilePicture({ showEdit = false }: ProfilePictureProps) {
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
        </Pressable>

         {showEdit && ( // <-- kun vis når prop er true
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsCameraOpen(true)}
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
  button: {
    marginTop: 30,
    backgroundColor: "#5c578f",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
 editButton: {
  position: "absolute",
  bottom: 10,
  right: 10,

  width: 44,
  height: 44,
  borderRadius: 22,

  backgroundColor: "black",      // selve knappen
  alignItems: "center",
  justifyContent: "center",

  borderWidth: 3,                 // hvit ring
  borderColor: "white",

  // iOS shadow
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },

  // Android elevation
  elevation: 6,
},
  imageWrapper: {
    position: "relative",
    width: 160,
    height: 160,
    alignSelf: "center",
  },
});
