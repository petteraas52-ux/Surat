import { createParent } from "@/api/parents";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreateParentScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateParent = async () => {
    if (!firstName || !lastName || !email || !phone || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      await createParent(email, password, {
        firstName,
        lastName,
        eMail: email,
        phone,
        imageUri: "",
        children: [],
      });

      Alert.alert("Success", "Parent account created successfully.");

      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to create parent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Create Parent Account
      </Text>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Temporary Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleCreateParent}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#ccc" : "#2563eb",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {loading ? "Creating..." : "Create Parent"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
};
