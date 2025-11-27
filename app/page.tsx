"use client";

import { Lobby } from "./components/Lobby";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { StormLight } from "./games/StormLight";
import { useSearchParams } from "next/navigation";

const StormLightClient = Client({
  game: StormLight,
  board: Lobby,
  multiplayer: SocketIO({ server: "localhost:8000" }),
});

const App = function () {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  console.log(`Query param is :>> `, id);
  return <StormLightClient playerID={id}></StormLightClient>;
};

export default App;
