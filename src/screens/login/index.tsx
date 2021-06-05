import React, { ReactElement, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  TextInput as NativeTextInput,
  TouchableOpacity,
} from "react-native";
import { BackgroundGradient, Button, Text, TextInput } from "@components";
import { Auth } from "aws-amplify";
import styles from "./login.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";

type LoginProps = {
  navigation: StackNavigationProp<StackNavigatorParams, "Login">;
};

export default function Login({ navigation }: LoginProps): ReactElement {
  const passwordRef = useRef<NativeTextInput | null>(null);
  const [form, setForm] = useState({
    username: "test",
    password: "12345678",
  });
  const [loading, setLoading] = useState(false);

  const setFormInput = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const login = async () => {
    setLoading(true);
    const { username, password } = form;
    try {
      await Auth.signIn(username, password);
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
      if (error.code === "UserNotConfirmedException") {
        navigation.navigate("SignUp", { username });
      }
      Alert.alert("Error!", error.message || "An error has occurred.");
    }
    setLoading(false);
  };

  return (
    <BackgroundGradient>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          value={form.username}
          onChangeText={(value) => {
            setFormInput("username", value);
          }}
          placeholder="Username"
          style={{ marginBottom: 20 }}
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordRef.current?.focus();
          }}
        />
        <TextInput
          value={form.password}
          onChangeText={(value) => {
            setFormInput("password", value);
          }}
          style={{ marginBottom: 30 }}
          ref={passwordRef}
          placeholder="Password"
          secureTextEntry
          returnKeyType="done"
        />

        <Button loading={loading} title="Login" onPress={login} />

        <TouchableOpacity
          style={styles.registerLinkWrap}
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text style={styles.registerLink}>Don&apos;t have account?</Text>
        </TouchableOpacity>
      </ScrollView>
    </BackgroundGradient>
  );
}
