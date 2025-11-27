import DiceBox from "@3d-dice/dice-box-threejs";
import { useCallback, useEffect, useState } from "react";

export function Lobby({ ctx, G, moves, playerID }: any) {
  const [box, setBox] = useState<DiceBox | null>(null);
  const [initialized, setInitialized] = useState(false);
  const mainRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node !== null && !box) {
        const b = new DiceBox(`#${node.id}`, {
          theme_customColorset: {
            background: "#00aacb",
            foreground: "#ffffff",
          },
          light_intensity: 1,
          gravity_multiplier: 600,
          baseScale: 100,
          strength: 2,
          onRollComplete: (results) => {
            console.log(`I've got results :>> `, results);
          },
        });
        b.initialize().then(() => {
          setInitialized(true);
        });
        setBox(b);
      }
    },
    [box]
  );
  useEffect(() => {
    if (box && initialized && G.nextRoll) {
      box.roll(G.nextRoll);
    }
  }, [box, G, initialized]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: "20px",
      }}
    >
      <div
        ref={mainRef}
        id="scene-container"
        style={{
          width: "50%",
          height: "50%",
          backgroundColor: "rgba(256, 256, 256, 0.5)",
        }}
      ></div>
      <div>
        <button
          onClick={() => {
            console.log("Roll dice!");
            moves.roll(`1d20@${Math.ceil(Math.random() * 20)}`);
          }}
        >
          Roll Dice
        </button>
      </div>
    </div>
  );
}
