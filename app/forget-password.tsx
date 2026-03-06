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
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Firebase"; 
import { FontAwesome5 } from "@expo/vector-icons";

export default function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    const cleanedEmail = email.trim().toLowerCase();

    if (
      !cleanedEmail.endsWith(".edu") &&
      !cleanedEmail.endsWith(".edu.eg")
    ) {
      Alert.alert(
        "Invalid Email",
        "Please use your university email (.edu or .edu.eg)"
      );
      return;
    }

    try {
      await sendPasswordResetEmail(auth, cleanedEmail);

      Alert.alert("Done!", "Reset link sent! Please check your email.", [
        { text: "Ok", onPress: () => setEmail("") },
      ]);
    } catch (error: any) {
      console.log(error.code, error.message);

   
      const errorMessages: Record<string, string> = {
        "auth/user-not-found":   "This email address is not registered.",
        "auth/invalid-email":    "Please enter a valid email address.",
        "auth/too-many-requests":"Too many attempts. Please try again later.",
      };

      const message =
        errorMessages[error.code] ?? "Something went wrong. Please try again.";

      Alert.alert("Error", message);
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
            <Text style={styles.title}>Reset Your Password</Text>
            <Text style={styles.subtitle}>
              Enter your institutional email and we'll send you a secure link
              to reset your account password.
            </Text>
          </View>

          {/* ── Email Input ── */}
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

          {/* ── Send Reset Button ── */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Send Reset Link  </Text>
            <FontAwesome5 name="paper-plane" size={16} color="white" />
          </TouchableOpacity>

          {/* ── Back to Login ── */}
          <View style={styles.footerRow}>
            <FontAwesome5 name="arrow-left" size={13} color={BROWN} />
            <Link href="/" style={styles.backLink}>
              {"  "}Back to Login
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
    marginBottom: 28,
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: BROWN,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    color: "#6c757d",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },


  label: {
    color: "#555",
    fontSize: 14,
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

 
  button: {
    backgroundColor: BROWN,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
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
  backLink: {
    color: BROWN,
    fontWeight: "bold",
    fontSize: 14,
  },
});
