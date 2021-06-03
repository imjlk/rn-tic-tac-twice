import React, { ReactElement, useRef } from "react";
import { ScrollView, TextInput as NativeTextInput } from "react-native";
import { BackgroundGradient, Text, TextInput } from "@components";
import styles from "./login.styles";
import { colors } from "@utils";

export default function Login(): ReactElement {
  const passwordRef = useRef<NativeTextInput | null>(null);

  return (
    <BackgroundGradient>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          placeholder="Username"
          style={{ marginBottom: 20 }}
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordRef.current?.focus();
          }}
        />
        <TextInput
          ref={passwordRef}
          placeholder="Password"
          secureTextEntry
          returnKeyType="done"
        />
      </ScrollView>
    </BackgroundGradient>
  );
}
