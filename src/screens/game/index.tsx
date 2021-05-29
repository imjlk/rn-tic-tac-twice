import React, { ReactElement, useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native";
import styles from "./game.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";
import { BackgroundGradient, Board } from "@components";
import { BoardState, Cell, getBestMove, isEmpty, isTerminal } from "@utils";
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
  const winSoundRef = useRef<Audio.Sound | null>(null);
  const lossSoundRef = useRef<Audio.Sound | null>(null);
  const drawSoundRef = useRef<Audio.Sound | null>(null);

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

  const getWinner = (winnerSymbol: Cell): "HUMAN" | "BOT" | "DRAW" => {
    if (winnerSymbol === "x") {
      return isHumanMaximizing ? "HUMAN" : "BOT";
    }
    if (winnerSymbol === "o") {
      return isHumanMaximizing ? "BOT" : "HUMAN";
    }

    return "DRAW";
  };

  useEffect(() => {
    if (gameResult) {
      // handle game finished

      const winner = getWinner(gameResult.winner);
      if (winner === "HUMAN") {
        try {
          winSoundRef.current?.replayAsync();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
          console.log(error);
        }
        alert("You Won");
      }
      if (winner === "BOT") {
        try {
          lossSoundRef.current?.replayAsync();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } catch (error) {
          console.log(error);
        }
        alert("You Lost");
      }
      if (winner === "DRAW") {
        try {
          drawSoundRef.current?.replayAsync();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } catch (error) {
          console.log(error);
        }
        alert("It's a Draw");
      }
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
          const best = getBestMove(state, !isHumanMaximizing, 0, -1);
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
    const winSoundObject = new Audio.Sound();
    const lossSoundObject = new Audio.Sound();
    const drawSoundObject = new Audio.Sound();

    const loadSounds = async () => {
      /* eslint-disable @typescript-eslint/no-var-requires */
      await popSoundObject.loadAsync(require("@assets/pop-1.wav"));
      popSoundRef.current = popSoundObject;
      await pop2SoundObject.loadAsync(require("@assets/pop-2.wav"));
      pop2SoundRef.current = pop2SoundObject;
      await winSoundObject.loadAsync(require("@assets/win.wav"));
      winSoundRef.current = winSoundObject;
      await lossSoundObject.loadAsync(require("@assets/loss.wav"));
      lossSoundRef.current = lossSoundObject;
      await drawSoundObject.loadAsync(require("@assets/draw.wav"));
      drawSoundRef.current = drawSoundObject;
    };

    loadSounds();
    return () => {
      // unload sounds
      popSoundObject && popSoundObject.unloadAsync();
      pop2SoundObject && pop2SoundObject.unloadAsync();
      winSoundObject && winSoundObject.unloadAsync();
      lossSoundObject && lossSoundObject.unloadAsync();
      drawSoundObject && drawSoundObject.unloadAsync();
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
