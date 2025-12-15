import { getParent, updateParent } from "@/api/parents";
import ProfilePicture from "@/components/image/ProfilePicture";
import { ParentProps } from "@/types/parent";
import { MaterialIcons } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChangePinModal from "@/components/modals/ChangePinModal";

export default function ProfileScreen() {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [parentData, setParentData] = useState<ParentProps | null>(null);
  const [showChangePin, setShowChangePin] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (!uid) return;

    const loadProfile = async () => {
      try {
        const parent = await getParent(uid);

        if (parent) {
          setName(`${parent.firstName} ${parent.lastName}`);
          setPhone(parent.phone);
          setEmail(parent.eMail);
          setParentData(parent);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [uid]);

  const handleSave = async () => {
    if (!uid) return;

    const [firstName, ...lastParts] = name.split(" ");
    const lastName = lastParts.join(" ");

    try {
      await updateParent(uid, {
        firstName,
        lastName,
        phone,
        eMail: email,
      });

      setIsEditing(false);
      console.log("Profile updated");
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color="#5c578f" />
      </SafeAreaView>
    );
  }

  if (!uid) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.title}>Ingen bruker logget inn</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Min profil</Text>
        <View style={styles.profilePictureWrapper}>
          <ProfilePicture
            showEdit={isEditing}
            userId={uid}
            userType="parent"
            initialImagePath={parentData?.imageUri}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Navn</Text>
          {isEditing && <MaterialIcons name="edit" size={20} color="#5c578f" />}
        </View>
        {isEditing ? (
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        ) : (
          <Text style={styles.value}>{name}</Text>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Telefonnummer</Text>
          {isEditing && <MaterialIcons name="edit" size={20} color="#5c578f" />}
        </View>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        ) : (
          <Text style={styles.value}>{phone}</Text>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>E-post</Text>
          {isEditing && <MaterialIcons name="edit" size={20} color="#5c578f" />}
        </View>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        ) : (
          <Text style={styles.value}>{email}</Text>
        )}


        <Pressable style={styles.button} onPress={() => setShowChangePin(true)}>
          <Text style={styles.buttonText}>Endre PIN</Text>
        </Pressable>

        <ChangePinModal
          uid={uid}
          visible={showChangePin}
          onClose={() => setShowChangePin(false)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <Text style={styles.buttonText}>
            {isEditing ? "Lagre" : "Rediger"}
          </Text>
          
        </TouchableOpacity>
        <Pressable style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logg ut</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF7ED", justifyContent: "center" },
  container: { padding: 24, paddingBottom: 40, alignItems: "center" },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
  },

  profilePictureWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 20,
    overflow: "hidden",
    backgroundColor: "#eee",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 5,
  },
  label: { fontSize: 16, fontWeight: "600" },
  value: {
    width: "80%",
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  input: {
    width: "80%",
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#5B5682",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
