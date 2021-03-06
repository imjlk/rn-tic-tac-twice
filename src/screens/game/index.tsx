import React, { ReactElement, useEffect, useState } from "react";
import { SafeAreaView, Dimensions, View } from "react-native";
import styles from "./game.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";
import { BackgroundGradient, Board, Button, Text } from "@components";
import {
  BoardState,
  Cell,
  getBestMove,
  isEmpty,
  isTerminal,
  useSounds,
} from "@utils";
import { useSettings, difficulties } from "@contexts/settings-context";

type GameProps = {
  navigation: StackNavigationProp<StackNavigatorParams, "Game">;
};

const SCREEN_WIDTH = Dimensions.get("screen").width;

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
  const [gamesCount, setGamesCount] = useState({
    wins: 0,
    draws: 0,
    losses: 0,
  });
  const playSound = useSounds();
  const { settings } = useSettings();

  const gameResult = isTerminal(state);

  const insertCell = (cell: number, symbol: "X" | "O"): void => {
    const stateCopy: BoardState = [...state];
    if (stateCopy[cell] || isTerminal(stateCopy)) return;

    stateCopy[cell] = symbol;
    setState(stateCopy);

    try {
      symbol === "X" ? playSound("pop1") : playSound("pop2");
    } catch (error) {
      console.log(error);
    }
  };
  const handleOnCellPressed = (cell: number): void => {
    if (turn !== "HUMAN") return;
    insertCell(cell, isHumanMaximizing ? "X" : "O");
    setTurn("BOT");
  };

  const getWinner = (winnerSymbol: Cell): "HUMAN" | "BOT" | "DRAW" => {
    if (winnerSymbol === "X") {
      return isHumanMaximizing ? "HUMAN" : "BOT";
    }
    if (winnerSymbol === "O") {
      return isHumanMaximizing ? "BOT" : "HUMAN";
    }

    return "DRAW";
  };

  const newGame = () => {
    setState([null, null, null, null, null, null, null, null, null]);
    setTurn(Math.random() < 0.5 ? "HUMAN" : "BOT");
  };

  useEffect(() => {
    if (gameResult) {
      // handle game finished

      const winner = getWinner(gameResult.winner);
      if (winner === "HUMAN") {
        playSound("win");
        setGamesCount({ ...gamesCount, wins: gamesCount.wins + 1 });
      }
      if (winner === "BOT") {
        playSound("loss");
        setGamesCount({ ...gamesCount, losses: gamesCount.losses + 1 });
      }
      if (winner === "DRAW") {
        playSound("draw");
        setGamesCount({ ...gamesCount, draws: gamesCount.draws + 1 });
      }
    } else {
      if (turn === "BOT") {
        if (isEmpty(state)) {
          const centerAndCorners = [0, 2, 4, 6, 8];
          const firstMove =
            centerAndCorners[
              Math.floor(Math.random() * centerAndCorners.length)
            ];
          insertCell(firstMove, "X");
          setIsHumanMaximizing(false);
          setTurn("HUMAN");
        } else {
          const best = getBestMove(
            state,
            !isHumanMaximizing,
            0,
            parseInt(settings ? settings.difficulty : "-1")
          );
          insertCell(best, isHumanMaximizing ? "O" : "X");
          setTurn("HUMAN");
        }
      }
    }
  }, [state, turn]);

  return (
    <BackgroundGradient>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.difficulty}>
            Diffculty:{" "}
            {settings ? difficulties[settings.difficulty] : "Impossible"}
          </Text>
        </View>
        <View style={styles.results}>
          <View style={styles.resultsBox}>
            <Text style={styles.resultsTitle}>Wins</Text>
            <Text style={styles.resultsCount}>{gamesCount.wins}</Text>
          </View>
          <View style={styles.resultsBox}>
            <Text style={styles.resultsTitle}>Draw</Text>
            <Text style={styles.resultsCount}>{gamesCount.draws}</Text>
          </View>
          <View style={styles.resultsBox}>
            <Text style={styles.resultsTitle}>Losses</Text>
            <Text style={styles.resultsCount}>{gamesCount.losses}</Text>
          </View>
        </View>
        <Board
          disabled={Boolean(isTerminal(state)) || turn !== "HUMAN"}
          onCellPressed={(cell) => {
            handleOnCellPressed(cell);
          }}
          state={state}
          gameResult={gameResult}
          size={SCREEN_WIDTH - 60}
        />

        {gameResult && (
          <View style={styles.modal}>
            <Text style={styles.modalText}>
              {getWinner(gameResult.winner) === "HUMAN" && "You WON"}
              {getWinner(gameResult.winner) === "DRAW" && "It's a Draw"}
              {getWinner(gameResult.winner) === "BOT" && "You LOST"}
            </Text>
            <Button title="Play Again" onPress={() => newGame()} />
          </View>
        )}
      </SafeAreaView>
    </BackgroundGradient>
  );
}
