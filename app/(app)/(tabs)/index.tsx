import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const PURPLE = "#57507F";
const BACKGROUND = "#FFF7EB";


export default function Index() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        
        <Text style={styles.title}>Mine barn</Text>
        
        <View style={styles.childCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={{ fontSize: 28 }}>🙋‍♂️</Text>
          </View>
          <View style={styles.childInfo}>
            <Text style={styles.childName}>Roar Johnny</Text>
            <Text style={styles.childStatus}>Sjekket ut</Text>
          </View>
          <View style={styles.circle} />
        </View>

        
        <View style={styles.childCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={{ fontSize: 28 }}>🙋‍♂️</Text>
          </View>
          <View style={styles.childInfo}>
            <Text style={styles.childName}>Andrefødte</Text>
            <Text style={styles.childStatus}>Sjekket ut</Text>
          </View>
          <View style={styles.circle} />
        </View>

        <View style={styles.calendar}>
          <Text style={{ color: "black" }}>Kalender kommer her</Text>
        </View>  
          </ScrollView>
  </SafeAreaView>
        )
        }


const styles = StyleSheet.create({

  safe:{
    flex: 1,
    backgroundColor: BACKGROUND,
  },
 
  container: {
    padding: 24,
    paddingBottom: 40,
  },

  title:{
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
  },
 
  childCard:{
    backgroundColor: PURPLE,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },

   avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#403A63",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  childInfo: {
    flex: 1,
  },

   childName: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },

  childStatus: {
    color: "white",
    fontSize: 16,
  },

  circle: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "white",
  },

  calendar: {
    backgroundColor: "white",
    height: 180,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },

  /*
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "600",
  },
*/
});


