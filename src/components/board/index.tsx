import React, { ReactElement } from "react";
import { View, TouchableOpacity } from "react-native";
import Text from "../text";
import { BoardState, BoardResult } from "@utils";
import BoardLine from "./board-line";

type BoardProps = {
  state: BoardState;
  size: number;
  disabled: boolean;
  gameResult?: BoardResult | false;
  onCellPressed?: (index: number) => void;
};

export default function Board({
  state,
  size,
  disabled,
  gameResult,
  onCellPressed,
}: BoardProps): ReactElement {
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: "green",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {state.map((cell, index) => {
        return (
          <TouchableOpacity
            style={{
              width: "33.3333%",
              height: "33.3333%",
              backgroundColor: "white",
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            key={index}
            disabled={cell !== null || disabled}
            onPress={() => onCellPressed && onCellPressed(index)}
          >
            <Text
              style={{
                fontSize: size / 8,
              }}
            >
              {cell}
            </Text>
          </TouchableOpacity>
        );
      })}
      {true && (
        <BoardLine
          size={size}
          gameResult={{ winner: "o", diagonal: "MAIN", direction: "D" }}
        />
      )}
    </View>
  );
}
