/* Amplify Params - DO NOT EDIT
    API_TICTACTWICE_GRAPHQLAPIENDPOINTOUTPUT
    API_TICTACTWICE_GRAPHQLAPIIDOUTPUT
    API_TICTACTWICE_GRAPHQLAPIKEYOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */

const appsync = require("aws-appsync");
const gql = require("graphql-tag");
require("cross-fetch/polyfill");
const isTerminal = require("./isTerminal");

const getGame = gql`
  query getGame($id: ID!) {
    getGame(id: $id) {
      id
      turn
      gameState
      boardState
      winner
      owners
      initiator
    }
  }
`;

const updateGame = gql`
  mutation updateGame(
    $id: ID!
    $turn: String!
    $winner: String
    $gameState: GameState!
    $boardState: [Symbol]!
    $player: String!
  ) {
    updateGame(
      input: {
        id: $id
        turn: $turn
        winner: $winner
        gameState: $gameState
        boardState: $boardState
      }
      condition: { turn: { eq: $player } }
    ) {
      id
      turn
      gameState
      boardState
      winner
    }
  }
`;
exports.handler = async (event, context, callback) => {
  const graphqlClient = new appsync.AWSAppSyncClient({
    url: process.env.API_TICTACTWICE_GRAPHQLAPIENDPOINTOUTPUT,
    region: process.env.REGION,
    auth: {
      type: "AWS_IAM",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
      },
    },
    disableOffline: true,
  });

  const player = event.identity.username;
  const gameID = event.arguments.game;
  const index = event.arguments.index;

  // 1. Get game object from the id and make sure it exists
  const gameResponse = await graphqlClient.query({
    query: getGame,
    variables: {
      id: gameID,
    },
  });
  const game = gameResponse.data.getGame;

  if (!game) {
    console.log("Game not found.");
    throw new Error("Game not found.");
  }

  // 2. Make sure the game is active
  if (game.gameState !== "REQUESTED" && game.gameState !== "ACTIVE") {
    console.log("Game is not active.");
    throw new Error("Game is not active.");
  }

  // 3. Check that the current user is a participant in the game and that it's his turn
  if (!game.owners.includes(player)) {
    console.log("Logged in player is not participating in this game.");
    throw new Error("Logged in player is not participating in this game.");
  }
  if (game.turn !== player) {
    console.log("It's not your turn.");
    throw new Error("It's not your turn.");
  }

  // 4. Make sure that the index is valid (not > 8 and not already occupied)
  if (index > 8 || game.boardState[index]) {
    console.log("Invalid index or cell is already occupied.");
    throw new Error("Invalid index or cell is already occupied.");
  }

  // 5. Update the boardState, check if the move is a terminal one & update the winner, gameState, turn
  const symbol = player === game.initiator ? "X" : "O";
  const nextTurn = game.owners.find((p) => p !== game.turn);
  const invitee = game.owners.find((p) => p !== game.initiator);
  const newBoardState = [...game.boardState];
  newBoardState[index] = symbol;
  let newGameState = "ACTIVE";
  let newWinner = null;

  const terminalState = isTerminal(newBoardState);
  if (terminalState) {
    newGameState = "FINISHED";
    if (terminalState.winner === "X") {
      newWinner = game.initiator;
    }
    if (terminalState.winner === "O") {
      newWinner = invitee;
    }
  }

  const updateGameResponse = await graphqlClient.mutate({
    mutation: updateGame,
    variables: {
      id: gameID,
      turn: nextTurn,
      winner: newWinner,
      gameState: newGameState,
      boardState: newBoardState,
      player: player,
    },
  });

  // 6. return the updated game object.
  return updateGameResponse.data.updateGame;
};
