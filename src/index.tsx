import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { Text, AppBootstrap } from "@components";

export default function App(): ReactElement {
  return (
    <AppBootstrap>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 25,
          }}
          onPress={() => {
            alert(true);
          }}
        >
          Nesting is <Text weight={800}>working </Text>well
        </Text>
      </View>
    </AppBootstrap>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
