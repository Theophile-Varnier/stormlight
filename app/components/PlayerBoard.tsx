import { DefaultClientState, Roll } from "../game/StormLight";
import { useState, useCallback, useEffect } from "react";
import { DiceBox } from "../../dice-box-threejs/DiceBox";
import { Title } from "@mantine/core";

export function PlayerBoard(
  params: DefaultClientState & { playerName?: string }
) {
  const { G, playerID, playerName } = params;
  const [box, setBox] = useState<DiceBox | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [lastRollTimestamp, setLastRollTimestamp] = useState<number>(0);
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
          shadows: true,
          baseScale: 60,
          strength: 2,
          onRollComplete: (results) => {
            console.log(`I've got results :>> `, results);
          },
          sounds: false,
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
              scale: 1,
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
    if (box && initialized && G.rolls[playerID]) {
      if (G.rolls[playerID].lastRollTimestamp > lastRollTimestamp) {
        const playerRolls = G.rolls[playerID];
        const diceToRoll =
          playerRolls.lastRoll.map((r: Roll) => `1${r.name}`).join(" + ") +
          "@" +
          playerRolls.lastRoll.map((r: Roll) => `${r.result}`).join(",");
        setLastRollTimestamp(playerRolls.lastRollTimestamp);
        box.roll(diceToRoll);
      }
    }
  }, [box, G, lastRollTimestamp, playerID, initialized]);

  return (
    <div>
      <div
        ref={mainRef}
        id={"scene-container" + playerID}
        style={{
          backgroundColor: "rgba(256, 256, 256, 0.5)",
          minHeight: "250px",
        }}
      ></div>
      <Title order={1}>
        {playerName} - {playerID}
      </Title>
    </div>
  );
}
