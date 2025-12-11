import { getStorageRef } from "@/firebaseConfig";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
/*  
    Mer eller mindre basert på kode fra kryssplattform
    https://github.com/studBrage/Kryssplattform-HK-H25/blob/main/api/imageApi.ts  
    https://firebase.google.com/docs/storage/web/upload-files
        
    TODO (kanskje?): 
        1. Legge til kompressjon av bilde for redusert fil-størrelser https://docs.expo.dev/versions/latest/sdk/imagemanipulator/
        2. Lagre bilde i et fastsatt filformat og størrelse. dette kan gjøres via expo-image-manipulator
        3. er dette sikkert?
*/

export async function uploadImageToFirebase(uri: string) {
  const fetchResponse = await fetch(uri);
  const blob = await fetchResponse.blob();

  const imageName = uri.split("/").pop()?.split(".")[0] ?? "AnonymtBilde";
  const uploadPath = `images/${imageName}`;
  const imageRef = await getStorageRef(uploadPath);

  try {
    console.log("Starting upload");
    await uploadBytesResumable(imageRef, blob);
    console.log("Image uploaded to firebase");
    return uploadPath;
  } catch (e) {
    console.error("Error uploading image to firebase", e);
    return null;
  }
}


export async function getImageUrl(storagePath: string): Promise<string | null> {
  try {
    const imageRef = await getStorageRef(storagePath);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (e) {
    console.error("Error getting image URL:", e);
    return null;
  }
}

// EKSEMPEL PÅ implementasjon

/* export default function TEST() {

  const [image, setImage] = useState<string | null>(null);

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
      <Text style={styles.text}>Bare en test av bildeopplasting</Text>

        <TouchableOpacity style={styles.button} onPress={() => pickImage()}>
          <Text style={styles.text}>Velg bilde fra fil</Text>
        </TouchableOpacity>

      <Pressable
        >
          {image ? ( 
            <Image
              source={{ uri: image }}
              style={{ resizeMode: "cover", width: "100%", height: 300 }}
            />
          ) : (
            <EvilIcons name="image" size={80} color="purple" />
          )}
        {image ? (
          <TouchableOpacity style={styles.button} onPress={() => uploadImageToFirebase(image)}>
          <Text style={styles.text}>Last opp til firebase</Text>
        </TouchableOpacity>
        ) : (
          <Text>Du må laste opp bilde først</Text>
        )
      }
      </Pressable>
       
    </View>
  );
} */
