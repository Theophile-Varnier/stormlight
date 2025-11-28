import { Roll, DefaultClientState } from "../game/StormLight";
import { LobbyClient } from "boardgame.io/client";
import { LobbyAPI } from "boardgame.io";
import { PlayerBoard } from "./PlayerBoard";
import { useState, useEffect } from "react";
import { Stack, Group } from "@mantine/core";

export function Board(params: DefaultClientState) {
  const { moves, playerID, matchID } = params;
  const [game, setGame] = useState<LobbyAPI.Match | null>(null);
  const defaultRolls: Roll[] = [
    { faces: 20, name: "d20", result: 2 },
    { faces: 8, name: "d8", result: 2 },
    { faces: 6, name: "dplot", result: 2 },
  ];

  useEffect(() => {
    const lobbyClient = new LobbyClient({ server: "http://localhost:8000" });
    lobbyClient.getMatch("StormLight", matchID).then((data) => setGame(data));
  }, [matchID]);

  return (
    game && (
      <Stack
        style={{ minHeight: "100vh" }}
        align="center"
        justify="space-around"
        gap="md"
      >
        <div>
          <button
            onClick={() => {
              moves.roll(defaultRolls);
            }}
          >
            Roll Dice
          </button>
        </div>
        <PlayerBoard
          {...params}
          playerName={
            game?.players.find((p) => p.id == parseInt(playerID))?.name
          }
        />
        <Group justify="center">
          {game.players
            .filter((p) => p.name && p.id != parseInt(playerID))
            .map((p) => (
              <PlayerBoard
                {...params}
                key={p.id}
                playerID={p.id.toString()}
                playerName={p.name}
              />
            ))}
        </Group>
      </Stack>
    )
  );
}
