import React, { ReactElement } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import styles from "./home.styles";
import { StackNavigatorParams } from "@config/navigator";
import { BackgroundGradient } from "@components";
type HomeProps = {
  navigation: StackNavigationProp<StackNavigatorParams, "Home">;
};

export default function Home({ navigation }: HomeProps): ReactElement {
  return (
    <BackgroundGradient>
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Home</Text>
        <Button
          title="Game"
          onPress={() => {
            navigation.navigate("Game", { gameId: "001" });
          }}
        />
      </ScrollView>
    </BackgroundGradient>
  );
}
