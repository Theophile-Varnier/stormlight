"use client";

import { Board } from "./components/Board";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { StormLight } from "./games/StormLight";
import { useSearchParams } from "next/navigation";
import { Lobby } from "boardgame.io/react";

const StormLightClient = Client({
  game: StormLight,
  board: Board,
  multiplayer: SocketIO({ server: "localhost:8000" }),
});

const App = function () {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  console.log(`Query param is :>> `, id);
  return (
    <Lobby
      gameServer={`http://localhost:8000`}
      lobbyServer={`http://localhost:8000`}
      gameComponents={[{ game: StormLight, board: Board }]}
    />
  );
};

export default App;
