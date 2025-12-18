/**
 * PROFILE SCREEN
 * * ROLE:
 * Allows employees to view and manage their personal details, change their access PIN,
 * switch application language, and securely log out.
 * * LOGIC:
 * 1. Data Fetching: Retrieves the current authenticated user's metadata from Firestore.
 * 2. Inline Editing: Uses a toggle ('isEditing') to switch between text labels and inputs.
 * 3. Atomic Updates: Splits full names back into first/last components before saving to the database.
 */

import { getEmployee, updateEmployee } from "@/api/employeApi";
import ProfilePicture from "@/components/image/ProfilePicture";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import ChangePinModal from "@/components/modals/ChangePinModal";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useI18n } from "@/hooks/useI18n";
import { EmployeeProps } from "@/types/employeeData";
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

export default function ProfileScreen() {
  const auth = getAuth();
  const { t } = useI18n();
  const theme = useAppTheme();
  const uid = auth.currentUser?.uid;

  // --- LOCAL STATE ---
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState<EmployeeProps | null>(null);
  const [showChangePin, setShowChangePin] = useState(false);

  /**
   * LOGOUT HANDLER
   * Triggers Firebase signOut. The Auth listener in the root layout
   * will catch this and redirect the user to the Login screen.
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /**
   * INITIAL LOAD
   * Fetches profile data from Firestore once on component mount.
   */
  useEffect(() => {
    if (!uid) return;

    const loadProfile = async () => {
      try {
        const employee = await getEmployee(uid);

        if (employee) {
          setName(`${employee.firstName} ${employee.lastName}`);
          setPhone(employee.phone);
          setEmail(employee.eMail);
          setEmployeeData(employee);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [uid]);

  /**
   * SAVE HANDLER
   * Transforms the single 'name' input back into first/last names for Firestore consistency.
   */
  const handleSave = async () => {
    if (!uid) return;

    // Simple split logic: first word is firstName, everything else is lastName
    const [firstName, ...lastParts] = name.split(" ");
    const lastName = lastParts.join(" ");

    try {
      await updateEmployee(uid, {
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

  // --- LOADING / EMPTY STATES ---

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  if (!uid) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.background }]}
      >
        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.text }]}>
            {t("noUserLoggedIn")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* HEADER & IMAGE */}
        <Text style={[styles.title, { color: theme.text }]}>
          {t("myProfileHeader")}
        </Text>

        <View
          style={[
            styles.profilePictureWrapper,
            { backgroundColor: theme.inputBackground },
          ]}
        >
          <ProfilePicture
            showEdit={isEditing}
            userId={uid}
            userType="employee"
            initialImagePath={employeeData?.imageUri}
          />
        </View>

        {/* NAME SECTION */}
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>{t("name")}</Text>
          {isEditing && (
            <MaterialIcons name="edit" size={20} color={theme.primary} />
          )}
        </View>
        {isEditing ? (
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.inputBackground, color: theme.text },
            ]}
            value={name}
            onChangeText={setName}
            placeholderTextColor={theme.placeholder}
          />
        ) : (
          <Text
            style={[
              styles.value,
              { backgroundColor: theme.inputBackground, color: theme.text },
            ]}
          >
            {name}
          </Text>
        )}

        {/* PHONE SECTION */}
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>
            {t("phone")}
          </Text>
          {isEditing && (
            <MaterialIcons name="edit" size={20} color={theme.primary} />
          )}
        </View>
        {isEditing ? (
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.inputBackground, color: theme.text },
            ]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={theme.placeholder}
          />
        ) : (
          <Text
            style={[
              styles.value,
              { backgroundColor: theme.inputBackground, color: theme.text },
            ]}
          >
            {phone}
          </Text>
        )}

        {/* EMAIL SECTION */}
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>
            {t("email")}
          </Text>
          {isEditing && (
            <MaterialIcons name="edit" size={20} color={theme.primary} />
          )}
        </View>
        {isEditing ? (
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.inputBackground, color: theme.text },
            ]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor={theme.placeholder}
          />
        ) : (
          <Text
            style={[
              styles.value,
              { backgroundColor: theme.inputBackground, color: theme.text },
            ]}
          >
            {email}
          </Text>
        )}

        {/* TOGGLE EDIT / SAVE BUTTON */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <Text style={styles.buttonText}>
            {isEditing ? t("save") : t("edit")}
          </Text>
        </TouchableOpacity>

        {/* LANGUAGE SETTINGS */}
        <LanguageSwitcher />

        {/* PIN MANAGEMENT */}
        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => setShowChangePin(true)}
        >
          <Text style={[styles.buttonText, { color: "white" }]}>
            {t("changePin")}
          </Text>
        </Pressable>

        <ChangePinModal
          uid={uid}
          visible={showChangePin}
          onClose={() => setShowChangePin(false)}
        />

        {/* LOGOUT */}
        <Pressable
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>{t("logout")}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    justifyContent: "center",
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
  profilePictureWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 20,
    overflow: "hidden",
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
    borderRadius: 10,
  },
  input: {
    width: "80%",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    marginTop: 30,
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
