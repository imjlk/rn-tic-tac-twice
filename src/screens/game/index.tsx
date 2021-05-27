import React, { ReactElement, useState } from "react";
import { SafeAreaView } from "react-native";
import styles from "./game.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";
import { BackgroundGradient, Board } from "@components";
import { BoardState, isTerminal } from "@utils";

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

  const handleOnCellPressed = (cell: number): void => {
    const stateCopy: BoardState = [...state];
    if (stateCopy[cell] || isTerminal(stateCopy)) return;

    stateCopy[cell] = "x";
    setState(stateCopy);
  };

  return (
    <BackgroundGradient>
      <SafeAreaView style={styles.container}>
        <Board
          disabled={Boolean(isTerminal(state))}
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
