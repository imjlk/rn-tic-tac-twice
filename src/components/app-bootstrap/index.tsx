import React, { ReactElement, ReactNode } from "react";
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
import AppLoading from "expo-app-loading";

type AppBootstrapProps = {
  children: ReactNode;
};

export default function AppBootstrap({
  children,
}: AppBootstrapProps): ReactElement {
  const [fontLoaded] = useFonts({
    BlackHanSans_400Regular,
  });
  const [nanumFontsLoaded] = useNanumFonts({
    NanumGothic_400Regular,
    NanumGothic_700Bold,
    NanumGothic_800ExtraBold,
  });
  if (!nanumFontsLoaded || !fontLoaded) return <AppLoading />;
  return fontLoaded && nanumFontsLoaded ? <>{children}</> : <AppLoading />;
}
