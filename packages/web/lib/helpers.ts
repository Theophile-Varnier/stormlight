import { DiceRoll } from "server";

export function getDiceRollFormula(dice: DiceRoll): string {
  return dice.dice.map((d) => `${d.count}${d.name}`).join(" + ");
}
