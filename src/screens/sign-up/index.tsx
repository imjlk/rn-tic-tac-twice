import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  TextInput as NativeTextInput,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { BackgroundGradient, Button, Text, TextInput } from "@components";
import { Auth } from "aws-amplify";
import styles from "./sign-up.styles";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp, useHeaderHeight } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";
import OTPInput from "@twotalltotems/react-native-otp-input";
import { colors } from "@utils";

type SignUpProps = {
  navigation: StackNavigationProp<StackNavigatorParams, "SignUp">;
  route: RouteProp<StackNavigatorParams, "SignUp">;
};

export default function SingUp({
  navigation,
  route,
}: SignUpProps): ReactElement {
  const unconfirmedUsername = route.params?.username;
  const emailRef = useRef<NativeTextInput | null>(null);
  const nameRef = useRef<NativeTextInput | null>(null);
  const passwordRef = useRef<NativeTextInput | null>(null);
  const headerHeight = useHeaderHeight();
  const [form, setForm] = useState({
    username: "test2",
    email: "test2@test.com",
    name: "test2 user2",
    password: "12345678",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"signUp" | "OTP">(
    unconfirmedUsername ? "OTP" : "signUp"
  );
  const [confirming, setConfirming] = useState(false);
  const [resending, setResending] = useState(false);

  const setFormInput = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const signUp = async () => {
    setLoading(true);
    const { username, email, name, password } = form;
    try {
      await Auth.signUp({ username, password, attributes: { email, name } });
      setStep("OTP");
    } catch (error) {
      console.log(error);
      Alert.alert("Error!", error.message || "An error has occurred.");
    }
    setLoading(false);
  };

  const confirmCode = async (code: string) => {
    setConfirming(true);
    try {
      await Auth.confirmSignUp(
        form.username || unconfirmedUsername || "",
        code
      );
      navigation.navigate("Login");
      Alert.alert("Success!", "You can now login with your account.");
    } catch (error) {
      console.log(error);
      Alert.alert("Error!", error.message || "An error has occurred.");
    }
    setConfirming(false);
  };

  const resendCode = async (username: string) => {
    setResending(true);
    try {
      await Auth.resendSignUp(username);
    } catch (error) {
      console.log(error);
      Alert.alert("Error!", error.message || "An error has occurred.");
    }
    setResending(false);
  };

  useEffect(() => {
    if (unconfirmedUsername) {
      resendCode(unconfirmedUsername);
    }
  }, []);

  return (
    <BackgroundGradient>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {step === "OTP" && (
            <>
              <Text style={styles.OTPtext}>
                Enter the code that you received via e-mail.
              </Text>
              {confirming ? (
                <ActivityIndicator color={colors.lightGreen} />
              ) : (
                <>
                  <OTPInput
                    placeholderCharacter="0"
                    placeholderTextColor="#5d5379"
                    codeInputFieldStyle={styles.OTPInputBox}
                    codeInputHighlightStyle={styles.OTPActiveInputBox}
                    onCodeFilled={(code) => confirmCode(code)}
                    pinCount={6}
                  />
                  {resending ? (
                    <ActivityIndicator color={colors.lightGreen} />
                  ) : (
                    <TouchableOpacity
                      style={styles.resendLinkWrap}
                      onPress={() =>
                        unconfirmedUsername
                          ? resendCode(unconfirmedUsername)
                          : resendCode(form.username)
                      }
                    >
                      <Text style={styles.resendLink}>Resend Link</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </>
          )}
          {step === "signUp" && (
            <>
              {/* TODO: Social Login 버튼 넣기 */}
              <View style={{ height: 300 }}></View>

              <TextInput
                value={form.username}
                onChangeText={(value) => {
                  setFormInput("username", value);
                }}
                placeholder="Username"
                style={{ marginBottom: 20 }}
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailRef.current?.focus();
                }}
              />
              <TextInput
                ref={emailRef}
                keyboardType="email-address"
                value={form.email}
                onChangeText={(value) => {
                  setFormInput("email", value);
                }}
                placeholder="E-mail"
                style={{ marginBottom: 20 }}
                returnKeyType="next"
                onSubmitEditing={() => {
                  nameRef.current?.focus();
                }}
              />
              <TextInput
                ref={nameRef}
                value={form.name}
                onChangeText={(value) => {
                  setFormInput("name", value);
                }}
                placeholder="Name"
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

              <Button loading={loading} title="Sign up" onPress={signUp} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundGradient>
  );
}
