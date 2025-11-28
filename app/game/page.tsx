"use client";

import { Board } from "../components/Board";
import { Client } from "boardgame.io/react";
import { LobbyAPI } from "boardgame.io";
import { SocketIO } from "boardgame.io/multiplayer";
import { StormLight } from "./StormLight";
import { useEffect, useState } from "react";

const StormLightClient = Client({
  game: StormLight,
  board: Board,
  multiplayer: SocketIO({ server: "localhost:8000" }),
});

const Games = function () {
  const [gameInfo, setGameInfo] = useState<{
    matchID: string;
    playerID: string;
    credentials: string;
  } | null>(null);

  useEffect(() => {
    const savedInfo = localStorage.getItem("gameInfo");
    setGameInfo(savedInfo ? JSON.parse(savedInfo) : null);
  }, []);
  return gameInfo ? (
    <StormLightClient
      matchID={gameInfo.matchID}
      playerID={gameInfo.playerID}
      credentials={gameInfo.credentials}
    ></StormLightClient>
  ) : (
    <p>Loading...</p>
  );
};

export default Games;
