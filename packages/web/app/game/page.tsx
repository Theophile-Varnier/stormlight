"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Board } from "@/components/Board";

const Game = function () {
  const [gameInfo, setGameInfo] = useState<{
    matchID: string;
    playerName: string;
  } | null>(null);
  const searchParams = useSearchParams();
  useEffect(() => {
    (async () => {
      let savedInfo = localStorage.getItem("gameInfo");
      if (!savedInfo) {
        if (searchParams.get("matchID")) {
          savedInfo = `{ "matchID": "${searchParams.get(
            "matchID"
          )}", "playerName": null}`;
        }
      }
      setGameInfo(savedInfo ? JSON.parse(savedInfo) : null);
    })();
  }, [searchParams]);
  return gameInfo ? (
    <Board matchID={gameInfo.matchID} playerName={gameInfo.playerName}></Board>
  ) : (
    <p>Loading...</p>
  );
};

export default Game;
