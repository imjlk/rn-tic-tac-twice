import { BoardState, Cell } from "./types";
import { isTerminal, getAvailableMoves, printFormattedBoard } from "./board";

export const getBestMove = (
  state: BoardState,
  maximizing: boolean,
  depth = 0,
  maxDepth = -1
): number => {
  const childValues: { [key: string]: string } = {};

  const getBestMoveRescursive = (
    state: BoardState,
    maximizing: boolean,
    depth = 0,
    maxDepth = -1
  ): number => {
    // Base condition for recursive
    const terminalObject = isTerminal(state);
    if (terminalObject || depth === maxDepth) {
      if (terminalObject && terminalObject.winner === "X") {
        return 100 - depth;
      } else if (terminalObject && terminalObject.winner === "O") {
        return -100 + depth;
      }
      return 0;
    }

    if (maximizing) {
      let best = -100;
      getAvailableMoves(state).forEach((index) => {
        const child: BoardState = [...state];
        child[index] = "X";
        // console.log(`Child board (x turn) (depth: ${depth})`);
        // printFormattedBoard(child);
        const childValue = getBestMove(child, false, depth + 1, maxDepth);
        // console.log("childValue", childValue);
        best = Math.max(best, childValue);
        if (depth === 0) {
          childValues[childValue] = childValues[childValue]
            ? `${childValues[childValue]}, ${index}`
            : `${index}`;
        }
      });

      // console.log(`best: ${best}`);
      // console.log(`childValues: ${childValues}`);

      if (depth === 0) {
        const arr = childValues[best].split(",");
        const rand = Math.floor(Math.random() * arr.length);
        return parseInt(arr[rand]);
      }
      return best;
    } else {
      let best = 100;
      getAvailableMoves(state).forEach((index) => {
        const child: BoardState = [...state];
        child[index] = "O";
        // console.log(`Child board (x turn) (depth: ${depth})`);
        // printFormattedBoard(child);
        const childValue = getBestMove(child, true, depth + 1, maxDepth);
        // console.log("childValue", childValue);
        best = Math.min(best, childValue);
        if (depth === 0) {
          childValues[childValue] = childValues[childValue]
            ? `${childValues[childValue]}, ${index}`
            : `${index}`;
        }
      });

      // console.log(`best: ${best}`);
      // console.log(`childValues: ${childValues}`);

      if (depth === 0) {
        const arr = childValues[best].split(",");
        const rand = Math.floor(Math.random() * arr.length);
        return parseInt(arr[rand]);
      }
      return best;
    }
  };

  return getBestMoveRescursive(state, maximizing, depth, maxDepth);
};
