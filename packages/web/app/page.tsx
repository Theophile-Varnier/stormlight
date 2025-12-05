"use client";

import { useEffect, useState } from "react";
import { socket } from "../lib/socket";
import { useGameStore } from "../lib/store";
import type { DiceRoll, GameState } from "server";
import { getDiceRollFormula } from "@/lib/helpers";
import { PlayerBoard } from "@/components/PlayerBoard";

export default function Page() {
  const { dice, setStateFromServer } = useGameStore();
  const [isConnected, setIsConnected] = useState(false);
  const playerId = "player1"; // à remplacer par l'ID réel du joueur

  useEffect(() => {
    // réception de l'état initial / mises à jour du serveur
    const onServerState = (state: GameState) => {
      // note: on peut valider avec Zod ici si souhaité
      setStateFromServer(state);
    };

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("server:state", onServerState);

    // demander l'état initial (optionnel si le serveur envoie automatiquement à la connexion)
    socket.emit("client:request_state");

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("server:state", onServerState);
    };
  }, [setStateFromServer]);

  return (
    <main style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h1>Stormlight - pre-pre-alpha</h1>

      <p>
        Statut socket:{" "}
        <strong style={{ color: isConnected ? "green" : "crimson" }}>
          {isConnected ? "connecté" : "déconnecté"}
        </strong>
      </p>

      <section style={{ marginTop: 20 }}>
        <PlayerBoard
          rolls={dice.history.filter((r) => r.roller === playerId)}
          playerId={playerId}
        />
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Historique des lancers</h2>
        {dice.history.length === 0 ? (
          <p>Pas d'historique.</p>
        ) : (
          <ul>
            {dice.history.slice().map((r: DiceRoll) => (
              <li key={r.id} style={{ marginBottom: 8 }}>
                <strong>{getDiceRollFormula(r)}</strong> →{" "}
                {r.results.join(", ")} (total: {r.total}){" "}
                <span style={{ color: "#666", fontSize: 12 }}>
                  — {new Date(r.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
