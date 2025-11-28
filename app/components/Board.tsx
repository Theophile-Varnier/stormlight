import { DiceBox } from "../../dice-box-threejs/DiceBox";
import { useCallback, useEffect, useState } from "react";
import { Roll } from "../games/StormLight";

export function Board({ ctx, G, moves, playerID }: any) {
  const [box, setBox] = useState<DiceBox | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [rolledRolls, setRolledRolls] = useState<Roll[]>([]);
  const defaultRolls: Roll[] = [
    { faces: 20, name: "d20", result: 2 },
    { faces: 8, name: "d8", result: 2 },
    { faces: 6, name: "dplot", result: 2 },
  ];
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
          presets: {
            dplot: {
              name: "Plot Die",
              type: "d6",
              labels: [
                "textures/d1.png",
                "textures/d2.png",
                "textures/d3.png",
                "textures/d3.png",
                "textures/d4.png",
                "textures/d4.png",
              ],
              setBumpMaps: [
                "textures/d1.png",
                "textures/d2.png",
                "textures/d3.png",
                "textures/d3.png",
                "textures/d4.png",
                "textures/d4.png",
              ],
              values: [1, 6],
              scale: 0.9,
              system: "dweird",
              colorset: "coin_silver",
            },
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
    if (box && initialized) {
      if (G.rolls.length > rolledRolls.length) {
        const playerRolls = G.rolls[G.rolls.length - 1];
        const diceToRoll =
          playerRolls.rolls.map((r: Roll) => `1${r.name}`).join(" + ") +
          "@" +
          playerRolls.rolls.map((r: Roll) => `${r.result}`).join(",");
        box.roll(diceToRoll).then(() => {
          setRolledRolls(G.rolls);
        });
      }
    }
  }, [box, G, rolledRolls, initialized]);
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
            moves.roll(defaultRolls);
          }}
        >
          Roll Dice
        </button>
      </div>
    </div>
  );
}
