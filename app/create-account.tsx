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
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../Firebase"; 
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function CreateAccount() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [Userid, setUserid] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const doPasswordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const showConfirmInvalid =
    confirmTouched && confirmPassword.length > 0 && password !== confirmPassword;

  const showConfirmValid = confirmTouched && doPasswordsMatch;

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

    setConfirmTouched(true);
    if (password !== confirmPassword) return;

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        cleanedEmail,
        password
      );

      await setDoc(doc(db, "students", cred.user.uid), {
        name,
        Userid,
        email: cleanedEmail,
        role: "student",
      });

      await sendEmailVerification(cred.user);
      await auth.signOut();

      Alert.alert(
        "Verify Your Email",
        "A verification link has been sent to your university email. Please verify before logging in.",
        [{ text: "OK", onPress: () => router.replace("/") }]
      );
    } catch (error: any) {
      console.log(error);
      Alert.alert("INVALID INFORMATION!", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* ── Brown Decorative Panel ── */}
        <View style={styles.brownPanel}>
          <View style={styles.panelTop}>
            <FontAwesome5
              name="book-open"
              size={32}
              color="white"
              style={styles.bookIcon}
            />
            <Text style={styles.panelTitle}>Join the Digital Archive</Text>
            <Text style={styles.panelSubtitle}>
              Unlock instant access to over 2 million journals, digital
              manuscripts, and academic textbooks.
            </Text>
          </View>

          <View style={styles.panelBottom}>
            {["24/7 Remote Access", "Personal Reading Lists", "Citation Tools Integration"].map(
              (item) => (
                <View key={item} style={styles.checkRow}>
                  <FontAwesome5 name="check-circle" size={16} color="white" />
                  <Text style={styles.checkText}>{item}</Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* ── Form Card ── */}
        <View style={styles.formCard}>
          <Text style={styles.title}>Create Your Library Account</Text>
          <Text style={styles.subtitle}>
            Please use your official university credentials to register for full
            access.
          </Text>

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Jane Doe"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          {/* Student ID */}
          <Text style={styles.label}>Student ID</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 12345678"
            placeholderTextColor="#aaa"
            value={Userid}
            onChangeText={setUserid}
            keyboardType="number-pad"
          />

          {/* University Email */}
          <Text style={styles.label}>University Email</Text>
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

          {/* Password */}
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

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                styles.inputPadRight,
                showConfirmInvalid && styles.inputInvalid,
                showConfirmValid && styles.inputValid,
              ]}
              placeholder="••••••"
              placeholderTextColor="#aaa"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              onBlur={() => setConfirmTouched(true)}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={22}
                color="#6c757d"
              />
            </TouchableOpacity>
          </View>

          {/* Password feedback */}
          {!showConfirmInvalid && !showConfirmValid && (
            <Text style={styles.hintText}>Passwords must match.</Text>
          )}
          {showConfirmInvalid && (
            <Text style={styles.invalidText}>Passwords do not match.</Text>
          )}
          {showConfirmValid && (
            <Text style={styles.validText}>Passwords match ✓</Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/" style={styles.loginLink}>
              Log in here
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
    backgroundColor: "#f5f5f5",
  },

  
  brownPanel: {
    backgroundColor: BROWN,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 28,
  },
  panelTop: { marginBottom: 20 },
  bookIcon: { marginBottom: 16 },
  panelTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  panelSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "300",
  },
  panelBottom: { marginTop: 12 },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkText: {
    color: "white",
    marginLeft: 10,
    fontSize: 14,
  },


  formCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },
  subtitle: {
    color: "#6c757d",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  label: {
    color: "#6c757d",
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
  inputWrapper: {
    justifyContent: "center",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  inputInvalid: { borderColor: "#dc3545" },
  inputValid:   { borderColor: "#198754" },
  hintText:    { color: "#6c757d", fontSize: 13, marginTop: 4 },
  invalidText: { color: "#dc3545", fontSize: 13, marginTop: 4 },
  validText:   { color: "#198754", fontSize: 13, marginTop: 4 },


  button: {
    backgroundColor: BROWN,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
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
    letterSpacing: 0.5,
  },


  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
    paddingTop: 16,
    marginTop: 12,
  },
  loginText: { color: "#555", fontSize: 14 },
  loginLink: {
    color: BROWN,
    fontWeight: "bold",
    fontSize: 14,
  },
});
