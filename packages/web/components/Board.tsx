import { PlayerBoard } from "./PlayerBoard";
import { Stack, Group } from "@mantine/core";
import { Dice } from "server";
import { socket } from "@/lib/socket";
import { useEffect } from "react";
import { DiceParams } from "./DiceParams";
import { useGameStore } from "@/lib/store";
import { trpc } from "@/lib/trpc";

export function Board(params: { matchID: string; playerName: string }) {
  const { playerName, matchID } = params;
  const gameState = useGameStore((state) => state.dice);
  const setGameState = useGameStore((state) => state.setStateFromServer);

  const roll = (diceToRoll: Dice[]) => {
    socket.emit("client:action", {
      type: "ROLL_DICE",
      payload: diceToRoll,
      playerId: playerName, // à remplacer par l'ID réel du joueur
    });
  };

  useEffect(() => {
    (async () => {
      const game = await trpc.getGameState.query({ roomId: matchID });
      setGameState(game);
    })();
  }, []);

  useEffect(() => {
    socket.emit("room:join", { roomId: matchID });
  }, [matchID]);

  useEffect(() => {
    socket.on("server:state", (gameState) => {
      setGameState(gameState);
    });
    return () => {
      socket.off("server:state");
    };
  }, [setGameState]);

  return (
    gameState && (
      <Stack
        style={{ minHeight: "100vh" }}
        align="center"
        justify="space-around"
        gap="md"
      >
        {playerName && <DiceParams onRoll={roll}></DiceParams>}
        {playerName && gameState[playerName] && (
          <PlayerBoard
            playerName={playerName}
            roll={gameState[playerName].currentRoll}
          />
        )}
        <Group justify="center">
          {Object.entries(gameState).map(
            ([name, state]) =>
              name !== playerName && (
                <PlayerBoard
                  key={name}
                  playerName={name}
                  roll={state.currentRoll}
                />
              )
          )}
        </Group>
      </Stack>
    )
  );
}
