import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
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
import { Auth, Hub } from "aws-amplify";
import { useAuth } from "@contexts/auth-context";

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

  const [authLoaded, setAuthLoaded] = useState(false);
  const { setUser } = useAuth();

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
      } catch (error) {
        setUser(null);
      }
      setAuthLoaded(true);
    };

    checkCurrentUser();

    // TODO: hubData type?
    const hubListener = (hubData: any) => {
      const { data, event } = hubData.payload;
      switch (event) {
        case "signOut":
          setUser(null);
          break;
        case "signIn":
          setUser(data);
          break;

        default:
          break;
      }
    };
    Hub.listen("auth", hubListener);

    return () => {
      Hub.remove("auth", hubListener);
    };
  }, []);

  return fontLoaded && nanumFontsLoaded && authLoaded ? (
    <>{children}</>
  ) : (
    <AppLoading />
  );
}
