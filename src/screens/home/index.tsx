import React, { ReactElement } from "react";
import { View, ScrollView, Image, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import styles from "./home.styles";
import { StackNavigatorParams } from "@config/navigator";
import { Text, BackgroundGradient, Button } from "@components";
type HomeProps = {
  navigation: StackNavigationProp<StackNavigatorParams, "Home">;
};

export default function Home({ navigation }: HomeProps): ReactElement {
  return (
    <BackgroundGradient>
      <ScrollView contentContainerStyle={styles.container}>
        <Image style={styles.logo} source={require("@assets/logo.png")} />
        <View style={styles.buttons}>
          <Button
            style={{
              marginBottom: 20,
            }}
            onPress={() => navigation.navigate("Game", { gameId: "1" })}
            title="Single Player"
          />
          <Button style={{ marginBottom: 20 }} title="Multiplayer" />
          <Button style={{ marginBottom: 20 }} title="Login" />
          <Button style={{ marginBottom: 20 }} title="Settings" />
        </View>
      </ScrollView>
    </BackgroundGradient>
  );
}
