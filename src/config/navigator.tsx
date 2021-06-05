import React, { ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { Home, Game, Settings, Login, SignUp } from "@screens";
import { colors } from "@utils";

export type StackNavigatorParams = {
  Home: undefined;
  Game: { gameId: string };
  Settings: undefined;
  Login: undefined;
  SignUp: { username: string } | undefined;
};

const Stack = createStackNavigator<StackNavigatorParams>();
const navigationOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.purple,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  headerTintColor: colors.lightGreen,
  headerTitleStyle: {
    fontFamily: "NanumGothic_700Bold",
    fontSize: 20,
  },
  headerBackTitleStyle: {
    fontFamily: "NanumGothic_700Bold",
    fontSize: 14,
  },
};

export default function Navigator(): ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={navigationOptions}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Game"
          component={Game}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: "Sign up" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
