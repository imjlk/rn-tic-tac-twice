import React, { ReactElement, useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native";
import styles from "./game.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";
import { BackgroundGradient, Board } from "@components";
import { BoardState, getBestMove, isEmpty, isTerminal } from "@utils";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

type GameProps = {
  navigation: StackNavigationProp<StackNavigatorParams, "Game">;
};

export default function Game({ navigation }: GameProps): ReactElement {
  //prettier-ignore
  const [state, setState] = useState<BoardState>([
    null,null,null,
    null,null,null,
    null,null,null,
  ])
  const [turn, setTurn] = useState<"HUMAN" | "BOT">(
    Math.random() < 0.5 ? "HUMAN" : "BOT"
  );
  const [isHumanMaximizing, setIsHumanMaximizing] = useState<boolean>(true);
  const popSoundRef = useRef<Audio.Sound | null>(null);
  const pop2SoundRef = useRef<Audio.Sound | null>(null);

  const gameResult = isTerminal(state);

  const insertCell = (cell: number, symbol: "x" | "o"): void => {
    const stateCopy: BoardState = [...state];
    if (stateCopy[cell] || isTerminal(stateCopy)) return;

    stateCopy[cell] = symbol;
    setState(stateCopy);

    try {
      symbol === "x"
        ? popSoundRef.current?.replayAsync()
        : pop2SoundRef.current?.replayAsync();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // TODO: Adjust sentry
      console.log(error);
    }
  };
  const handleOnCellPressed = (cell: number): void => {
    if (turn !== "HUMAN") return;
    insertCell(cell, isHumanMaximizing ? "x" : "o");
    setTurn("BOT");
  };

  useEffect(() => {
    if (gameResult) {
      // handle game finished
      alert("Game Over");
    } else {
      if (turn === "BOT") {
        if (isEmpty(state)) {
          const centerAndCorners = [0, 2, 4, 6, 8];
          const firstMove =
            centerAndCorners[
              Math.floor(Math.random() * centerAndCorners.length)
            ];
          insertCell(firstMove, "x");
          setIsHumanMaximizing(false);
          setTurn("HUMAN");
        } else {
          const best = getBestMove(state, !isHumanMaximizing, 0, 1);
          insertCell(best, isHumanMaximizing ? "o" : "x");
          setTurn("HUMAN");
        }
      }
    }
  }, [state, turn]);

  useEffect(() => {
    // load sounds
    const popSoundObject = new Audio.Sound();
    const pop2SoundObject = new Audio.Sound();

    const loadSounds = async () => {
      /* eslint-disable @typescript-eslint/no-var-requires */
      await popSoundObject.loadAsync(require("@assets/pop-1.wav"));
      popSoundRef.current = popSoundObject;
      await pop2SoundObject.loadAsync(require("@assets/pop-2.wav"));
      pop2SoundRef.current = pop2SoundObject;
    };

    loadSounds();
    return () => {
      // unload sounds
      popSoundObject && popSoundObject.unloadAsync();
      pop2SoundObject && pop2SoundObject.unloadAsync();
    };
  }, []);

  return (
    <BackgroundGradient>
      <SafeAreaView style={styles.container}>
        <Board
          disabled={Boolean(isTerminal(state)) || turn !== "HUMAN"}
          onCellPressed={(cell) => {
            handleOnCellPressed(cell);
          }}
          state={state}
          size={300}
        />
      </SafeAreaView>
    </BackgroundGradient>
  );
}
