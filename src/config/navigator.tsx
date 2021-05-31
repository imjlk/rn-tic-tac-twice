import React, { ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { Home, Game, Settings } from "@screens";
import { colors } from "@utils";
import { color } from "react-native-reanimated";

export type StackNavigatorParams = {
  Home: undefined;
  Game: { gameId: string };
  Settings: undefined;
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
