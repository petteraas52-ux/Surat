
import ProfilePicture from "@/components/image/ProfilePicture";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [name, setName] = useState("Ola Nordmann");
  const [phone, setPhone] = useState("+47 111 22 333");
  const [email, setEmail] = useState("ola@nordmann.no");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    console.log("Lagrer data:", { name, phone, email });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Min profil</Text>

        <ProfilePicture showEdit={isEditing} />
        
        {/* Navn */}
        <View style={styles.row}>
          <Text style={styles.label}>Navn</Text>
          {isEditing && <MaterialIcons name="edit" size={20} color="#5c578f" />}
        </View>
        {isEditing ? (
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        ) : (
          <Text style={styles.value}>{name}</Text>
        )}

        {/* Telefonnummer */}
        <View style={styles.row}>
          <Text style={styles.label}>Telefonnummer</Text>
          {isEditing && <MaterialIcons name="edit" size={20} color="#5c578f" />}
        </View>
        {isEditing ? (
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        ) : (
          <Text style={styles.value}>{phone}</Text>
        )}

        {/* E-post */}
        <View style={styles.row}>
          <Text style={styles.label}>E-post</Text>
          {isEditing && <MaterialIcons name="edit" size={20} color="#5c578f" />}
        </View>
        {isEditing ? (
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        ) : (
          <Text style={styles.value}>{email}</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={() => (isEditing ? handleSave() : setIsEditing(true))}>
          <Text style={styles.buttonText}>{isEditing ? "Lagre" : "Rediger"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
  },

  image: {
    width: 160,
    height: 160,
    borderRadius: 100,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
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
});
