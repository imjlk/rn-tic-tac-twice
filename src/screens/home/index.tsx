import React, { ReactElement, useState } from "react";
import { View, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import styles from "./home.styles";
import { StackNavigatorParams } from "@config/navigator";
import { Text, BackgroundGradient, Button } from "@components";
import { useAuth } from "@contexts/auth-context";
import { Auth } from "aws-amplify";
type HomeProps = {
  navigation: StackNavigationProp<StackNavigatorParams, "Home">;
};

export default function Home({ navigation }: HomeProps): ReactElement {
  const { user } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <BackgroundGradient>
      <ScrollView contentContainerStyle={styles.container}>
        <Image style={styles.logo} source={require("@assets/logo.png")} />
        <View style={styles.buttons}>
          <Button
            style={{
              marginBottom: 20,
            }}
            title="Single Player"
            onPress={() => navigation.navigate("Game", { gameId: "1" })}
          />
          <Button style={{ marginBottom: 20 }} title="Multiplayer" />
          <Button
            loading={signingOut}
            style={{ marginBottom: 20 }}
            title={user ? "Logout" : "Login"}
            onPress={async () => {
              if (user) {
                setSigningOut(true);
                try {
                  await Auth.signOut();
                } catch (error) {
                  // console.log(error);
                  Alert.alert("Error!", "Error signing out.");
                }
                setSigningOut(false);
              } else {
                navigation.navigate("Login");
              }
            }}
          />
          <Button
            style={{ marginBottom: 20 }}
            title="Settings"
            onPress={() => {
              navigation.navigate("Settings");
            }}
          />
          {user && (
            <Text style={styles.loggedIn}>
              Logged in as<Text weight={700}> {user.username}</Text>
            </Text>
          )}
        </View>
      </ScrollView>
    </BackgroundGradient>
  );
}
