import React, { ReactElement, useState } from "react";
import { View, ScrollView, TouchableOpacity, Switch } from "react-native";
import { BackgroundGradient, Text } from "@components";
import styles from "./settings.styles";
import { colors } from "@utils";

export default function Settings(): ReactElement {
  const [state, setState] = useState(false);

  const difficulties = {
    "1": "Easy",
    "3": "Normal",
    "5": "Hard",
    "-1": "Impossible",
  };

  return (
    <BackgroundGradient>
      <ScrollView style={styles.container}>
        <View style={styles.field}>
          <Text style={styles.label}>Bot Difficulty</Text>
          <View style={styles.choices}>
            {Object.keys(difficulties).map((difficulty) => {
              return (
                <TouchableOpacity style={styles.choice} key={difficulty}>
                  <Text style={styles.choiceText}>
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
            value={state}
            onValueChange={() => setState(!state)}
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
            value={state}
            onValueChange={() => setState(!state)}
          />
        </View>
      </ScrollView>
    </BackgroundGradient>
  );
}
