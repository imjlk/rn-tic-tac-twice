import React, { ReactElement } from "react";
import { StyleSheet } from "react-native";
import { AppBootstrap } from "@components";
import Navigator from "@config/navigator";

export default function App(): ReactElement {
  return (
    <AppBootstrap>
      <Navigator />
    </AppBootstrap>
  );
}
