import { Checkbox, Group, NumberInput, Select, Stack } from "@mantine/core";
import { useState } from "react";
import { Dice } from "server";

export function DiceParams({ onRoll }: { onRoll: (dice: Dice[]) => void }) {
  const [advantage, setAdvantage] = useState(false);
  const [damageDice, setDamageDice] = useState(false);
  const [numDamageDice, setNumDamageDice] = useState(1);
  const [damageDieType, setDamageDieType] = useState(6);
  const [adDamageDice, setAdDamageDice] = useState(false);
  const [plotDie, setPlotDie] = useState(false);
  const [adPlotDie, setAdPlotDie] = useState(false);
  const damageDiceTypes = [4, 6, 8, 10, 12];

  const roll = () => {
    const diceToRoll = [{ count: 1, faces: 20, name: "d20" }];
    if (advantage) {
      diceToRoll.push({ count: 1, faces: 20, name: "dad20" });
    }
    if (damageDice) {
      const damageDie = {
        count: numDamageDice,
        faces: damageDieType,
        name: `d${damageDieType}`,
      };
      diceToRoll.push(damageDie);
      if (adDamageDice) {
        diceToRoll.push({ ...damageDie, name: `dad${damageDieType}` });
      }
    }
    if (plotDie) {
      diceToRoll.push({ count: adPlotDie ? 2 : 1, faces: 6, name: "dplot" });
    }
    onRoll(diceToRoll);
  };

  return (
    <div style={{ marginTop: 12 }}>
      <Stack align="flex-start">
        <Checkbox
          checked={advantage}
          onChange={(e) => setAdvantage(e.currentTarget.checked)}
          label="Avantage/désavantage"
        />
        <Group>
          <Checkbox
            checked={damageDice}
            onChange={(e) => setDamageDice(e.currentTarget.checked)}
            label="Dés de dégâts"
          />
          {damageDice && (
            <NumberInput
              value={numDamageDice}
              allowDecimal={false}
              allowNegative={false}
              onChange={(value) =>
                setNumDamageDice(
                  typeof value === "number" ? value : parseInt(value)
                )
              }
              min={1}
            />
          )}
          {damageDice && (
            <Select
              value={damageDieType.toString()}
              data={damageDiceTypes.map((type) => ({
                value: type.toString(),
                label: `d${type}`,
              }))}
              onChange={(e) => setDamageDieType(parseInt(e, 10))}
            ></Select>
          )}
          {damageDice && (
            <Checkbox
              checked={adDamageDice}
              onChange={(e) => setAdDamageDice(e.currentTarget.checked)}
              label="Avantage/désavantage"
            />
          )}
        </Group>
        <Group>
          <Checkbox
            checked={plotDie}
            onChange={(e) => setPlotDie(e.currentTarget.checked)}
            label="Dé de scénario"
          />
          {plotDie && (
            <Checkbox
              checked={adPlotDie}
              onChange={(e) => setAdPlotDie(e.currentTarget.checked)}
              label="Avantage/désavantage"
            />
          )}
        </Group>
        <button
          onClick={roll}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            cursor: "pointer",
            background: "#0ea5a4",
            color: "white",
            border: "none",
          }}
        >
          Lancer
        </button>
      </Stack>
    </div>
  );
}
