import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useLogin } from "../../hooks/useLogin";
import { RootState } from "../../store"; // You'll need to create this

export function LoginScreen() {
  const { navigate } = useNavigation();
  const [email, setEmail] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [showPassword, setShowPassword] = useState(false);
  const { tryLogin } = useLogin();

  // Get loading state from Redux instead of local state
  const { isLoading: isLoggingIn, user } = useSelector(
    (state: RootState) => state.auth
  );
  console.log('user: ', user);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const onSuccess = () => {
        console.log("Login successful");
        navigate("Home"); // Add your navigation logic here
      };
      await tryLogin(
        { username: email, password, expiresInMins: 30 },
        onSuccess
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoggingIn}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!isLoggingIn}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, isLoggingIn && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoggingIn}
        >
          <Text style={styles.buttonText}>
            {isLoggingIn ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    justifyContent: "center",
  },
  formContainer: {
    gap: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 4,
  },
  button: {
    backgroundColor: "#007AFF",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
