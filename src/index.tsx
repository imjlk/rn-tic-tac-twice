import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Game, Home } from "@screens";
import {
  useFonts,
  BlackHanSans_400Regular,
} from "@expo-google-fonts/black-han-sans";
import {
  useFonts as useNanumFonts,
  NanumGothic_400Regular,
  NanumGothic_700Bold,
  NanumGothic_800ExtraBold,
} from "@expo-google-fonts/nanum-gothic";

export default function App() {
  const [fontLoaded] = useFonts({
    BlackHanSans_400Regular,
  });
  const [nanumFontsLoaded] = useNanumFonts({
    NanumGothic_400Regular,
    NanumGothic_700Bold,
    NanumGothic_800ExtraBold,
  });
  if (!nanumFontsLoaded || !fontLoaded) return null;
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 25,
          fontFamily: "NanumGothic_400Regular",
        }}
      >
        Hello World
      </Text>
    </View>
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
