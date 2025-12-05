import { useState, useCallback, useEffect } from "react";
import { DiceBox } from "../lib/dice-box-threejs/DiceBox";
import { Dice, DiceRoll } from "server";
import { Title } from "@mantine/core";

export function PlayerBoard({
  roll,
  playerName,
}: {
  roll: DiceRoll | null;
  playerName: string;
}) {
  const [box, setBox] = useState<DiceBox | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [lastRollTimestamp, setLastRollTimestamp] = useState<number>(0);
  const mainRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node !== null && !box) {
        const b = new DiceBox(`#${node.id}`, {
          // theme_customColorset: {
          //   background: "#00aacb",
          //   foreground: "#ffffff",
          // },
          theme_colorset: "ice",
          light_intensity: 1,
          gravity_multiplier: 600,
          shadows: true,
          baseScale: 60,
          strength: 2,
          onRollComplete: (results) => {
            console.log(`I've got results :>> `, results);
          },
          sounds: false,
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
    if (box && initialized && roll) {
      if (roll.timestamp > lastRollTimestamp) {
        const diceToRoll =
          roll.dice.map((r: Dice) => `${r.count}${r.name}`).join(" + ") +
          "@" +
          roll.results.map((r: number) => `${r}`).join(",");
        setLastRollTimestamp(roll.timestamp);
        box.roll(diceToRoll);
      }
    }
  }, [box, lastRollTimestamp, roll, initialized]);

  return (
    <div>
      <div
        ref={mainRef}
        id={"scene-container" + playerName}
        style={{
          backgroundColor: "rgba(256, 256, 256, 0.5)",
          minHeight: "250px",
        }}
      ></div>
      <Title order={1}>{playerName}</Title>
    </div>
  );
}
