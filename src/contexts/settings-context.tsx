import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const difficulties = {
  "1": "Easy",
  "3": "Normal",
  "5": "Hard",
  "-1": "Impossible",
};

type SettingsType = {
  difficulty: keyof typeof difficulties;
  haptics: boolean;
  sounds: boolean;
};

type SettingsContextType = {
  settings: SettingsType | null;
  loadSettings: () => void;
  saveSetting: <T extends keyof SettingsType>(
    settings: T,
    value: SettingsType[T]
  ) => void;
};

const defaultSettings: SettingsType = {
  difficulty: "-1",
  haptics: true,
  sounds: true,
};

const SettingsContext =
  createContext<SettingsContextType | undefined>(undefined);

function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider.");
  }
  return context;
}

function SettingsProvider(props: { children: ReactNode }): ReactElement {
  const [settings, setSettings] = useState<SettingsType | null>(null);

  // TODO: Generic Type 이해하고 넘어가기
  const saveSetting = async <T extends keyof SettingsType>(
    setting: T,
    value: SettingsType[T]
  ) => {
    try {
      const oldSettings = settings ? settings : defaultSettings;
      const newSettings = { ...oldSettings, [setting]: value };
      const jsonSettings = JSON.stringify(newSettings);
      await AsyncStorage.setItem("@settings", jsonSettings);
      setSettings(newSettings);
    } catch (error) {
      Alert.alert("Error!", "An error has occurred.");
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem("@settings");
      settings !== null
        ? setSettings(JSON.parse(settings))
        : setSettings(defaultSettings);
    } catch (error) {
      setSettings(defaultSettings);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider
      {...props}
      value={{ settings, saveSetting, loadSettings }}
    />
  );
}

export { useSettings, SettingsProvider, difficulties };
