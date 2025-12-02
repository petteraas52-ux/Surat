import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>MINE BARN</Text>

      <Pressable
        onPress={() => signOut(auth)}
        style={[styles.button, { backgroundColor: "purple" }]}
      >
        <Text style={styles.buttonText}>Logg ut</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
