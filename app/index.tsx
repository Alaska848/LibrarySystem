import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Firebase"; 
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const cleanedEmail = email.trim().toLowerCase();

    if (
      !cleanedEmail.endsWith(".edu") &&
      !cleanedEmail.endsWith(".edu.eg") &&
      !cleanedEmail.endsWith(".com")
    ) {
      Alert.alert(
        "Invalid Email",
        "Please use your university email (.edu or .edu.eg)"
      );
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, cleanedEmail, password);

      const userRef = doc(db, "students", cred.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "admin") {
        Alert.alert("Done!", "LOGGED IN SUCCESSFULLY!", [
          {
            text: "Ok",
            onPress: () => router.replace("/admin"), // 🔁 replace with your admin route
          },
        ]);
      } else {
        Alert.alert("Done!", "LOGGED IN SUCCESSFULLY!", [
          {
            text: "Ok",
            onPress: () => router.replace("/home"), // 🔁 replace with your home route
          },
        ]);
      }
    } catch (error: any) {
      console.log(error.code, error.message);
      Alert.alert("INVALID LOGIN", "Try Again");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="graduation-cap" size={28} color={BROWN} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Access your digital collection and resources
            </Text>
          </View>

          {/* ── Email ── */}
          <Text style={styles.label}>Institutional Email</Text>
          <TextInput
            style={styles.input}
            placeholder="student@university.edu"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* ── Password ── */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, styles.inputPadRight]}
              placeholder="••••••"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#6c757d"
              />
            </TouchableOpacity>
          </View>

          {/* ── Forgot Password ── */}
          <Link href="/forget-password" style={styles.forgotLink}>
            Forgot password?
          </Link>

          {/* ── Sign In Button ── */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In to Library</Text>
          </TouchableOpacity>

          {/* ── Footer ── */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>New to the library? </Text>
            <Link href="/create-account" style={styles.footerLink}>
              Create an account
            </Link>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const BROWN = "#633a19";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

 
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#f5ede6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: BROWN,
    marginBottom: 6,
  },
  subtitle: {
    color: "#6c757d",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

    


  label: {
    color: "#555",
    fontSize: 14,
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fff",
  },
  inputPadRight: { paddingRight: 48 },
  inputWrapper: { justifyContent: "center" },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 12,
  },

    


  forgotLink: {
    color: BROWN,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    marginTop: 8,
    marginBottom: 4,
  },

     


  button: {
    backgroundColor: BROWN,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 8,
    shadowColor: BROWN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.4,
  },

   

  
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
    paddingTop: 16,
    marginTop: 12,
  },
  footerText: { color: "#555", fontSize: 14 },
  footerLink: {
    color: BROWN,
    fontWeight: "bold",
    fontSize: 14,
  },
});
