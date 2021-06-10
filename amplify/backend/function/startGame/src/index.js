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

  const initiator = event.identity.username;
  const invitee = event.arguments.invitee;

  // 1. Make sure initiator and inivitee exist
  const playerQuery = gql`
    query getPlayer($username: String!) {
      getPlayer(username: $username) {
        id
      }
    }
  `;
  const initiatorResponse = await graphqlClient.query({
    query: playerQuery,
    variables: {
      username: initiator,
    },
  });
  const inviteeResponse = await graphqlClient.query({
    query: playerQuery,
    variables: {
      username: invitee,
    },
  });

  console.log(initiatorResponse, inviteeResponse);

  if (!initiatorResponse.data.getPlayer || !inviteeResponse.data.getPlayer) {
    console.log("At least 1 player does not exist.");
    throw new Error("At least 1 player does not exist.");
  }

  if (
    initiatorResponse.data.getPlayer.id === inviteeResponse.data.getPlayer.id
  ) {
    console.log("Initiator cannot invite himself.");
    throw new Error("Initiator cannot invite himself.");
  }

  // 2. Creating a new Game Object
  const gameMutation = gql`
    mutation createGame(
      $gameState: GameState!
      $owners: [String!]!
      $initiator: String!
      $turn: String!
      $boardState: [Symbol]!
    ) {
      createGame(
        input: {
          gameState: $gameState
          owners: $owners
          initiator: $initiator
          turn: $turn
          boardState: $boardState
        }
      ) {
        id
        gameState
        boardState
        turn
        winner
      }
    }
  `;
  const gameResponse = await graphqlClient.mutate({
    mutation: gameMutation,
    variables: {
      gameState: "REQUESTED",
      owners: [initiator, invitee],
      initiator: initiator,
      turn: Math.random() < 0.5 ? initiator : invitee,
      boardState: [null, null, null, null, null, null, null, null, null],
    },
  });

  console.log(gameResponse);

  // 3. Linking the game with the players (by creating a playerGame model)
  const playerGameMutation = gql`
    mutation createPlayerGame(
      $gameID: ID!
      $playerUsername: String!
      $owners: [String!]!
    ) {
      createPlayerGame(
        input: {
          gameID: $gameID
          playerUsername: $playerUsername
          owners: $owners
        }
      ) {
        id
      }
    }
  `;
  const initiatorPlayerGameResponse = await graphqlClient.mutate({
    mutation: playerGameMutation,
    variables: {
      gameID: gameResponse.data.createGame.id,
      playerUsername: initiator,
      owners: [initiator, invitee],
    },
  });
  const inviteePlayerGameResponse = await graphqlClient.mutate({
    mutation: playerGameMutation,
    variables: {
      gameID: gameResponse.data.createGame.id,
      playerUsername: invitee,
      owners: [initiator, invitee],
    },
  });

  console.log(initiatorPlayerGameResponse, inviteePlayerGameResponse);

  // 4. Send a push notification to the invitee

  return {
    id: gameResponse.data.createGame.id,
    gameState: gameResponse.data.createGame.gameState,
    turn: gameResponse.data.createGame.turn,
    boardState: gameResponse.data.createGame.boardState,
    winner: gameResponse.data.createGame.winner,
  };
};
