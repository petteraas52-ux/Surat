import { useAppTheme } from "@/hooks/useAppTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
/* Basert på kode fra kyrssplattform https://github.com/studBrage/Kryssplattform-HK-H25/blob/main/components/SelectImageModal.tsx */

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
  if (!permission) {
    return <View />;
  }

  // denne bør vel huskes, og endres andre steder?
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

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      closeModal();
    }
  }

  async function captureImage() {
    if (cameraRef.current) {
      const image = await cameraRef.current.takePictureAsync();
      if (image) {
        setImage(image.uri);
        closeModal();
      }
    }
  }

  /*   async function compressImage(){
    const context = useImageManipulator(image.uri);
    
    context.crop({
        width: 0,
        originX: 0,
        originY: 0,
        height: 0
    }).;
    const image = await context.renderAsync();
    const result = await image.saveAsync({
      format: SaveFormat.PNG,
    });

    setImage(result);
  
  } */

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="front" ref={cameraRef} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.error }]} onPress={() => closeModal()}>
          <Text style={styles.buttonText}>Avbryt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => captureImage()}>
          <MaterialIcons name="camera" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => pickImage()}>
          <Text style={styles.buttonText}>Bilder</Text>
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
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
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
