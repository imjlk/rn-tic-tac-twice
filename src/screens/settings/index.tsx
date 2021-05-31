import React, { ReactElement, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { BackgroundGradient, Text } from "@components";
import styles from "./settings.styles";
import { colors } from "@utils";
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

const defaultSettings: SettingsType = {
  difficulty: "-1",
  haptics: true,
  sounds: true,
};

export default function Settings(): ReactElement | null {
  const [settings, setSettings] = useState<SettingsType | null>(null);

  // TODO: Generic Type
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

  if (!settings) return null;

  return (
    <BackgroundGradient>
      <ScrollView style={styles.container}>
        <View style={styles.field}>
          <Text style={styles.label}>Bot Difficulty</Text>
          <View style={styles.choices}>
            {Object.keys(difficulties).map((difficulty) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.choice,
                    {
                      backgroundColor:
                        settings.difficulty === difficulty
                          ? colors.lightPurple
                          : colors.lightGreen,
                    },
                  ]}
                  key={difficulty}
                  onPress={() =>
                    saveSetting(
                      "difficulty",
                      difficulty as keyof typeof difficulties
                    )
                  }
                >
                  <Text
                    style={[
                      styles.choiceText,
                      {
                        color:
                          settings.difficulty === difficulty
                            ? colors.lightGreen
                            : colors.darkPurple,
                      },
                    ]}
                  >
                    {difficulties[difficulty as keyof typeof difficulties]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={[styles.field, styles.switchField]}>
          <Text style={styles.label}>Sounds</Text>
          <Switch
            trackColor={{
              false: colors.purple,
              true: colors.lightPurple,
            }}
            thumbColor={colors.lightGreen}
            ios_backgroundColor={colors.purple}
            value={settings.sounds}
            onValueChange={() => saveSetting("sounds", !settings.sounds)}
          />
        </View>
        <View style={[styles.field, styles.switchField]}>
          <Text style={styles.label}>Haptics Vibrations</Text>
          <Switch
            trackColor={{
              false: colors.purple,
              true: colors.lightPurple,
            }}
            thumbColor={colors.lightGreen}
            ios_backgroundColor={colors.purple}
            value={settings.haptics}
            onValueChange={() => saveSetting("haptics", !settings.haptics)}
          />
        </View>
      </ScrollView>
    </BackgroundGradient>
  );
}
